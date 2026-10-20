import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createTableSchema } from "@/features/locations/schemas/location.schema";
import { locationManagementService } from "@/lib/location/location-management.service";
import {
  handleApiError,
  publicAppOrigin,
  successResponse,
  unauthorizedResponse,
  validationResponse,
} from "@/lib/api/responses";

type TablesRouteContext = { params: Promise<{ locationId: string }> };

export async function GET(request: Request, { params }: TablesRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const { locationId } = await params;

  try {
    const tables = await locationManagementService.listTables(session.userId, businessId, locationId, publicAppOrigin(request));
    return successResponse(tables);
  } catch (error) {
    return handleApiError(error, "TABLE_LIST_FAILED", "Unable to retrieve tables.");
  }
}

export async function POST(request: Request, { params }: TablesRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const parsed = createTableSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Table details are invalid.", parsed.error.flatten());
  const { locationId } = await params;

  try {
    const table = await locationManagementService.createTable(session.userId, businessId, locationId, parsed.data, publicAppOrigin(request));
    return successResponse(table, 201);
  } catch (error) {
    return handleApiError(error, "TABLE_CREATE_FAILED", "Unable to create this table.");
  }
}
