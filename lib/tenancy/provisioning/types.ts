export type TenantProvisioningStatus =
  | "PROVISIONING"
  | "ACTIVE"
  | "MIGRATION_REQUIRED"
  | "SUSPENDED"
  | "FAILED"
  | "ARCHIVED";

export type TenantDatabaseCredentials = {
  connectionString: string;
};

export type ProvisionedTenantDatabase = {
  tenantKey: string;
  databaseName: string;
  databaseHost: string | null;
  neonProjectId: string;
  neonBranchId: string | null;
  credentials: TenantDatabaseCredentials;
};

export type TenantProvisioningResult = {
  businessId: string;
  tenantDatabaseId: string;
  tenantKey: string;
  status: TenantProvisioningStatus;
};