import { execFile } from "node:child_process";
import { resolve } from "node:path";
import "server-only";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const TENANT_MIGRATION_TIMEOUT_MS = 10 * 60 * 1000;
const TENANT_MIGRATION_MAX_BUFFER_BYTES = 10 * 1024 * 1024;

type MigrationProcessError = Error & {
  code?: number | string;
  signal?: NodeJS.Signals;
  stderr?: string | Buffer;
  stdout?: string | Buffer;
};

export interface TenantMigrationRunner {
  migrate(databaseUrl: string): Promise<void>;
}

export class PrismaTenantMigrationRunner implements TenantMigrationRunner {
  async migrate(databaseUrl: string): Promise<void> {
    if (!databaseUrl)
      throw new Error("Tenant database is required for migrations");

    try {
      const projectRoot = process.cwd();
      const tenantConfigPath = resolve(
        projectRoot,
        "prisma",
        "tenant.config.ts",
      );
      const prismaCliPath = resolve(
        projectRoot,
        "node_modules",
        "prisma",
        "build",
        "index.js",
      );

      await execFileAsync(
        process.execPath,
        [
          prismaCliPath,
          "migrate",
          "deploy",
          "--config",
          tenantConfigPath,
        ],
        {
          cwd: projectRoot,
          env: {
            ...process.env,
            CI: "true",
            TENANT_DATABASE_URL: databaseUrl,
          },
          windowsHide: true,
          timeout: TENANT_MIGRATION_TIMEOUT_MS,
          maxBuffer: TENANT_MIGRATION_MAX_BUFFER_BYTES,
        },
      );
    } catch (error) {
      const processError = error as MigrationProcessError;
      const output = [processError.stderr, processError.stdout]
        .filter((value) => value !== undefined && value !== "")
        .map(String)
        .join("\n")
        .trim();
      const diagnostic = output || processError.message || String(error);
      const safeDiagnostic = diagnostic
        .replaceAll(databaseUrl, "[redacted tenant database URL]")
        .replace(
          /(?:postgres|postgresql):\/\/[^\s"'<>]+/gi,
          "[redacted database URL]",
        )
        .slice(0, 3000);
      const exitDetails = [
        processError.code !== undefined ? `exit code ${processError.code}` : "",
        processError.signal ? `signal ${processError.signal}` : "",
      ]
        .filter(Boolean)
        .join(", ");

      throw new Error(
        `Tenant database migration failed${exitDetails ? ` (${exitDetails})` : ""}: ${safeDiagnostic}`,
        {
          cause: error,
        },
      );
    }
  }
}
