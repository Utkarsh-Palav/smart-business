import "dotenv/config";

import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

import { InfisicalSDK } from "@infisical/sdk";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/control/client";

const execFileAsync = promisify(execFile);
const MIGRATION_TIMEOUT_MS = 10 * 60 * 1000;
const MIGRATION_MAX_BUFFER_BYTES = 10 * 1024 * 1024;
const controlDatabaseUrl = process.env.CONTROL_DATABASE_URL;

if (!controlDatabaseUrl) {
  throw new Error("CONTROL_DATABASE_URL is not configured");
}

const controlPrisma = new PrismaClient({
  adapter: new PrismaPg(controlDatabaseUrl),
});

type MigrationProcessError = Error & {
  code?: number | string;
  signal?: NodeJS.Signals;
  stderr?: string | Buffer;
  stdout?: string | Buffer;
};

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function redactDatabaseUrl(message: string, databaseUrl?: string): string {
  const redactedMessage = databaseUrl
    ? message.replaceAll(databaseUrl, "[redacted tenant database URL]")
    : message;

  return redactedMessage
    .replace(
      /(?:postgres|postgresql):\/\/[^\s"'<>]+/gi,
      "[redacted database URL]",
    )
    .slice(0, 3000);
}

async function getTenantDatabaseUrl(
  client: InfisicalSDK,
  projectId: string,
  environment: string,
  secretRef: string,
): Promise<string> {
  const separatorIndex = secretRef.lastIndexOf("/");

  if (separatorIndex < 0 || separatorIndex === secretRef.length - 1) {
    throw new Error("Tenant connection secret reference is invalid");
  }

  const secretPath = secretRef.slice(0, separatorIndex) || "/";
  const secretName = secretRef.slice(separatorIndex + 1);
  const secret = await client.secrets().getSecret({
    secretName,
    projectId,
    environment,
    secretPath,
  });

  if (!secret.secretValue) {
    throw new Error("Tenant database URL secret is empty");
  }

  return secret.secretValue;
}

async function main(): Promise<void> {
  const siteUrl = requireEnvironmentVariable("INFISICAL_SITE_URL");
  const projectId = requireEnvironmentVariable("INFISICAL_PROJECT_ID");
  const clientId = requireEnvironmentVariable("INFISICAL_CLIENT_ID");
  const clientSecret = requireEnvironmentVariable("INFISICAL_CLIENT_SECRET");
  const environment = process.env.INFISICAL_ENVIRONMENT ?? "production";
  const projectRoot = process.cwd();
  const prismaCliPath = resolve(
    projectRoot,
    "node_modules",
    "prisma",
    "build",
    "index.js",
  );
  const tenantConfigPath = resolve(
    projectRoot,
    "prisma",
    "tenant.config.ts",
  );

  const client = new InfisicalSDK({ siteUrl });
  await client.auth().universalAuth.login({ clientId, clientSecret });

  const tenants = await controlPrisma.tenantDatabase.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      tenantKey: true,
      connectionSecretRef: true,
    },
    orderBy: { createdAt: "asc" },
  });

  if (tenants.length === 0) {
    const statusCounts = await controlPrisma.tenantDatabase.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    console.warn(
      "No ACTIVE tenants found. Tenant row counts by status:",
      statusCounts.map(({ status, _count }) => ({
        status,
        count: _count._all,
      })),
    );
  }

  console.log(`Applying pending tenant migrations to ${tenants.length} active tenant(s).`);

  const failures: string[] = [];

  for (const tenant of tenants) {
    const secretRef = tenant.connectionSecretRef;

    if (!secretRef) {
      failures.push(`${tenant.tenantKey}: connection secret reference is missing`);
      continue;
    }

    let databaseUrl: string | undefined;

    try {
      databaseUrl = await getTenantDatabaseUrl(
        client,
        projectId,
        environment,
        secretRef,
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
          timeout: MIGRATION_TIMEOUT_MS,
          maxBuffer: MIGRATION_MAX_BUFFER_BYTES,
        },
      );

      await controlPrisma.tenantDatabase.updateMany({
        where: {
          id: tenant.id,
          status: "ACTIVE",
        },
        data: { lastMigrationAt: new Date() },
      });

      console.log(`✓ Migrated ${tenant.tenantKey}`);
    } catch (error) {
      const processError = error as MigrationProcessError;
      const processOutput = [processError.stderr, processError.stdout]
        .filter((value) => value !== undefined && value !== "")
        .map(String)
        .join("\n")
        .trim();
      const diagnostic = redactDatabaseUrl(
        processOutput || processError.message || String(error),
        databaseUrl,
      );

      failures.push(`${tenant.tenantKey}: ${diagnostic}`);
      console.error(`✗ Failed to migrate ${tenant.tenantKey}: ${diagnostic}`);
    }
  }

  if (failures.length > 0) {
    console.error(`Tenant migration failed for ${failures.length} tenant(s).`);
    process.exitCode = 1;
  } else {
    console.log("All active tenant databases are up to date.");
  }
}

main()
  .catch((error) => {
    console.error("Active tenant migration run failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await controlPrisma.$disconnect();
  });