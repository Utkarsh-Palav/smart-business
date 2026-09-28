import { NextResponse } from "next/server";
import { z } from "zod";

import {
  RegistrationError,
  registrationService,
} from "@/lib/auth/registration/registration.service";
import { OtpError } from "@/lib/auth/otp/otp-service";

const registerStartSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = registerStartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please provide a valid email address and password.",
          },
        },
        { status: 400 },
      );
    }

    const result = await registrationService.startRegistration({
      identifier: parsed.data.email,
      password: parsed.data.password,
      channel: "EMAIL",
    });

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
      const status =
        error.code === "RESEND_COOLDOWN"
          ? 429
          : error.code === "EMAIL_DELIVERY_FAILED"
            ? 503
            : 400;

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
      const status = error.code === "USER_ALREADY_EXISTS" ? 409 : 400;

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
          message: "Unable to start registration.",
        },
      },
      { status: 500 },
    );
  }
}
