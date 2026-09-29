import "server-only";

import { randomUUID } from "node:crypto";

import { controlPrisma } from "@/lib/db/control";

import type { TenantDatabaseProvider } from "./database-provider";
import type { TenantMigrationRunner } from "./migration-runner";
import type { TenantSecretManager } from "./secret-manager";
import type { TenantHealthVerifier } from "./health-verifier";

const PROVISIONING_LEASE_DURATION_MS = 5 * 60 * 1000;
const PROVISIONING_LEASE_RENEWAL_MS = 60 * 1000;

function getProvisioningErrorDetails(error: unknown): string {
  const messages: string[] = [];
  let current: unknown = error;

  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (current instanceof Error) {
      messages.push(current.message);
      current = current.cause;
      continue;
    }

    messages.push(String(current));
    break;
  }

  return messages
    .join(" <- ")
    .replace(/(?:postgres|postgresql):\/\/[^\s"'<>]+/gi, "[redacted database URL]")
    .slice(0, 2000);
}

export type ProvisionTenantInput = {
  businessId: string;
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

export class TenantProvisioningStateError extends Error {
  constructor(
    message: string,
    public readonly businessId: string,
    public readonly tenantDatabaseId: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "TenantProvisioningStateError";
  }
}

export class TenantProvisioner {
  constructor(
    private readonly databaseProvider: TenantDatabaseProvider,
    private readonly migrationRunner: TenantMigrationRunner,
    private readonly secretManager: TenantSecretManager,
    private readonly healthVerifier: TenantHealthVerifier,
  ) {}

  async getTenantDatabaseStatus(businessId: string) {
    return controlPrisma.tenantDatabase.findUnique({
      where: { businessId },
      select: {
        id: true,
        status: true,
      },
    });
  }

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
            tenantKey: true,
            databaseName: true,
            neonProjectId: true,
            neonBranchId: true,
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

    const tenantDatabase = business.tenantDatabase;

    if (!tenantDatabase) {
      throw new TenantProvisioningError(
        `Business "${business.id}" does not have a TenantDatabase record`,
        business.id,
      );
    }

    if (
      tenantDatabase.status !== "PROVISIONING" &&
      tenantDatabase.status !== "FAILED"
    ) {
      throw new TenantProvisioningConflictError(
        `Tenant database "${tenantDatabase.id}" cannot be provisioned from status "${tenantDatabase.status}"`,
        business.id,
      );
    }

    const leaseId = randomUUID();
    await this.claimProvisioningLease(tenantDatabase.id, business.id, leaseId);

    const lease = this.startLeaseHeartbeat(
      tenantDatabase.id,
      business.id,
      leaseId,
    );
    let stage = "Neon provisioning";

    try {
      const providerInput = {
        tenantKey: tenantDatabase.tenantKey,
        businessName: business.name,
        databaseName: tenantDatabase.databaseName,
      };

      await lease.assertOwned();
      const provisioned = tenantDatabase.neonProjectId
        ? await this.databaseProvider.get({
            ...providerInput,
            neonProjectId: tenantDatabase.neonProjectId,
            neonBranchId: tenantDatabase.neonBranchId,
          })
        : await this.databaseProvider.provision(providerInput);

      if (!provisioned) {
        throw new Error(
          `Neon project "${tenantDatabase.neonProjectId}" could not be recovered`,
        );
      }

      stage = "Control DB metadata persistence";
      await this.updateOwnedTenantDatabase(tenantDatabase.id, leaseId, {
        neonProjectId: provisioned.neonProjectId,
        neonBranchId: provisioned.neonBranchId,
        databaseHost: provisioned.databaseHost,
        databaseName: provisioned.databaseName,
      });

      stage = "tenant migration";
      await lease.assertOwned();
      await this.migrationRunner.migrate(
        provisioned.credentials.connectionString,
      );

      await this.updateOwnedTenantDatabase(tenantDatabase.id, leaseId, {
        lastMigrationAt: new Date(),
      });

      stage = "Infisical secret storage";
      await lease.assertOwned();
      const secretRef = await this.secretManager.setDatabaseUrl(
        tenantDatabase.tenantKey,
        provisioned.credentials.connectionString,
      );

      stage = "tenant health verification";
      await lease.assertOwned();
      await this.healthVerifier.verify(
        provisioned.credentials.connectionString,
      );

      stage = "tenant activation";
      const now = new Date();

      const activated = await controlPrisma.tenantDatabase.updateMany({
        where: {
          id: tenantDatabase.id,
          status: "PROVISIONING",
          provisioningLeaseId: leaseId,
        },
        data: {
          connectionSecretRef: secretRef,
          status: "ACTIVE",
          schemaVersion: "1.0.0",
          provisionedAt: now,
          lastMigrationAt: now,
          lastProvisioningError: null,
          provisioningLeaseId: null,
          provisioningLeaseExpiresAt: null,
        },
      });

      if (activated.count !== 1) {
        throw new TenantProvisioningStateError(
          "Tenant provisioning lease was lost before activation.",
          business.id,
          tenantDatabase.id,
        );
      }

      return {
        businessId: business.id,
        tenantDatabaseId: tenantDatabase.id,
        tenantKey: tenantDatabase.tenantKey,
        status: "ACTIVE",
      };
    } catch (error) {
      const errorDetails = getProvisioningErrorDetails(error);

      console.error("Tenant provisioning failed", {
        businessId: business.id,
        tenantDatabaseId: tenantDatabase.id,
        stage,
        error: errorDetails,
      });

      try {
        const failed = await controlPrisma.tenantDatabase.updateMany({
          where: {
            id: tenantDatabase.id,
            status: "PROVISIONING",
            provisioningLeaseId: leaseId,
          },
          data: {
            status: "FAILED",
            lastProvisioningError: `${stage}: ${errorDetails}`,
            provisioningLeaseId: null,
            provisioningLeaseExpiresAt: null,
          },
        });

        if (failed.count !== 1) {
          throw new TenantProvisioningStateError(
            "Tenant provisioning outcome could not be persisted.",
            business.id,
            tenantDatabase.id,
            { cause: error },
          );
        }
      } catch (persistenceError) {
        throw new TenantProvisioningStateError(
          "Tenant provisioning outcome could not be verified.",
          business.id,
          tenantDatabase.id,
          { cause: persistenceError },
        );
      }

      throw new TenantProvisioningError(
        "Tenant provisioning failed.",
        business.id,
        tenantDatabase.id,
        {
          cause: error,
        },
      );
    } finally {
      lease.stop();
    }
  }

  private async claimProvisioningLease(
    tenantDatabaseId: string,
    businessId: string,
    leaseId: string,
  ): Promise<void> {
    const now = new Date();
    const claim = await controlPrisma.tenantDatabase.updateMany({
      where: {
        id: tenantDatabaseId,
        OR: [
          { status: "FAILED" },
          {
            status: "PROVISIONING",
            OR: [
              { provisioningLeaseExpiresAt: null },
              { provisioningLeaseExpiresAt: { lte: now } },
            ],
          },
        ],
      },
      data: {
        status: "PROVISIONING",
        lastProvisioningError: null,
        provisioningLeaseId: leaseId,
        provisioningLeaseExpiresAt: new Date(
          now.getTime() + PROVISIONING_LEASE_DURATION_MS,
        ),
      },
    });

    if (claim.count !== 1) {
      throw new TenantProvisioningConflictError(
        `Tenant database "${tenantDatabaseId}" is already being provisioned or is not retryable.`,
        businessId,
      );
    }
  }

  private startLeaseHeartbeat(
    tenantDatabaseId: string,
    businessId: string,
    leaseId: string,
  ) {
    let renewalError: unknown;
    let renewing = false;

    const renew = async () => {
      if (renewing) {
        return;
      }

      renewing = true;

      try {
        const renewed = await controlPrisma.tenantDatabase.updateMany({
          where: {
            id: tenantDatabaseId,
            status: "PROVISIONING",
            provisioningLeaseId: leaseId,
          },
          data: {
            provisioningLeaseExpiresAt: new Date(
              Date.now() + PROVISIONING_LEASE_DURATION_MS,
            ),
          },
        });

        if (renewed.count !== 1) {
          renewalError = new TenantProvisioningStateError(
            "Tenant provisioning lease was lost.",
            businessId,
            tenantDatabaseId,
          );
        }
      } catch (error) {
        renewalError = error;
      } finally {
        renewing = false;
      }
    };

    const timer = setInterval(() => {
      void renew();
    }, PROVISIONING_LEASE_RENEWAL_MS);
    timer.unref();

    return {
      assertOwned: async () => {
        if (renewalError) {
          throw renewalError;
        }

        await renew();

        if (renewalError) {
          throw renewalError;
        }
      },
      stop: () => clearInterval(timer),
    };
  }

  private async updateOwnedTenantDatabase(
    tenantDatabaseId: string,
    leaseId: string,
    data: {
      neonProjectId?: string;
      neonBranchId?: string | null;
      databaseHost?: string | null;
      databaseName?: string;
      lastMigrationAt?: Date;
    },
  ): Promise<void> {
    const updated = await controlPrisma.tenantDatabase.updateMany({
      where: {
        id: tenantDatabaseId,
        status: "PROVISIONING",
        provisioningLeaseId: leaseId,
      },
      data,
    });

    if (updated.count !== 1) {
      throw new TenantProvisioningStateError(
        "Tenant provisioning lease was lost before Control DB persistence.",
        "",
        tenantDatabaseId,
      );
    }
  }

}
