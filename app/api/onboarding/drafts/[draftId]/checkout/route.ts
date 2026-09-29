import { NextResponse } from "next/server";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { OnboardingError } from "@/lib/onboarding/onboarding.service";
import { createOnboardingCheckout } from "@/lib/onboarding/payment.service";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication is required." } },
      { status: 401 },
    );
  }

  try {
    const { draftId } = await params;
    const checkout = await createOnboardingCheckout(session.userId, draftId);

    return NextResponse.json({ success: true, data: checkout }, { status: 201 });
  } catch (error) {
    if (error instanceof OnboardingError) {
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    console.error("Razorpay checkout creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CHECKOUT_CREATION_FAILED",
          message: "Unable to start payment checkout.",
        },
      },
      { status: 502 },
    );
  }
}