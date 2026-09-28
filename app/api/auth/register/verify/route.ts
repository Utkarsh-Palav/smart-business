import { NextResponse } from "next/server";
import { z } from "zod";

import {
  RegistrationError,
  registrationService,
} from "@/lib/auth/registration/registration.service";
import { OtpError } from "@/lib/auth/otp/otp-service";
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  getAccessCookieOptions,
  getRefreshCookieOptions,
} from "@/lib/auth/session/session";
import { issueAuthSession } from "@/lib/auth/session/session-issuer";

const registerVerifySchema = z.object({
  challengeId: z.string().trim().min(1, "Challenge ID is required"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = registerVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please provide a valid challenge ID and 6-digit OTP.",
          },
        },
        { status: 400 },
      );
    }

    const result = await registrationService.verifyRegistration({
      challengeId: parsed.data.challengeId,
      code: parsed.data.code,
    });

    const session = await issueAuthSession({
      userId: result.userId,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress: getClientIpAddress(request),
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          userId: result.userId,
          isNewUser: result.isNewUser,
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
    if (error instanceof OtpError) {
      const status = error.code === "OTP_MAX_ATTEMPTS" ? 429 : 400;

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

    if (error instanceof RegistrationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to verify registration.",
        },
      },
      { status: 500 },
    );
  }
}

function getClientIpAddress(request: Request): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return request.headers.get("x-real-ip") ?? undefined;
}
