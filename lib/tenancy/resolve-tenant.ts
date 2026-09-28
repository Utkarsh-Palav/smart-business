import { controlPrisma } from "../db/control";
import { TenantResolution } from "./types";

export class TenantResolutionError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "BUSINESS_NOT_FOUND"
      | "TENANT_DATABASE_NOT_FOUND"
      | "TENANT_DATABASE_UNAVAILABLE",
  ) {
    super(message);
    this.name = "TenantResolutionError";
  }
}

export async function resolveTenant(
  businessId: string,
): Promise<TenantResolution> {
  const business = await controlPrisma.business.findUnique({
    where: {
      id: businessId,
    },
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
  });

  if (!business) {
    throw new TenantResolutionError(
      `Business not found: ${businessId}`,
      "BUSINESS_NOT_FOUND",
    );
  }

  if (!business.tenantDatabase) {
    throw new TenantResolutionError(
      `Tenant database not found for business: ${businessId}`,
      "TENANT_DATABASE_NOT_FOUND",
    );
  }

  if (business.tenantDatabase.status !== "ACTIVE") {
    throw new TenantResolutionError(
      `Tenant database is not available for business: ${businessId}`,
      "TENANT_DATABASE_UNAVAILABLE",
    );
  }

  return {
    businessId: business.id,
    tenantDatabaseId: business.tenantDatabase.id,
    tenantKey: business.tenantDatabase.tenantKey,
    databaseName: business.tenantDatabase.databaseName,
    databaseHost: business.tenantDatabase.databaseHost,
    connectionSecretRef: business.tenantDatabase.connectionSecretRef,
  };
}
