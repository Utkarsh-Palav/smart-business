import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { controlPrisma } from "@/lib/db/control";
import { initialLocationService } from "@/lib/location";
import {
  TenantProvisioningConflictError,
  TenantProvisioningError,
} from "@/lib/tenancy/provisioning/tenant-provisioner";
import { tenantProvisioner } from "@/lib/tenancy/provisioning";
import {
  errorResponse,
  handleApiError,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api/responses";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ businessId: string }> },
) {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return unauthorizedResponse();
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
      return errorResponse("BUSINESS_NOT_FOUND", "Business not found", 404);
    }

    if (!business.tenantDatabase) {
      return errorResponse("TENANT_NOT_FOUND", "Tenant database not found", 404);
    }

    if (business.tenantDatabase.status !== "FAILED") {
      return errorResponse(
        "TENANT_NOT_RETRYABLE",
        "Only failed tenant provisioning can be retried",
        409,
        {
          tenant: {
            id: business.tenantDatabase.id,
            status: business.tenantDatabase.status,
          },
        },
      );
    }

    let provisioning;

    try {
      provisioning = await tenantProvisioner.provision({ businessId });
    } catch (error) {
      const tenant = await tenantProvisioner.getTenantDatabaseStatus(businessId);

      if (error instanceof TenantProvisioningConflictError) {
        return errorResponse(
          "TENANT_PROVISIONING_CONFLICT",
          "Tenant provisioning is already in progress",
          409,
          {
            tenant: {
              id: business.tenantDatabase.id,
              status: tenant?.status ?? "UNKNOWN",
            },
          },
        );
      }

      if (
        !(error instanceof TenantProvisioningError) ||
        tenant?.status !== "FAILED"
      ) {
        return errorResponse(
          "TENANT_PROVISIONING_STATE_UNKNOWN",
          "Tenant provisioning outcome could not be verified",
          503,
          {
            tenant: {
              id: business.tenantDatabase.id,
              status: tenant?.status ?? "UNKNOWN",
            },
          },
        );
      }

      return errorResponse(
        "TENANT_PROVISIONING_FAILED",
        "Tenant provisioning failed",
        202,
        {
          tenant: {
            id: business.tenantDatabase.id,
            status: "FAILED",
          },
        },
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

      return successResponse(
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
      );
    } catch (error) {
      console.error("Initial location creation failed during provisioning retry:", {
        businessId: business.id,
        error,
      });

      return errorResponse(
        "INITIAL_LOCATION_CREATION_FAILED",
        "Tenant is active, but initial location creation failed",
        202,
        {
          tenant: {
            id: provisioning.tenantDatabaseId,
            key: provisioning.tenantKey,
            status: provisioning.status,
          },
          onboarding: { status: "LOCATION_CREATION_FAILED" },
        },
      );
    }
  } catch (error) {
    return handleApiError(error, "RETRY_FAILED", "Unable to retry tenant provisioning");
  }
}
