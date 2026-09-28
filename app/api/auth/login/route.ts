import { NextResponse } from "next/server";
import { z } from "zod";

import {
  LoginError,
  loginService,
} from "@/lib/auth/login/login.service";
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  getAccessCookieOptions,
  getRefreshCookieOptions,
} from "@/lib/auth/session/session";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please provide a valid email and password.",
          },
        },
        { status: 400 },
      );
    }

    const session = await loginService.login({
      email: parsed.data.email,
      password: parsed.data.password,
      userAgent:
        request.headers.get("user-agent") ?? undefined,
      ipAddress: getClientIpAddress(request),
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          userId: session.userId,
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
    if (error instanceof LoginError) {
      const status =
        error.code === "INVALID_CREDENTIALS"
          ? 401
          : error.code === "EMAIL_NOT_VERIFIED"
            ? 403
            : 403;

      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to log in.",
        },
      },
      { status: 500 },
    );
  }
}

function getClientIpAddress(
  request: Request,
): string | undefined {
  const forwardedFor =
    request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor
      .split(",")[0]
      ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return (
    request.headers.get("x-real-ip") ??
    undefined
  );
}