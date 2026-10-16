import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createTableSchema } from "@/features/locations/schemas/location.schema";
import { locationManagementService } from "@/lib/location/location-management.service";
import { locationApiError, publicAppOrigin, unauthorizedError, validationError } from "@/lib/location/location-api";

type TablesRouteContext = { params: Promise<{ locationId: string }> };

export async function GET(request: Request, { params }: TablesRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedError();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationError("Business ID is required.", { businessId: ["Required"] });
  const { locationId } = await params;

  try {
    const tables = await locationManagementService.listTables(session.userId, businessId, locationId, publicAppOrigin(request));
    return NextResponse.json({ success: true, data: tables });
  } catch (error) {
    return locationApiError(error, "TABLE_LIST_FAILED", "Unable to retrieve tables.");
  }
}

export async function POST(request: Request, { params }: TablesRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedError();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationError("Business ID is required.", { businessId: ["Required"] });
  const parsed = createTableSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError("Table details are invalid.", parsed.error.flatten());
  const { locationId } = await params;

  try {
    const table = await locationManagementService.createTable(session.userId, businessId, locationId, parsed.data, publicAppOrigin(request));
    return NextResponse.json({ success: true, data: table }, { status: 201 });
  } catch (error) {
    return locationApiError(error, "TABLE_CREATE_FAILED", "Unable to create this table.");
  }
}
