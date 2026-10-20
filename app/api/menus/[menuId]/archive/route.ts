import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { handleApiError, successResponse, unauthorizedResponse, validationResponse } from "@/lib/api/responses";
import { menuManagementService } from "@/lib/menus/menu-management.service";

type MenuActionContext = { params: Promise<{ menuId: string }> };

export async function POST(request: Request, { params }: MenuActionContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  try {
    const { menuId } = await params;
    return successResponse(await menuManagementService.archiveMenu(session.userId, businessId, menuId));
  } catch (error) {
    return handleApiError(error, "MENU_ARCHIVE_FAILED", "Unable to archive this menu.");
  }
}
