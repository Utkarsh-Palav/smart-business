import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import {
  getOnboardingDraft,
  selectOnboardingPlan,
} from "@/lib/onboarding/onboarding.service";
import { selectOnboardingPlanSchema } from "@/lib/onboarding/onboarding.schemas";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
  validationResponse,
} from "@/lib/api/responses";

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

    return successResponse(draft);
  } catch (error) {
    return handleApiError(
      error,
      "ONBOARDING_REQUEST_FAILED",
      "Unable to retrieve onboarding draft.",
    );
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
    return validationResponse("Request body must be valid JSON.");
  }

  const parsed = selectOnboardingPlanSchema.safeParse(body);

  if (!parsed.success) {
    return validationResponse(
      "A valid plan price is required.",
      parsed.error.flatten(),
    );
  }

  try {
    const draft = await selectOnboardingPlan(
      session.userId,
      draftId,
      parsed.data.planPriceId,
    );

    return successResponse(draft);
  } catch (error) {
    return handleApiError(
      error,
      "ONBOARDING_REQUEST_FAILED",
      "Unable to select a plan.",
    );
  }
}
