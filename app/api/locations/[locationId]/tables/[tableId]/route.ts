import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { updateTableSchema } from "@/features/locations/schemas/location.schema";
import { locationManagementService } from "@/lib/location/location-management.service";
import {
  handleApiError,
  publicAppOrigin,
  successResponse,
  unauthorizedResponse,
  validationResponse,
} from "@/lib/api/responses";


type TableRouteContext = {
  params: Promise<{ locationId: string; tableId: string }>;
};

export async function PATCH(request: Request, { params }: TableRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams
    .get("businessId")
    ?.trim();
  if (!businessId)
    return validationResponse("Business ID is required.", {
      businessId: ["Required"],
    });
  const parsed = updateTableSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return validationResponse(
      "Table details are invalid.",
      parsed.error.flatten(),
    );
  const { locationId, tableId } = await params;

  try {
    const table = await locationManagementService.updateTable(
      session.userId,
      businessId,
      locationId,
      tableId,
      parsed.data,
      publicAppOrigin(request),
    );
    return successResponse(table);
  } catch (error) {
    return handleApiError(
      error,
      "TABLE_UPDATE_FAILED",
      "Unable to update this table.",
    );
  }
}
