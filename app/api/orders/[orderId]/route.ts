import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { updateOrderStatusSchema } from "@/features/orders/schemas/order.schema";
import { handleApiError, successResponse, unauthorizedResponse, validationResponse } from "@/lib/api/responses";
import { orderService } from "@/lib/orders/order.service";

type OrderRouteContext = { params: Promise<{ orderId: string }> };

export async function PATCH(request: Request, { params }: OrderRouteContext) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const search = new URL(request.url).searchParams;
  const businessId = search.get("businessId")?.trim();
  const locationId = search.get("locationId")?.trim();
  if (!businessId || !locationId) return validationResponse("Business ID and location ID are required.");
  const parsed = updateOrderStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationResponse("Order status is invalid.", parsed.error.flatten());
  try {
    const { orderId } = await params;
    return successResponse(await orderService.updateOrderStatus(session.userId, businessId, locationId, orderId, parsed.data));
  } catch (error) {
    return handleApiError(error, "ORDER_UPDATE_FAILED", "Unable to update this order.");
  }
}
