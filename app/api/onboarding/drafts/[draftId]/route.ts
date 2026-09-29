import { NextResponse } from "next/server";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import {
  getOnboardingDraft,
  OnboardingError,
  selectOnboardingPlan,
} from "@/lib/onboarding/onboarding.service";
import { selectOnboardingPlanSchema } from "@/lib/onboarding/onboarding.schemas";

type DraftRouteContext = {
  params: Promise<{ draftId: string }>;
};

export async function GET(_request: Request, { params }: DraftRouteContext) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  const { draftId } = await params;

  try {
    const draft = await getOnboardingDraft(session.userId, draftId);

    return NextResponse.json({ success: true, data: draft }, { status: 200 });
  } catch (error) {
    return handleOnboardingError(error, "Unable to retrieve onboarding draft.");
  }
}

export async function PATCH(request: Request, { params }: DraftRouteContext) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  const { draftId } = await params;
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

  const parsed = selectOnboardingPlanSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "A valid plan price is required.",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  try {
    const draft = await selectOnboardingPlan(
      session.userId,
      draftId,
      parsed.data.planPriceId,
    );

    return NextResponse.json({ success: true, data: draft }, { status: 200 });
  } catch (error) {
    return handleOnboardingError(error, "Unable to select a plan.");
  }
}

function unauthorizedResponse() {
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

function handleOnboardingError(error: unknown, fallbackMessage: string) {
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

  console.error(fallbackMessage, error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "ONBOARDING_REQUEST_FAILED",
        message: fallbackMessage,
      },
    },
    { status: 500 },
  );
}