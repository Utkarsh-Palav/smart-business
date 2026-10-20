import "server-only";

import { ApiError } from "@/lib/api/api-error";
import { controlPrisma } from "@/lib/db/control";
import {
  canManageBusinessLocations,
  canReadBusinessLocations,
} from "@/lib/business/business-access.policy";
import { getTenantPrisma } from "@/lib/tenancy/tenant-client";

export type BusinessAccessLevel = "read" | "manage";

export class BusinessTenantContextError extends ApiError {}

export async function getBusinessTenantContext(
  userId: string,
  businessId: string,
  accessLevel: BusinessAccessLevel,
) {
  const membership = await controlPrisma.businessMembership.findUnique({
    where: { userId_businessId: { userId, businessId } },
    select: {
      status: true,
      business: {
        select: {
          id: true,
          status: true,
          tenantDatabase: {
            select: {
              id: true,
              tenantKey: true,
              databaseName: true,
              databaseHost: true,
              connectionSecretRef: true,
              status: true,
            },
          },
        },
      },
      role: { select: { slug: true } },
    },
  });

  const access = {
    status: membership?.status ?? "MISSING",
    businessStatus: membership?.business.status ?? "MISSING",
    roleSlug: membership?.role.slug ?? null,
  };

  if (!canReadBusinessLocations(access)) {
    throw new BusinessTenantContextError(
      "You do not have access to this business.",
      "BUSINESS_ACCESS_DENIED",
      403,
    );
  }

  if (
    accessLevel === "manage" &&
    !canManageBusinessLocations(access)
  ) {
    throw new BusinessTenantContextError(
      "Your role cannot manage this business resource.",
      "ROLE_FORBIDDEN",
      403,
    );
  }

  try {
    const tenantDatabase = membership?.business.tenantDatabase;
    if (!membership || !tenantDatabase || tenantDatabase.status !== "ACTIVE") {
      throw new BusinessTenantContextError(
        "The business data store is not available.",
        "TENANT_UNAVAILABLE",
        503,
      );
    }

    const tenant = {
      businessId: membership.business.id,
      tenantDatabaseId: tenantDatabase.id,
      tenantKey: tenantDatabase.tenantKey,
      databaseName: tenantDatabase.databaseName,
      databaseHost: tenantDatabase.databaseHost,
      connectionSecretRef: tenantDatabase.connectionSecretRef,
    };
    const db = await getTenantPrisma(tenant);
    return { tenant, db };
  } catch (error) {
    if (error instanceof BusinessTenantContextError) throw error;
    throw new BusinessTenantContextError(
      "The business data store is not available.",
      "TENANT_UNAVAILABLE",
      503,
      undefined,
      { cause: error },
    );
  }
}
