import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { createCategorySchema } from "@/features/menus/schemas/menu.schema";
import { handleApiError, successResponse, unauthorizedResponse, validationResponse } from "@/lib/api/responses";
import { menuManagementService } from "@/lib/menus/menu-management.service";

type MenuRouteContext = { params: Promise<{ menuId: string }> };

export async function GET(request: Request, { params }: MenuRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  try {
    const { menuId } = await params;
    return successResponse(await menuManagementService.listCategories(session.userId, businessId, menuId));
  } catch (error) {
    return handleApiError(error, "CATEGORY_LIST_FAILED", "Unable to retrieve categories.");
  }
}

export async function POST(request: Request, { params }: MenuRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const parsed = createCategorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Category details are invalid.", parsed.error.flatten());
  try {
    const { menuId } = await params;
    return successResponse(await menuManagementService.createCategory(session.userId, businessId, menuId, parsed.data), 201);
  } catch (error) {
    return handleApiError(error, "CATEGORY_CREATE_FAILED", "Unable to create this category.");
  }
}
