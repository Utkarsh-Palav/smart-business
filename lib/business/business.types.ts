export type CreateBusinessInput = {
  userId: string;
  name: string;
  slug: string;
  businessType:
    | "CAFE"
    | "RESTAURANT"
    | "QSR"
    | "CLOUD_KITCHEN"
    | "BAKERY"
    | "FOOD_TRUCK"
    | "OTHER";
  legalName?: string;
  gstin?: string;
  firstLocation: {
    name: string;
    slug: string;
    operatingMode:
      | "DINE_IN"
      | "TAKEAWAY"
      | "DELIVERY_ONLY"
      | "HYBRID"
      | "OTHER";
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    phone?: string;
  };
};

export type CreateBusinessResult = {
  businessId: string;
  businessName: string;
  businessSlug: string;
  firstLocation: CreateBusinessInput["firstLocation"];
  membershipId: string;
  tenantDatabaseId: string;
  tenantKey: string;
  tenantDatabaseStatus: "PROVISIONING";
  subscriptionId: string;
  subscriptionStatus: "TRIAL";
};