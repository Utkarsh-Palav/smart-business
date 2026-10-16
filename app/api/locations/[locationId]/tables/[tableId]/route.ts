import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { updateTableSchema } from "@/features/locations/schemas/location.schema";
import { locationManagementService } from "@/lib/location/location-management.service";
import {
  locationApiError,
  publicAppOrigin,
  unauthorizedError,
  validationError,
} from "@/lib/location/location-api";

type TableRouteContext = {
  params: Promise<{ locationId: string; tableId: string }>;
};

export async function PATCH(request: Request, { params }: TableRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedError();
  const businessId = new URL(request.url).searchParams
    .get("businessId")
    ?.trim();
  if (!businessId)
    return validationError("Business ID is required.", {
      businessId: ["Required"],
    });
  const parsed = updateTableSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return validationError(
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
    return NextResponse.json({ success: true, data: table });
  } catch (error) {
    return locationApiError(
      error,
      "TABLE_UPDATE_FAILED",
      "Unable to update this table.",
    );
  }
}
