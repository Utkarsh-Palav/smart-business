export type CreateBusinessInput = {
  userId: string;
  name: string;
  slug: string;
};

export type CreateBusinessResult = {
  businessId: string;
  businessName: string;
  businessSlug: string;
  membershipId: string;
  tenantDatabaseId: string;
  tenantKey: string;
  tenantDatabaseStatus: "PROVISIONING";
  subscriptionId: string;
  subscriptionStatus: "TRIAL";
};