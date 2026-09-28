export type TenantResolution = {
  businessId: string;
  tenantDatabaseId: string;
  tenantKey: string;
  databaseName: string;
  databaseHost: string;
  connectionSecretRef: string | null;
};