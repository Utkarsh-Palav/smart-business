import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { updateMenuSchema } from "@/features/menus/schemas/menu.schema";
import { handleApiError, successResponse, unauthorizedResponse, validationResponse } from "@/lib/api/responses";
import { menuManagementService } from "@/lib/menus/menu-management.service";

type MenuRouteContext = { params: Promise<{ menuId: string }> };

function businessIdFrom(request: Request) {
  return new URL(request.url).searchParams.get("businessId")?.trim();
}

export async function GET(request: Request, { params }: MenuRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = businessIdFrom(request);
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const locationId = new URL(request.url).searchParams.get("locationId")?.trim();
  if (!locationId) return validationResponse("Location ID is required.", { locationId: ["Required"] });
  try {
    const { menuId } = await params;
    const menu = await menuManagementService.getMenu(session.userId, businessId, menuId, locationId);
    return successResponse(menu);
  } catch (error) {
    return handleApiError(error, "MENU_GET_FAILED", "Unable to retrieve this menu.");
  }
}

export async function PATCH(request: Request, { params }: MenuRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = businessIdFrom(request);
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const parsed = updateMenuSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Menu details are invalid.", parsed.error.flatten());
  try {
    const { menuId } = await params;
    return successResponse(await menuManagementService.updateMenu(session.userId, businessId, menuId, parsed.data));
  } catch (error) {
    return handleApiError(error, "MENU_UPDATE_FAILED", "Unable to update this menu.");
  }
}
