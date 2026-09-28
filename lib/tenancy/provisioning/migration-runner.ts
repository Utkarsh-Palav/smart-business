import { execFile } from "child_process";
import "server-only";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface TenantMigrationRunner {
  migrate(databaseUrl: string): Promise<void>;
}

export class PrismaTenantMigrationRunner implements TenantMigrationRunner {
  async migrate(databaseUrl: string): Promise<void> {
    if (!databaseUrl)
      throw new Error("Tenant database is required for migrations");

    try {
      await execFileAsync(
        "pnpm",
        ["prisma", "migrate", "deploy", "--config", "prisma/tenant.config.ts"],
        {
          env: {
            ...process.env,
            TENANT_DATABASE_URL: databaseUrl,
          },
          windowsHide: true,
        },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(`Tenant database migration failed: ${message}`, {
        cause: error,
      });
    }
  }
}
