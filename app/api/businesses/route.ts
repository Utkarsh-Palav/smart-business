import { NextResponse } from "next/server";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { BusinessError } from "@/lib/business/business.errors";
import { businessService } from "@/lib/business/business.service";
import { createBusinessSchema } from "@/lib/business/business.schemas";
import { tenantProvisioner } from "@/lib/tenancy/provisioning";
import { TenantProvisioningConflictError } from "@/lib/tenancy/provisioning/tenant-provisioner";
import { initialLocationService } from "@/lib/location";

export async function POST(request: Request) {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          code: "UNAUTHORIZED",
        },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();

    const parsed = createBusinessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          code: "VALIDATION_ERROR",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    /*
     * Phase 1:
     * Create the Control DB onboarding records.
     */
    const business = await businessService.createBusiness({
      userId: session.userId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      businessType: parsed.data.businessType,
      legalName: parsed.data.legalName,
      gstin: parsed.data.gstin || undefined,
      firstLocation: parsed.data.firstLocation,
    });

    /*
     * Phase 2:
     * Provision the already-created TenantDatabase.
     */
    let provisioning;

    try {
      provisioning = await tenantProvisioner.provision({
        businessId: business.businessId,
      });
    } catch (error) {
      console.error(
        "Tenant provisioning failed for business:",
        business.businessId,
      );

      let persistedTenant;

      try {
        persistedTenant = await tenantProvisioner.getTenantDatabaseStatus(
          business.businessId,
        );
      } catch {
        persistedTenant = null;
      }

      if (error instanceof TenantProvisioningConflictError) {
        return NextResponse.json(
          {
            error: "Tenant provisioning is already in progress or unavailable",
            code: "TENANT_PROVISIONING_CONFLICT",
            business: {
              id: business.businessId,
              name: business.businessName,
              slug: business.businessSlug,
            },
            tenant: {
              id: business.tenantDatabaseId,
              status: persistedTenant?.status ?? "UNKNOWN",
            },
            onboarding: {
              status: "PENDING",
            },
          },
          { status: 409 },
        );
      }

      if (persistedTenant?.status !== "FAILED") {
        return NextResponse.json(
          {
            error: "Business created, but tenant provisioning outcome could not be verified",
            code: "TENANT_PROVISIONING_STATE_UNKNOWN",
            business: {
              id: business.businessId,
              name: business.businessName,
              slug: business.businessSlug,
            },
            tenant: {
              id: business.tenantDatabaseId,
              status: persistedTenant?.status ?? "UNKNOWN",
            },
            onboarding: {
              status: "UNKNOWN",
            },
          },
          { status: 503 },
        );
      }

      /*
       * Business creation succeeded, but infrastructure
       * provisioning failed. The TenantDatabase record
       * is now FAILED and can be retried later.
       */
      return NextResponse.json(
        {
          error: "Business created, but tenant provisioning failed",
          code: "TENANT_PROVISIONING_FAILED",
          business: {
            id: business.businessId,
            name: business.businessName,
            slug: business.businessSlug,
          },
          tenant: {
            id: business.tenantDatabaseId,
            status: "FAILED",
          },
          onboarding: {
            status: "FAILED",
          },
        },
        { status: 202 },
      );
    }

    try {
      /*
       * Phase 3:
       * Create the initial Location in the active tenant database.
       */
      const location = await initialLocationService.createInitialLocation({
        businessId: business.businessId,
        ...business.firstLocation,
      });

      return NextResponse.json(
        {
          success: true,
          business: {
            id: business.businessId,
            name: business.businessName,
            slug: business.businessSlug,
          },
          tenant: {
            id: provisioning.tenantDatabaseId,
            key: provisioning.tenantKey,
            status: provisioning.status,
          },
          subscription: {
            id: business.subscriptionId,
            status: business.subscriptionStatus,
          },
          location: {
            id: location.id,
            name: location.name,
            slug: location.slug,
          },
          onboarding: {
            status: "COMPLETED",
          },
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Initial location creation failed:", error);

      return NextResponse.json(
        {
          error: "Business and tenant created, but initial location creation failed",
          code: "INITIAL_LOCATION_CREATION_FAILED",
          business: {
            id: business.businessId,
            name: business.businessName,
            slug: business.businessSlug,
          },
          tenant: {
            id: provisioning.tenantDatabaseId,
            key: provisioning.tenantKey,
            status: provisioning.status,
          },
          subscription: {
            id: business.subscriptionId,
            status: business.subscriptionStatus,
          },
          onboarding: {
            status: "LOCATION_CREATION_FAILED",
          },
        },
        { status: 202 },
      );
    }
  } catch (error) {
    if (error instanceof BusinessError) {
      const status =
        error.code === "BUSINESS_SLUG_EXISTS"
          ? 409
          : error.code === "OWNER_ROLE_NOT_FOUND" ||
              error.code === "STARTER_PLAN_NOT_FOUND"
            ? 500
            : error.code === "USER_NOT_FOUND"
              ? 401
              : 400;

      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status },
      );
    }

    console.error("Business creation failed:", error);

    return NextResponse.json(
      {
        error: "Unable to create business",
        code: "BUSINESS_CREATION_FAILED",
      },
      { status: 500 },
    );
  }
}
