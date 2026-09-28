import "server-only";
import { generateRefreshToken, hashRefreshToken } from "./refresh-token";
import { controlPrisma } from "@/lib/db/control";

const REFRESH_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type CreateAuthSessionInput = {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
};

export type CreateAuthSession = {
  sessionId: string;
  refreshToken: string;
  expiresAt: Date;
};

export class AuthSessionService {
  async getActiveSession(sessionId: string, userId: string) {
    const session = await controlPrisma.authSession.findFirst({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });

    return session;
  }

  async createSession(
    input: CreateAuthSessionInput,
  ): Promise<CreateAuthSession> {
    if (!input.userId) {
      throw new Error("userId is required to create an auth session");
    }

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + REFRESH_SESSION_TTL_MS);

    const session = await controlPrisma.authSession.create({
      data: {
        userId: input.userId,
        refreshTokenHash,
        expiresAt,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
      },
      select: {
        id: true,
        expiresAt: true,
      },
    });

    return {
      sessionId: session.id,
      refreshToken,
      expiresAt: session.expiresAt,
    };
  }

  async findActiveSessionByRefreshToken(refreshToken: string) {
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const session = await controlPrisma.authSession.findUnique({
      where: {
        refreshTokenHash,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    if (!session) {
      return null;
    }

    if (session.revokedAt) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      return null;
    }

    return session;
  }

  async rotateRefreshToken(sessionId: string): Promise<{
    refreshToken: string;
    expiresAt: Date;
  }> {
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + REFRESH_SESSION_TTL_MS);

    const session = await controlPrisma.authSession.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshTokenHash,
        expiresAt,
        lastUsedAt: new Date(),
      },
      select: {
        expiresAt: true,
      },
    });

    return {
      refreshToken,
      expiresAt: session.expiresAt,
    };
  }

  async revokeSession(sessionId: string, reason = "LOGOUT"): Promise<void> {
    await controlPrisma.authSession.updateMany({
      where: {
        id: sessionId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }

  async revokeAllUserSessions(
    userId: string,
    reason: "LOGOUT_ALL",
  ): Promise<void> {
    await controlPrisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }
}

export const authSessionService = new AuthSessionService();
