import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createBusinessSchema } from "@/lib/business/business.schemas";
import { createOnboardingDraft } from "@/lib/onboarding/onboarding.service";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
  validationResponse,
} from "@/lib/api/responses";

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return validationResponse("Request body must be valid JSON.");
  }

  const parsed = createBusinessSchema.safeParse(body);

  if (!parsed.success) {
    return validationResponse(
      "Please check the business and first outlet details.",
      parsed.error.flatten(),
    );
  }

  try {
    const draft = await createOnboardingDraft(session.userId, parsed.data);

    return successResponse(draft, 201);
  } catch (error) {
    return handleApiError(
      error,
      "ONBOARDING_DRAFT_CREATION_FAILED",
      "Unable to save onboarding details.",
    );
  }
}
