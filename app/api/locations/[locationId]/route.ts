import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { updateLocationSchema } from "@/features/locations/schemas/location.schema";
import { locationManagementService } from "@/lib/location/location-management.service";
import { locationApiError, unauthorizedError, validationError } from "@/lib/location/location-api";

type LocationRouteContext = { params: Promise<{ locationId: string }> };

export async function PATCH(request: Request, { params }: LocationRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedError();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationError("Business ID is required.", { businessId: ["Required"] });
  const parsed = updateLocationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError("Location details are invalid.", parsed.error.flatten());
  const { locationId } = await params;

  try {
    const location = await locationManagementService.updateLocation(session.userId, businessId, locationId, parsed.data);
    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    return locationApiError(error, "LOCATION_UPDATE_FAILED", "Unable to update this location.");
  }
}
