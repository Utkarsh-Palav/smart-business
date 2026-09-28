import { controlPrisma } from "@/lib/db/control";
import "server-only";
import { verifyPassword } from "../password/password";
import { issueAuthSession } from "../session/session-issuer";

export type LoginInput = {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
};

export type LoginResult = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export class LoginError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_CREDENTIALS"
      | "EMAIL_NOT_VERIFIED"
      | "ACCOUNT_INACTIVE",
  ) {
    super(message);
    this.name = "LoginError";
  }
}

export class LoginService {
  async login(input: LoginInput): Promise<LoginResult> {
    const email = this.normalizeEmail(input.email);

    if (!email || !input.password) {
      throw new LoginError("Invalid email or password.", "INVALID_CREDENTIALS");
    }

    const user = await controlPrisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        isEmailVerified: true,
        status: true,
      },
    });

    /**
     * Do not reveal weather the account exists
     */
    if (!user) {
      throw new LoginError("Invalid email or password.", "INVALID_CREDENTIALS");
    }

    if (user.status !== "ACTIVE") {
      throw new LoginError("This account is not active.", "ACCOUNT_INACTIVE");
    }

    if (!user.isEmailVerified) {
      throw new LoginError(
        "Please verify your email before logging in.",
        "EMAIL_NOT_VERIFIED",
      );
    }

    /**
     * Password hash should exist for account created
     * through the current password based registration flow.
     *
     * Keep this null-safe because passwordHash is currently nullable in database
     */
    if (!user.passwordHash) {
      throw new LoginError("Invalid email or password.", "INVALID_CREDENTIALS");
    }

    const passwordValid = await verifyPassword(
      input.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new LoginError("Invalid email or password.", "INVALID_CREDENTIALS");
    }

    const session = await issueAuthSession({
      userId: user.id,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    });

    return {
      userId: user.id,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}

export const loginService = new LoginService();
