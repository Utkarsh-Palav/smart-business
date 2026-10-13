import { NextResponse } from "next/server";
import { z } from "zod";

import {
  RegistrationError,
  registrationService,
} from "@/lib/auth/registration/registration.service";
import { OtpError } from "@/lib/auth/otp/otp-service";

const resendRegistrationSchema = z.object({
  challengeId: z.string().trim().min(1, "Challenge ID is required"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = resendRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "A valid registration challenge is required.",
          },
        },
        { status: 400 },
      );
    }

    const result = await registrationService.resendRegistration(parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: {
          challengeId: result.challengeId,
          expiresAt: result.expiresAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof OtpError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: error.code, message: error.message },
        },
        { status: error.code === "RESEND_COOLDOWN" ? 429 : 400 },
      );
    }

    if (error instanceof RegistrationError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: error.code, message: error.message },
        },
        { status: error.code === "USER_NOT_FOUND" ? 404 : 400 },
      );
    }

    console.error("Registration OTP resend failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to resend verification code.",
        },
      },
      { status: 500 },
    );
  }
}
