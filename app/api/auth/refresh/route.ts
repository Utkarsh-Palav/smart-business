import { NextResponse } from "next/server";

import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  getAccessCookieOptions,
  getRefreshCookieOptions,
} from "@/lib/auth/session/session";
import { AuthRefreshError, refreshAuthSession } from "@/lib/auth/session/session.refresh";

export async function POST(request: Request) {
  try {
    const refreshToken = getRefreshToken(request);

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Refresh token is required.",
          },
        },
        { status: 401 },
      );
    }

    const session = await refreshAuthSession(refreshToken);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 },
    );

    response.cookies.set(
      ACCESS_COOKIE_NAME,
      session.accessToken,
      getAccessCookieOptions(),
    );

    response.cookies.set(
      REFRESH_COOKIE_NAME,
      session.refreshToken,
      getRefreshCookieOptions(),
    );

    return response;
  } catch (error) {
    if (error instanceof AuthRefreshError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to refresh authentication session.",
        },
      },
      { status: 500 },
    );
  }
}

function getRefreshToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = cookie
      .slice(0, separatorIndex)
      .trim();

    if (name !== REFRESH_COOKIE_NAME) {
      continue;
    }

    return decodeURIComponent(
      cookie.slice(separatorIndex + 1),
    );
  }

  return null;
}