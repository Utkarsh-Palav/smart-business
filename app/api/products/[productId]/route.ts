import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { updateProductSchema } from "@/features/menus/schemas/menu.schema";
import { handleApiError, successResponse, unauthorizedResponse, validationResponse } from "@/lib/api/responses";
import { menuManagementService } from "@/lib/menus/menu-management.service";

type ProductRouteContext = { params: Promise<{ productId: string }> };

export async function PATCH(request: Request, { params }: ProductRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const businessId = new URL(request.url).searchParams.get("businessId")?.trim();
  if (!businessId) return validationResponse("Business ID is required.", { businessId: ["Required"] });
  const parsed = updateProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Product details are invalid.", parsed.error.flatten());
  try {
    const { productId } = await params;
    return successResponse(await menuManagementService.updateProduct(session.userId, businessId, productId, parsed.data));
  } catch (error) {
    return handleApiError(error, "PRODUCT_UPDATE_FAILED", "Unable to update this product.");
  }
}
