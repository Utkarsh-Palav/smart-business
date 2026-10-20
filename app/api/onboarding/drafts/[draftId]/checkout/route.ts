import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createOnboardingCheckout } from "@/lib/onboarding/payment.service";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api/responses";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const { draftId } = await params;
    const checkout = await createOnboardingCheckout(session.userId, draftId);

    return successResponse(checkout, 201);
  } catch (error) {
    return handleApiError(
      error,
      "CHECKOUT_CREATION_FAILED",
      "Unable to start payment checkout.",
      502,
    );
  }
}
