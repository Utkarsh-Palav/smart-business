import { hashRefreshToken } from "@/lib/auth/session/refresh-token";
import {
  ACCESS_COOKIE_NAME,
  getAccessCookieOptions,
  getRefreshCookieOptions,
  REFRESH_COOKIE_NAME,
} from "@/lib/auth/session/session";
import { authSessionService } from "@/lib/auth/session/session.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const refreshToken = getRefreshToken(request);

    if (refreshToken) {
      const refreshTokenHash = hashRefreshToken(refreshToken);

      const session = await findSessionByRefreshTokenHash(refreshTokenHash);

      if (session) {
        await authSessionService.revokeSession(session.id, "LOGOUT");
      }

      const response = NextResponse.json(
        {
          success: true,
          data: {
            message: "Logged out successfully.",
          },
        },
        { status: 200 },
      );

      response.cookies.set(ACCESS_COOKIE_NAME, "", {
        ...getAccessCookieOptions(),
        maxAge: 0,
      });

      response.cookies.set(REFRESH_COOKIE_NAME, "", {
        ...getRefreshCookieOptions(),
        maxAge: 0,
      });

      return response;
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to log out.",
        },
      },
      { status: 500 },
    );
  }
}

function getRefreshToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const seperatorIndex = cookie.indexOf("=");

    if (seperatorIndex === -1) {
      continue;
    }

    const name = cookie.slice(0, seperatorIndex).trim();

    if (name !== REFRESH_COOKIE_NAME) {
      continue;
    }

    return decodeURIComponent(cookie.slice(seperatorIndex + 1));
  }

  return null;
}

async function findSessionByRefreshTokenHash(refreshTokenHash: string) {
  const { controlPrisma } = await import("@/lib/db/control");

  return controlPrisma.authSession.findUnique({
    where: {
      refreshTokenHash,
    },
    select: {
      id: true,
    },
  });
}
