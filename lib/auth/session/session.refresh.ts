import "server-only";
import { authSessionService } from "./session.service";
import { createAccessToken } from "./session";

export type RefreshAuthSessionResult = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export class AuthRefreshError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_REFRESH_TOKEN"
      | "SESSION_REVOKED"
      | "SESSION_EXPIRED",
  ) {
    super(message);
    this.name = "AuthRefreshError";
  }
}

export async function refreshAuthSession(
  refreshToken: string,
): Promise<RefreshAuthSessionResult> {
  if (!refreshToken) {
    throw new AuthRefreshError(
      "Refresh token is required.",
      "INVALID_REFRESH_TOKEN",
    );
  }

  const session =
    await authSessionService.findActiveSessionByRefreshToken(refreshToken);

  if (!session) {
    throw new AuthRefreshError(
      "Refresh session is invalid or expired.",
      "INVALID_REFRESH_TOKEN",
    );
  }

  const rotated = await authSessionService.rotateRefreshToken(session.id);

  const accessToken = await createAccessToken({
    userId: session.userId,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken: rotated.refreshToken,
    expiresAt: rotated.expiresAt,
  };
}
