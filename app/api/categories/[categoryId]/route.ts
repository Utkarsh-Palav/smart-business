import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { updateCategorySchema } from "@/features/menus/schemas/menu.schema";
import { handleApiError, successResponse, unauthorizedResponse, validationResponse } from "@/lib/api/responses";
import { menuManagementService } from "@/lib/menus/menu-management.service";

type CategoryRouteContext = { params: Promise<{ categoryId: string }> };

export async function PATCH(request: Request, { params }: CategoryRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const parsed = updateCategorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Category details are invalid.", parsed.error.flatten());
  try {
    const { categoryId } = await params;
    return successResponse(await menuManagementService.updateCategory(session.userId, businessId, categoryId, parsed.data));
  } catch (error) {
    return handleApiError(error, "CATEGORY_UPDATE_FAILED", "Unable to update this category.");
  }
}

export async function DELETE(request: Request, { params }: CategoryRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const menuId = new URL(request.url).searchParams.get("menuId")?.trim();
  if (!menuId) return validationResponse("Menu ID is required.", { menuId: ["Required"] });
  try {
    const { categoryId } = await params;
    return successResponse(await menuManagementService.removeCategoryFromMenu(session.userId, businessId, categoryId, menuId));
  } catch (error) {
    return handleApiError(error, "CATEGORY_REMOVE_FAILED", "Unable to remove this category from the menu.");
  }
}
