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

type BusinessesResponse = {
  success: boolean;
  data: Business[];
};

type BusinessResponse = {
  success: boolean;
  data: Business;
};

export async function getBusinesses(): Promise<Business[]> {
  const response = await authenticatedFetch("/api/businesses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch businesses");
  }

  const result: BusinessesResponse = await response.json();

  if (!result.success) {
    throw new Error("Failed to fetch businesses");
  }

  return result.data;
}

export async function getBusinessById(
  businessId: string,
): Promise<Business> {
  const response = await authenticatedFetch(
    `/api/businesses/${businessId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch business");
  }

  const result: BusinessResponse = await response.json();

  if (!result.success) {
    throw new Error("Failed to fetch business");
  }

  return result.data;
}
import { authenticatedFetch } from "@/lib/auth/client/authenticated-fetch";
