import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createLocationSchema } from "@/features/locations/schemas/location.schema";
import { locationManagementService } from "@/lib/location/location-management.service";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
  validationResponse,
} from "@/lib/api/responses";

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });

  try {
    const locations = await locationManagementService.listLocations(session.userId, businessId);
    return successResponse(locations);
  } catch (error) {
    return handleApiError(error, "LOCATION_LIST_FAILED", "Unable to retrieve locations.");
  }
}

export async function POST(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const parsed = createLocationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Location details are invalid.", parsed.error.flatten());

  try {
    const location = await locationManagementService.createLocation(session.userId, parsed.data);
    return successResponse(location, 201);
  } catch (error) {
    return handleApiError(error, "LOCATION_CREATE_FAILED", "Unable to create this location.");
  }
}
