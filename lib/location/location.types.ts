export type CreateInitialLocationInput = {
  businessId: string;
  name: string;
  slug: string;
  operatingMode?:
    | "DINE_IN"
    | "TAKEAWAY"
    | "DELIVERY_ONLY"
    | "HYBRID"
    | "OTHER";
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  phone?: string | null;
};

export type InitialLocationResult = {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
};
