import "server-only";

import { randomBytes } from "node:crypto";

import { controlPrisma } from "@/lib/db/control";

import type { TenantDatabaseProvider } from "./database-provider";
import type { TenantMigrationRunner } from "./migration-runner";
import type { TenantSecretManager } from "./secret-manager";
import type { TenantHealthVerifier } from "./health-verifier";
import { Prisma } from "@/generated/control/client";

export type ProvisionTenantInput = {
  businessId: string;
  businessName: string;
};

export type ProvisionTenantResult = {
  businessId: string;
  tenantDatabaseId: string;
  tenantKey: string;
  status: "ACTIVE";
};

export class TenantProvisioningError extends Error {
  constructor(
    message: string,
    public readonly businessId: string,
    public readonly tenantDatabaseId?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "TenantProvisioningError";
  }
}

export class TenantProvisioningConflictError extends Error {
  constructor(
    message: string,
    public readonly businessId: string,
  ) {
    super(message);
    this.name = "TenantProvisioningConflictError";
  }
}

export class TenantProvisioner {
  constructor(
    private readonly databaseProvider: TenantDatabaseProvider,
    private readonly migrationRunner: TenantMigrationRunner,
    private readonly secretManager: TenantSecretManager,
    private readonly healthVerifier: TenantHealthVerifier,
  ) {}

  async provision(input: ProvisionTenantInput): Promise<ProvisionTenantResult> {
    const business = await controlPrisma.business.findUnique({
      where: {
        id: input.businessId,
      },
      select: {
        id: true,
        name: true,
        tenantDatabase: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!business) {
      throw new TenantProvisioningError(
        `Business "${input.businessId}" was not found`,
        input.businessId,
      );
    }

    /**
     * Fast application-level check.
     *
     * The database UNIQUE constraint on
     * TenantDatabase.businessId remains the final
     * concurrency protection.
     */
    if (business.tenantDatabase) {
      throw new TenantProvisioningConflictError(
        `Business "${input.businessId}" already has tenant database "${business.tenantDatabase.id}" with status "${business.tenantDatabase.status}"`,
        business.id,
      );
    }

    const tenantKey = this.generateTenantKey();

    let tenantDatabase;

    /**
     * The UNIQUE constraint on businessId protects
     * against two concurrent provisioning requests.
     */
    try {
      tenantDatabase = await controlPrisma.tenantDatabase.create({
        data: {
          businessId: business.id,
          tenantKey,
          databaseName: this.generateDatabaseName(tenantKey),
          databaseHost: "pending",
          status: "PROVISIONING",
        },
        select: {
          id: true,
          tenantKey: true,
          databaseName: true,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) {
        throw new TenantProvisioningConflictError(
          `Business "${business.id}" is already being provisioned`,
          business.id,
        );
      }

      throw error;
    }

    try {
      /**
       * Step 1:
       * Provision the physical tenant database.
       */
      const provisioned = await this.databaseProvider.provision({
        tenantKey,
        businessName: business.name,
        databaseName: tenantDatabase.databaseName,
      });

      /**
       * Step 2:
       * Persist Neon infrastructure details
       * immediately after successful provisioning.
       */
      await controlPrisma.tenantDatabase.update({
        where: {
          id: tenantDatabase.id,
        },
        data: {
          neonProjectId: provisioned.neonProjectId,
          neonBranchId: provisioned.neonBranchId,
          databaseHost: provisioned.databaseHost,
          databaseName: provisioned.databaseName,
        },
      });

      /**
       * Step 3:
       * Apply tenant database migrations.
       */
      await this.migrationRunner.migrate(
        provisioned.credentials.connectionString,
      );

      await controlPrisma.tenantDatabase.update({
        where: {
          id: tenantDatabase.id,
        },
        data: {
          lastMigrationAt: new Date(),
        },
      });

      /**
       * Step 4:
       * Store the tenant database connection
       * securely in Infisical.
       */
      const secretRef = await this.secretManager.setDatabaseUrl(
        tenantKey,
        provisioned.credentials.connectionString,
      );

      /**
       * Step 5:
       * Verify that the newly migrated database
       * is reachable.
       */
      await this.healthVerifier.verify(
        provisioned.credentials.connectionString,
      );

      /**
       * Step 6:
       * Tenant provisioning completed successfully.
       */
      const now = new Date();

      const updated = await controlPrisma.tenantDatabase.update({
        where: {
          id: tenantDatabase.id,
        },
        data: {
          connectionSecretRef: secretRef,
          status: "ACTIVE",
          schemaVersion: "1.0.0",
          provisionedAt: now,
          lastMigrationAt: now,
          lastProvisioningError: null,
        },
        select: {
          businessId: true,
          id: true,
          tenantKey: true,
          status: true,
        },
      });

      return {
        businessId: updated.businessId,
        tenantDatabaseId: updated.id,
        tenantKey: updated.tenantKey,
        status: "ACTIVE",
      };
    } catch (error) {
      /**
       * Provisioning failed after the TenantDatabase
       * record was created.
       *
       * Do not automatically destroy external
       * infrastructure yet.
       */
      const message = error instanceof Error ? error.message : String(error);
      
      await controlPrisma.tenantDatabase.update({
        where: {
          id: tenantDatabase.id,
        },
        data: {
          status: "FAILED",
          lastProvisioningError: message,
        },
      });

      throw new TenantProvisioningError(
        `Tenant provisioning failed: ${message}`,
        business.id,
        tenantDatabase.id,
        {
          cause: error,
        },
      );
    }
  }

  private generateTenantKey(): string {
    return `ten_${randomBytes(12).toString("hex")}`;
  }

  private generateDatabaseName(tenantKey: string): string {
    return `tenant_${tenantKey.replace(/^ten_/, "")}`;
  }

  private isUniqueConstraintViolation(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    );
  }
}
