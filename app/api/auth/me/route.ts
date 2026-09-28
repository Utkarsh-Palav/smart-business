import { NextResponse } from "next/server";

import { controlPrisma } from "@/lib/db/control";
import { getAuthSession } from "@/lib/auth/session/get-session";
import { authSessionService } from "@/lib/auth/session/session.service";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication is required.",
          },
        },
        { status: 401 },
      );
    }

    const activeSession = await authSessionService.getActiveSession(
      session.sessionId,
      session.userId,
    );

    if (!activeSession) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SESSION_INVALID",
            message: "Authentication session is no longer valid.",
          },
        },
        { status: 401 },
      );
    }

    const user = await controlPrisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "User account could not be found.",
          },
        },
        { status: 404 },
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_INACTIVE",
            message: "User account is not active.",
          },
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user,
          session: {
            id: activeSession.id,
            createdAt: activeSession.createdAt,
            lastUsedAt: activeSession.lastUsedAt,
            expiresAt: activeSession.expiresAt,
          },
        },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to retrieve authenticated user.",
        },
      },
      { status: 500 },
    );
  }
}
