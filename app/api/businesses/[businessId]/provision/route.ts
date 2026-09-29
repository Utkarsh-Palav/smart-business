import { NextResponse } from "next/server";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { controlPrisma } from "@/lib/db/control";
import { initialLocationService } from "@/lib/location";
import {
  TenantProvisioningConflictError,
  TenantProvisioningError,
} from "@/lib/tenancy/provisioning/tenant-provisioner";
import { tenantProvisioner } from "@/lib/tenancy/provisioning";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ businessId: string }> },
) {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const { businessId } = await params;
    const business = await controlPrisma.business.findFirst({
      where: {
        id: businessId,
        memberships: {
          some: {
            userId: session.userId,
            status: "ACTIVE",
            role: { slug: "owner" },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        tenantDatabase: {
          select: {
            id: true,
            status: true,
          },
        },
        onboardingProfile: {
          select: {
            firstLocationName: true,
            firstLocationSlug: true,
            operatingMode: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            phone: true,
          },
        },
        subscriptions: {
          select: { id: true, status: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found", code: "BUSINESS_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (!business.tenantDatabase) {
      return NextResponse.json(
        { error: "Tenant database not found", code: "TENANT_NOT_FOUND" },
        { status: 404 },
      );
    }

    if (business.tenantDatabase.status !== "FAILED") {
      return NextResponse.json(
        {
          error: "Only failed tenant provisioning can be retried",
          code: "TENANT_NOT_RETRYABLE",
          tenant: {
            id: business.tenantDatabase.id,
            status: business.tenantDatabase.status,
          },
        },
        { status: 409 },
      );
    }

    let provisioning;

    try {
      provisioning = await tenantProvisioner.provision({ businessId });
    } catch (error) {
      const tenant = await tenantProvisioner.getTenantDatabaseStatus(businessId);

      if (error instanceof TenantProvisioningConflictError) {
        return NextResponse.json(
          {
            error: "Tenant provisioning is already in progress",
            code: "TENANT_PROVISIONING_CONFLICT",
            tenant: {
              id: business.tenantDatabase.id,
              status: tenant?.status ?? "UNKNOWN",
            },
          },
          { status: 409 },
        );
      }

      if (
        !(error instanceof TenantProvisioningError) ||
        tenant?.status !== "FAILED"
      ) {
        return NextResponse.json(
          {
            error: "Tenant provisioning outcome could not be verified",
            code: "TENANT_PROVISIONING_STATE_UNKNOWN",
            tenant: {
              id: business.tenantDatabase.id,
              status: tenant?.status ?? "UNKNOWN",
            },
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          error: "Tenant provisioning failed",
          code: "TENANT_PROVISIONING_FAILED",
          tenant: {
            id: business.tenantDatabase.id,
            status: "FAILED",
          },
        },
        { status: 202 },
      );
    }

    try {
      const location = await initialLocationService.createInitialLocation({
        businessId: business.id,
        name: business.onboardingProfile?.firstLocationName ?? business.name,
        slug: business.onboardingProfile?.firstLocationSlug ?? business.slug,
        operatingMode:
          business.onboardingProfile?.operatingMode ?? "DINE_IN",
        addressLine1: business.onboardingProfile?.addressLine1,
        addressLine2: business.onboardingProfile?.addressLine2,
        city: business.onboardingProfile?.city,
        state: business.onboardingProfile?.state,
        postalCode: business.onboardingProfile?.postalCode,
        country: business.onboardingProfile?.country,
        phone: business.onboardingProfile?.phone,
      });
      const subscription = business.subscriptions[0];

      return NextResponse.json(
        {
          business: {
            id: business.id,
            name: business.name,
            slug: business.slug,
          },
          tenant: {
            id: provisioning.tenantDatabaseId,
            key: provisioning.tenantKey,
            status: provisioning.status,
          },
          subscription: subscription
            ? { id: subscription.id, status: subscription.status }
            : null,
          location: {
            id: location.id,
            name: location.name,
            slug: location.slug,
          },
          onboarding: { status: "COMPLETED" },
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("Initial location creation failed during provisioning retry:", {
        businessId: business.id,
        error,
      });

      return NextResponse.json(
        {
          error: "Tenant is active, but initial location creation failed",
          code: "INITIAL_LOCATION_CREATION_FAILED",
          tenant: {
            id: provisioning.tenantDatabaseId,
            key: provisioning.tenantKey,
            status: provisioning.status,
          },
          onboarding: { status: "LOCATION_CREATION_FAILED" },
        },
        { status: 202 },
      );
    }
  } catch (error) {
    console.error("Tenant provisioning retry failed:", error);

    return NextResponse.json(
      { error: "Unable to retry tenant provisioning", code: "RETRY_FAILED" },
      { status: 500 },
    );
  }
}