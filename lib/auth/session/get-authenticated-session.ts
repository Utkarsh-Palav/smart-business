import "server-only";

import { cookies } from "next/headers";

import {
  ACCESS_COOKIE_NAME,
  verifyAccessToken,
} from "./session";
import { authSessionService } from "./session.service";

export type AuthenticatedSession = {
  userId: string;
  sessionId: string;
};

export async function getAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const token = await verifyAccessToken(accessToken);

    const session = await authSessionService.getActiveSession(
      token.sessionId,
      token.userId,
    );

    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      sessionId: session.id,
    };
  } catch {
    return null;
  }
}