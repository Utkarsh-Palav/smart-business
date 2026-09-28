import { PrismaClient } from "@/generated/tenant/client";
import { TenantResolution } from "./types";
import { getSecretProvider } from "../secrets/provider";
import { PrismaPg } from "@prisma/adapter-pg";

const tenantClients = new Map<string, PrismaClient>();

async function getTenantDatabaseUrl(tenant: TenantResolution): Promise<string> {
  if (!tenant.connectionSecretRef) {
    throw new Error(
      `Tenant "${tenant.tenantKey}" has no connection secret reference`,
    );
  }

  const secretProvider = getSecretProvider();

  return secretProvider.getSecret(tenant.connectionSecretRef);
}

export async function getTenantPrisma(
    tenant: TenantResolution
): Promise<PrismaClient> {
    const existingClient = tenantClients.get(tenant.tenantKey);

    if (existingClient) {
        return existingClient;
    }

    const databaseUrl = await getTenantDatabaseUrl(tenant);

    const adapter = new PrismaPg(databaseUrl);

    const client = new PrismaClient({
        adapter,
    });

    tenantClients.set(tenant.tenantKey, client);

    return client;
}