import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import {
  handleApiError,
  unauthorizedResponse,
  validationResponse,
  successResponse,
} from "@/lib/api/responses";
import { menuManagementService } from "@/lib/menus/menu-management.service";
import { createMenuSchema } from "@/features/menus/schemas/menu.schema";

type MenusRouteContext = { params: Promise<{ locationId: string }> };

export async function GET(request: Request, { params }: MenusRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();

  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) {
    return validationResponse("Business ID is required.", {
      businessId: ["Required"],
    });
  }

  try {
    const { locationId } = await params;
    const menus = await menuManagementService.listMenus(session.userId, businessId, locationId);
    return successResponse(menus);
  } catch (error) {
    return handleApiError(error, "MENU_LIST_FAILED", "Unable to retrieve menus.");
  }
}

export async function POST(request: Request, { params }: MenusRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();

  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) {
    return validationResponse("Business ID is required.", { businessId: ["Required"] });
  }

  const parsed = createMenuSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Menu details are invalid.", parsed.error.flatten());

  try {
    const { locationId } = await params;
    const menu = await menuManagementService.createMenu(session.userId, businessId, locationId, parsed.data);
    return successResponse(menu, 201);
  } catch (error) {
    return handleApiError(error, "MENU_CREATE_FAILED", "Unable to create this menu.");
  }
}
