import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { ApiError } from "@/lib/api/api-error";
import { controlPrisma } from "@/lib/db/control";
import { finalizePaidOnboarding } from "@/lib/onboarding/finalization.service";
import { initialLocationService } from "@/lib/location";
import { tenantProvisioner } from "@/lib/tenancy/provisioning";
import {
  errorResponse,
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
    const business = await finalizePaidOnboarding(session.userId, draftId);
    const provisioning = await tenantProvisioner.provision({
      businessId: business.businessId,
    });
    const location = await initialLocationService.createInitialLocation({
      businessId: business.businessId,
      ...business.firstLocation,
    });

    await controlPrisma.businessOnboardingDraft.updateMany({
      where: { id: draftId, userId: session.userId },
      data: { status: "COMPLETED" },
    });

    return successResponse(
      {
          business,
          tenant: provisioning,
          location,
          onboarding: { status: "COMPLETED" },
      },
      201,
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return handleApiError(
        error,
        "PAID_ONBOARDING_FINALIZATION_FAILED",
        "Payment is confirmed, but business provisioning did not complete.",
      );
    }

    console.error("Paid onboarding finalization failed:", error);

    try {
      const { draftId } = await params;
      await controlPrisma.businessOnboardingDraft.updateMany({
        where: {
          id: draftId,
          userId: session.userId,
          status: "PROVISIONING",
        },
        data: { status: "PROVISIONING_FAILED" },
      });
    } catch (statusError) {
      console.error("Unable to persist paid onboarding failure:", statusError);
    }

    return errorResponse(
      "PAID_ONBOARDING_FINALIZATION_FAILED",
      "Payment is confirmed, but business provisioning did not complete.",
      202,
      { onboarding: { status: "PROVISIONING_FAILED" } },
    );
  }
}
