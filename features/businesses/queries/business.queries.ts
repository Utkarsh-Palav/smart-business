import { apiRequest } from "@/lib/api/client";

export type Business = {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  legalName: string | null;
  businessType:
    | "CAFE"
    | "RESTAURANT"
    | "QSR"
    | "CLOUD_KITCHEN"
    | "BAKERY"
    | "FOOD_TRUCK"
    | "OTHER";
  gstin: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    memberships: number;
    reviewCardAssignments: number;
  };
  onboardingProfile: {
    firstLocationName: string;
    firstLocationSlug: string;
    operatingMode: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string | null;
  } | null;
};

export async function getBusinesses(): Promise<Business[]> {
  return apiRequest<Business[]>("/api/businesses");
}

export async function getBusinessById(
  businessId: string,
): Promise<Business> {
  return apiRequest<Business>(`/api/businesses/${encodeURIComponent(businessId)}`);
}
