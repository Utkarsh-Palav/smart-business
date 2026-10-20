import { apiRequest } from "@/lib/api/client";

export type Location = {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  operatingMode: "DINE_IN" | "TAKEAWAY" | "DELIVERY_ONLY" | "HYBRID" | "OTHER";
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { tables: number };
};

export type Table = {
  id: string;
  locationId: string;
  name: string;
  code: string;
  publicUrl: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
  _count: { orders: number };
};

type LocationInput = Partial<Omit<Location, "id" | "businessId" | "createdAt" | "updatedAt" | "_count">> & { name: string; slug: string };
type TableInput = { name?: string; capacity?: number | null; status?: "ACTIVE" | "INACTIVE" };

function locationUrl(businessId: string) {
  return `/api/locations?businessId=${encodeURIComponent(businessId)}`;
}
function locationDetailUrl(businessId: string, locationId: string) {
  return `/api/locations/${encodeURIComponent(locationId)}?businessId=${encodeURIComponent(businessId)}`;
}
function tablesUrl(businessId: string, locationId: string) {
  return `/api/locations/${encodeURIComponent(locationId)}/tables?businessId=${encodeURIComponent(businessId)}`;
}

export async function getLocationsByBusinessId(businessId: string): Promise<Location[]> {
  return apiRequest<Location[]>(locationUrl(businessId));
}

export async function createLocation(businessId: string, input: LocationInput): Promise<Location> {
  return apiRequest<Location>("/api/locations", { method: "POST", body: JSON.stringify({ businessId, ...input }) });
}

export async function updateLocation(businessId: string, locationId: string, input: Partial<LocationInput> & { status?: "ACTIVE" | "INACTIVE" }): Promise<Location> {
  return apiRequest<Location>(locationDetailUrl(businessId, locationId), { method: "PATCH", body: JSON.stringify(input) });
}

export async function getTables(businessId: string, locationId: string): Promise<Table[]> {
  return apiRequest<Table[]>(tablesUrl(businessId, locationId));
}

export async function createTable(businessId: string, locationId: string, input: { name: string; capacity?: number | null }): Promise<Table> {
  return apiRequest<Table>(tablesUrl(businessId, locationId), { method: "POST", body: JSON.stringify(input) });
}

export async function updateTable(businessId: string, locationId: string, tableId: string, input: TableInput): Promise<Table> {
  return apiRequest<Table>(`/api/locations/${encodeURIComponent(locationId)}/tables/${encodeURIComponent(tableId)}?businessId=${encodeURIComponent(businessId)}`, { method: "PATCH", body: JSON.stringify(input) });
}
