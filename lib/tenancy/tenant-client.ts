import { PrismaClient } from "@/generated/tenant/client";
import { TenantResolution } from "./types";
import { getSecretProvider } from "../secrets/provider";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizePostgresConnectionUrl } from "@/lib/db/connection-url";

const tenantClients = new Map<string, Promise<PrismaClient>>();

function tenantPoolSize() {
  const configured = Number(process.env.TENANT_DATABASE_POOL_MAX ?? "5");
  if (!Number.isInteger(configured) || configured < 1 || configured > 20) {
    throw new Error("TENANT_DATABASE_POOL_MAX must be an integer between 1 and 20");
  }
  return configured;
}

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
  tenant: TenantResolution,
): Promise<PrismaClient> {
  const existingClient = tenantClients.get(tenant.tenantKey);
  if (existingClient) return existingClient;

  const pendingClient = (async () => {
    const databaseUrl = await getTenantDatabaseUrl(tenant);
    const adapter = new PrismaPg({
      connectionString: normalizePostgresConnectionUrl(databaseUrl),
      max: tenantPoolSize(),
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
    });
    return new PrismaClient({ adapter });
  })();

  tenantClients.set(tenant.tenantKey, pendingClient);
  try {
    return await pendingClient;
  } catch (error) {
    if (tenantClients.get(tenant.tenantKey) === pendingClient) {
      tenantClients.delete(tenant.tenantKey);
    }
    throw error;
  }
}
