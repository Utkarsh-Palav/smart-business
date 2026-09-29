import "server-only";

import { NeonTenantDatabaseProvider } from "./neon-provider";
import { PrismaTenantMigrationRunner } from "./migration-runner";
import { InfisicalTenantSecretManager } from "./secret-manager";
import { PrismaTenantHealthVerifier } from "./health-verifier";
import { TenantProvisioner } from "./tenant-provisioner";

export const tenantProvisioner = new TenantProvisioner(
  new NeonTenantDatabaseProvider(),
  new PrismaTenantMigrationRunner(),
  new InfisicalTenantSecretManager(),
  new PrismaTenantHealthVerifier(),
);
