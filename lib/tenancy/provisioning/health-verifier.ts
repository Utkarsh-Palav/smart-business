import { PrismaClient } from "@/generated/tenant/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "server-only";

export interface TenantHealthVerifier {
  verify(databaseUrl: string): Promise<void>;
}

export class PrismaTenantHealthVerifier implements TenantHealthVerifier {
  async verify(databaseUrl: string): Promise<void> {
    if (!databaseUrl)
      throw new Error(
        "Tenant database URL is required for health verification",
      );

    const adapter = new PrismaPg(databaseUrl);
    const client = new PrismaClient({ adapter });

    try {
      await client.$queryRaw`SELECT 1`;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(`Tenant database health check failed: ${message}`, {
        cause: error,
      });
    } finally {
      await client.$disconnect();
    }
  }
}
