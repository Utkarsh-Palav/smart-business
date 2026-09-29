import "server-only";

import type { ProvisionedTenantDatabase } from "./types";

export interface TenantDatabaseProvider {
  provision(
    input: ProvisionTenantDatabaseInput,
  ): Promise<ProvisionedTenantDatabase>;

  get(
    input: GetTenantDatabaseInput,
  ): Promise<ProvisionedTenantDatabase | null>;

  destroy(neonProjectId: string): Promise<void>;
}

export type ProvisionTenantDatabaseInput = {
  tenantKey: string;
  businessName: string;
  databaseName: string;
};

export type GetTenantDatabaseInput = ProvisionTenantDatabaseInput & {
  neonProjectId: string;
  neonBranchId: string | null;
};
