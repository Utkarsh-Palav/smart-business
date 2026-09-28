import { TenantDatabaseStatus } from "@/generated/control/enums";

export type TenantResolver = {
  tenantDatabaseId: string;
  businessId: string;
  tenantKey: string;
  databaseName: string;
  databaseHost: string;
  connectionSecretRef: string | null;
  status: TenantDatabaseStatus;
};
