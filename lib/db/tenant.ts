import "server-only";

import { PrismaClient } from "@/generated/tenant/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.TENANT_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("TENANT_DATABASE_URL is not configured");
}

const adapter = new PrismaPg(databaseUrl);

const globalForTenantPrisma = globalThis as unknown as {
  tenantPrisma: PrismaClient | undefined;
};

export const tenantPrisma =
  globalForTenantPrisma.tenantPrisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForTenantPrisma.tenantPrisma = tenantPrisma;
}
