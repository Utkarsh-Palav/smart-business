import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createLocationSchema } from "@/features/locations/schemas/location.schema";
import { locationManagementService } from "@/lib/location/location-management.service";
import { locationApiError, unauthorizedError, validationError } from "@/lib/location/location-api";

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedError();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationError("Business ID is required.", { businessId: ["Required"] });

  try {
    const locations = await locationManagementService.listLocations(session.userId, businessId);
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    return locationApiError(error, "LOCATION_LIST_FAILED", "Unable to retrieve locations.");
  }
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedError();
  const parsed = createLocationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError("Location details are invalid.", parsed.error.flatten());

  try {
    const location = await locationManagementService.createLocation(session.userId, parsed.data);
    return NextResponse.json({ success: true, data: location }, { status: 201 });
  } catch (error) {
    return locationApiError(error, "LOCATION_CREATE_FAILED", "Unable to create this location.");
  }
}
