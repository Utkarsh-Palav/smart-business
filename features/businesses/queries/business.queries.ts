export type Business = {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  _count: {
    locations: number;
    reviewCards: number;
  };
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
  const response = await fetch("/api/businesses", {
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
  const response = await fetch(
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