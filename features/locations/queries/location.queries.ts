export type Location = {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

type LocationsResponse = {
  success: boolean;
  data: Location[];
};

export async function getLocationsByBusinessId(
  businessId: string,
): Promise<Location[]> {
  const response = await fetch(
    `/api/locations?businessId=${encodeURIComponent(businessId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  const result: LocationsResponse = await response.json();

  if (!result.success) {
    throw new Error("Failed to fetch locations");
  }

  return result.data;
}