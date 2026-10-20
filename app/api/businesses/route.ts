import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { businessService } from "@/lib/business/business.service";
import { createBusinessSchema } from "@/lib/business/business.schemas";
import { controlPrisma } from "@/lib/db/control";
import { tenantProvisioner } from "@/lib/tenancy/provisioning";
import { TenantProvisioningConflictError } from "@/lib/tenancy/provisioning/tenant-provisioner";
import { initialLocationService } from "@/lib/location";
import {
  errorResponse,
  handleApiError,
  successResponse,
  unauthorizedResponse,
  validationResponse,
} from "@/lib/api/responses";

export async function GET() {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return unauthorizedResponse();
    }

    const businesses = await controlPrisma.business.findMany({
      where: {
        memberships: {
          some: {
            userId: session.userId,
            status: "ACTIVE",
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        legalName: true,
        businessType: true,
        gstin: true,
        status: true,
        createdAt: true,
        updatedAt: true,
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
        _count: {
          select: {
            memberships: true,
            reviewCardAssignments: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return successResponse(businesses);
  } catch (error) {
    return handleApiError(error, "BUSINESS_LIST_FAILED", "Unable to retrieve businesses.");
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return unauthorizedResponse();
    }

    const body: unknown = await request.json().catch(() => null);

    const parsed = createBusinessSchema.safeParse(body);

    if (!parsed.success) {
      return validationResponse("Invalid request", parsed.error.flatten());
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
        return errorResponse(
          "TENANT_PROVISIONING_CONFLICT",
          "Tenant provisioning is already in progress or unavailable",
          409,
          {
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
        );
      }

      if (persistedTenant?.status !== "FAILED") {
        return errorResponse(
          "TENANT_PROVISIONING_STATE_UNKNOWN",
          "Business created, but tenant provisioning outcome could not be verified",
          503,
          {
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
        );
      }

      /*
       * Business creation succeeded, but infrastructure
       * provisioning failed. The TenantDatabase record
       * is now FAILED and can be retried later.
       */
      return errorResponse(
        "TENANT_PROVISIONING_FAILED",
        "Business created, but tenant provisioning failed",
        202,
        {
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

      return successResponse(
        {
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
        201,
      );
    } catch (error) {
      console.error("Initial location creation failed:", error);

      return errorResponse(
        "INITIAL_LOCATION_CREATION_FAILED",
        "Business and tenant created, but initial location creation failed",
        202,
        {
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
      );
    }
  } catch (error) {
    return handleApiError(error, "BUSINESS_CREATION_FAILED", "Unable to create business.");
  }
}
