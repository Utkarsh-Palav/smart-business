import "server-only";

import { createAccessToken, type AuthAccessTokenPayload } from "./session";
import {
  authSessionService,
  type CreateAuthSessionInput,
} from "./session.service";

export type IssueAuthSessionInput = CreateAuthSessionInput;

export type IssuedAuthSession = {
  sessionId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export async function issueAuthSession(
  input: IssueAuthSessionInput,
): Promise<IssuedAuthSession> {
  const session = await authSessionService.createSession(input);

  try {
    const accessTokenPayload: AuthAccessTokenPayload = {
      userId: input.userId,
      sessionId: session.sessionId,
    };

    const accessToken = await createAccessToken(accessTokenPayload);

    return {
      sessionId: session.sessionId,
      userId: input.userId,
      accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    // Do not leave a refresh session behind if access-token
    // creation fails.
    await authSessionService.revokeSession(
      session.sessionId,
      "ACCESS_TOKEN_CREATION_FAILED",
    );

    throw error;
  }
}
