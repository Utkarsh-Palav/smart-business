import { NextResponse } from "next/server";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { controlPrisma } from "@/lib/db/control";
import { finalizePaidOnboarding } from "@/lib/onboarding/finalization.service";
import { OnboardingError } from "@/lib/onboarding/onboarding.service";
import { initialLocationService } from "@/lib/location";
import { tenantProvisioner } from "@/lib/tenancy/provisioning";

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

    return NextResponse.json(
      {
        success: true,
        data: {
          business,
          tenant: provisioning,
          location,
          onboarding: { status: "COMPLETED" },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OnboardingError) {
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: error.status },
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

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PAID_ONBOARDING_FINALIZATION_FAILED",
          message: "Payment is confirmed, but business provisioning did not complete.",
        },
      },
      { status: 202 },
    );
  }
}