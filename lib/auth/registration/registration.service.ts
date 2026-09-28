import "server-only";

import { Prisma } from "@/generated/control/client";

import { controlPrisma } from "@/lib/db/control";

import { OtpChannel, otpService } from "../otp/otp-service";
import { hashPassword } from "../password/password";

export type StartRegistrationInput = {
  identifier: string;
  channel: OtpChannel;
  password: string;
};

export type StartRegistrationResult = {
  challengeId: string;
  expiresAt: Date;
};

export type VerifyRegistrationInput = {
  challengeId: string;
  code: string;
};

export type VerifyRegistrationResult = {
  userId: string;
  isNewUser: boolean;
};

export class RegistrationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_IDENTIFIER"
      | "INVALID_PASSWORD"
      | "USER_ALREADY_EXISTS"
      | "USER_NOT_FOUND"
      | "INVALID_CHANNEL"
      | "REGISTRATION_NOT_VERIFIED",
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "RegistrationError";
  }
}

export class RegistrationService {
  async startRegistration(
    input: StartRegistrationInput,
  ): Promise<StartRegistrationResult> {
    if (input.channel !== "EMAIL") {
      throw new RegistrationError(
        "Email registration is currently required.",
        "INVALID_IDENTIFIER",
      );
    }

    const identifier = this.normalizeIdentifier(
      input.identifier,
      input.channel,
    );

    this.validatePassword(input.password);

    const existingUser = await this.findUser(identifier, input.channel);

    if (existingUser) {
      throw new RegistrationError(
        "An account with this email already exists.",
        "USER_ALREADY_EXISTS",
      );
    }

    const passwordHash = await hashPassword(input.password);

    let user: { id: string };

    try {
      user = await controlPrisma.user.create({
        data: {
          email: identifier,
          passwordHash,
          isEmailVerified: false,
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) {
        throw new RegistrationError(
          "An account with this email already exists.",
          "USER_ALREADY_EXISTS",
          {
            cause: error,
          },
        );
      }

      throw new RegistrationError(
        "Unable to create registration account.",
        "REGISTRATION_NOT_VERIFIED",
        {
          cause: error,
        },
      );
    }

    try {
      const challenge = await otpService.createOtp({
        identifier,
        channel: input.channel,
        userId: user.id,
      });

      return {
        challengeId: challenge.challengeId,
        expiresAt: challenge.expiresAt,
      };
    } catch (error) {
      // Do not leave an unverified account behind if
      // OTP creation or email delivery fails.
      await controlPrisma.user.delete({
        where: {
          id: user.id,
        },
      });

      throw error;
    }
  }

  async verifyRegistration(
    input: VerifyRegistrationInput,
  ): Promise<VerifyRegistrationResult> {
    const result = await otpService.verifyOtp({
      challengeId: input.challengeId,
      code: input.code,
    });

    if (result.channel !== "EMAIL") {
      throw new RegistrationError(
        "Only email registration is supported.",
        "INVALID_CHANNEL",
      );
    }

    if (!result.userId) {
      throw new RegistrationError(
        "Registration account could not be found.",
        "USER_NOT_FOUND",
      );
    }

    const user = await controlPrisma.user.findUnique({
      where: {
        id: result.userId,
      },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        status: true,
      },
    });

    if (!user) {
      throw new RegistrationError(
        "Registration account could not be found.",
        "USER_NOT_FOUND",
      );
    }

    const email = this.normalizeIdentifier(result.identifier, result.channel);

    if (user.email !== email) {
      throw new RegistrationError(
        "Registration verification does not match the account.",
        "REGISTRATION_NOT_VERIFIED",
      );
    }

    if (!user.isEmailVerified) {
      await this.markUserVerified(result.userId, result.channel);
    }

    return {
      userId: result.userId,
      isNewUser: true,
    };
  }

  private async markUserVerified(
    userId: string,
    channel: OtpChannel,
  ): Promise<void> {
    await controlPrisma.user.update({
      where: {
        id: userId,
      },
      data:
        channel === "EMAIL"
          ? {
              isEmailVerified: true,
              status: "ACTIVE",
            }
          : {
              isPhoneVerified: true,
              status: "ACTIVE",
            },
    });
  }

  private async findUser(identifier: string, channel: OtpChannel) {
    if (channel === "EMAIL") {
      return controlPrisma.user.findUnique({
        where: {
          email: identifier,
        },
        select: {
          id: true,
        },
      });
    }

    return controlPrisma.user.findUnique({
      where: {
        phone: identifier,
      },
      select: {
        id: true,
      },
    });
  }

  private normalizeIdentifier(identifier: string, channel: OtpChannel): string {
    const normalized = identifier.trim();

    if (!normalized) {
      throw new RegistrationError(
        "Registration identifier cannot be empty.",
        "INVALID_IDENTIFIER",
      );
    }

    if (channel === "EMAIL") {
      return normalized.toLowerCase();
    }

    return normalized;
  }

  private validatePassword(password: string): void {
    if (!password) {
      throw new RegistrationError("Password is required.", "INVALID_PASSWORD");
    }

    if (password.length < 8) {
      throw new RegistrationError(
        "Password must be at least 8 characters long.",
        "INVALID_PASSWORD",
      );
    }

    if (password.length > 128) {
      throw new RegistrationError(
        "Password must not exceed 128 characters.",
        "INVALID_PASSWORD",
      );
    }
  }

  private isUniqueConstraintViolation(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    );
  }
}

export const registrationService = new RegistrationService();
