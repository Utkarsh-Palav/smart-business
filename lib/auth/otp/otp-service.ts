import { controlPrisma } from "@/lib/db/control";
import { randomInt } from "crypto";
import "server-only";
import { hashOtp, verifyOtp } from "./otp-hash";
import { getEmailProvider } from "@/lib/email/provider";
import { buildOtpEmail } from "./otp-email";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const OTP_MAX_ATTEMPTS = 5;

export type OtpChannel = "EMAIL" | "PHONE";

export class OtpError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_CHANNEL"
      | "RESEND_COOLDOWN"
      | "OTP_EXPIRED"
      | "OTP_INVALID"
      | "OTP_MAX_ATTEMPTS"
      | "OTP_NOT_FOUND"
      | "EMAIL_DELIVERY_FAILED",
  ) {
    super(message);
    this.name = "OtpError";
  }
}

export type CreateOtpInput = {
  identifier: string;
  channel: OtpChannel;
  userId?: string;
};

export type CreateOtpResult = {
  challengeId: string;
  expiresAt: Date;

  /**
   * Development/testing only.
   *
   * This MUST NOT be returned by production API routes.
   */
  developmentCode?: string;
};

export type VerifyOtpInput = {
  challengeId: string;
  code: string;
};

export type VerifyOtpResult = {
  userId: string | null;
  identifier: string;
  channel: OtpChannel;
};

export class OtpService {
  async createOtp(input: CreateOtpInput): Promise<CreateOtpResult> {
    const identifier = this.normalizeIdentifier(
      input.identifier,
      input.channel,
    );

    const now = new Date();

    const recentChallenge = await controlPrisma.otpChallenge.findFirst({
      where: {
        identifier,
        channel: input.channel,
        createdAt: {
          gt: new Date(now.getTime() - OTP_RESEND_COOLDOWN_MS),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (recentChallenge) {
      throw new OtpError(
        "Please wait before requesting another OTP.",
        "RESEND_COOLDOWN",
      );
    }

    // Invalidate previous unused challenges.
    await controlPrisma.otpChallenge.updateMany({
      where: {
        identifier,
        channel: input.channel,
        verifiedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      data: {
        expiresAt: now,
      },
    });

    const code = this.generateCode();
    const codeHash = hashOtp(code);

    const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

    const challenge = await controlPrisma.otpChallenge.create({
      data: {
        identifier,
        channel: input.channel,
        codeHash,
        expiresAt,
        maxAttempts: OTP_MAX_ATTEMPTS,
        userId: input.userId,
      },
      select: {
        id: true,
        expiresAt: true,
      },
    });

    try {
      const emailProvider = getEmailProvider();

      const email = buildOtpEmail(code);

      await emailProvider.send({
        to: identifier,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
    } catch (error) {
      // The OTP must not remain usable if
      // email delivery failed.

      await controlPrisma.otpChallenge.delete({
        where: {
          id: challenge.id,
        },
      });

      throw new OtpError(
        "Unable to send verification code. Please try again.",
        "EMAIL_DELIVERY_FAILED",
      );
    }

    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt,
    };
  }

  async verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpResult> {
    const challenge = await controlPrisma.otpChallenge.findUnique({
      where: {
        id: input.challengeId,
      },
      select: {
        id: true,
        userId: true,
        identifier: true,
        channel: true,
        codeHash: true,
        expiresAt: true,
        verifiedAt: true,
        attempts: true,
        maxAttempts: true,
      },
    });

    if (!challenge) {
      throw new OtpError("OTP challenge was not found.", "OTP_NOT_FOUND");
    }

    if (challenge.verifiedAt) {
      throw new OtpError("OTP has already been used.", "OTP_INVALID");
    }

    const now = new Date();

    if (challenge.expiresAt <= now) {
      throw new OtpError("OTP has expired.", "OTP_EXPIRED");
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      throw new OtpError(
        "Maximum OTP verification attempts exceeded.",
        "OTP_MAX_ATTEMPTS",
      );
    }

    const valid = verifyOtp(input.code, challenge.codeHash);

    if (!valid) {
      const updated = await controlPrisma.otpChallenge.update({
        where: {
          id: challenge.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
        select: {
          attempts: true,
          maxAttempts: true,
        },
      });

      if (updated.attempts >= updated.maxAttempts) {
        throw new OtpError(
          "Maximum OTP verification attempts exceeded.",
          "OTP_MAX_ATTEMPTS",
        );
      }

      throw new OtpError("Invalid OTP.", "OTP_INVALID");
    }

    await controlPrisma.otpChallenge.update({
      where: {
        id: challenge.id,
      },
      data: {
        verifiedAt: now,
      },
    });

    return {
      userId: challenge.userId,
      identifier: challenge.identifier,
      channel: challenge.channel,
    };
  }

  private generateCode(): string {
    return randomInt(0, 1_000_000).toString().padStart(OTP_LENGTH, "0");
  }

  private normalizeIdentifier(identifier: string, channel: OtpChannel): string {
    const normalized = identifier.trim();

    if (!normalized) {
      throw new OtpError("OTP identifier cannot be empty.", "INVALID_CHANNEL");
    }

    if (channel === "EMAIL") {
      return normalized.toLowerCase();
    }

    return normalized;
  }
}

export const otpService = new OtpService();
