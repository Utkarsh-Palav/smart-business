import { NextResponse } from "next/server";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createBusinessSchema } from "@/lib/business/business.schemas";
import {
  createOnboardingDraft,
  OnboardingError,
} from "@/lib/onboarding/onboarding.service";

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        },
      },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  const parsed = createBusinessSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check the business and first outlet details.",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  try {
    const draft = await createOnboardingDraft(session.userId, parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: draft,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OnboardingError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
      );
    }

    console.error("Onboarding draft creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ONBOARDING_DRAFT_CREATION_FAILED",
          message: "Unable to save onboarding details.",
        },
      },
      { status: 500 },
    );
  }
}