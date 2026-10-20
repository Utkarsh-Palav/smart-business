import { z } from "zod";
import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { handleApiError, successResponse, unauthorizedResponse, validationResponse } from "@/lib/api/responses";
import { orderService } from "@/lib/orders/order.service";

const orderStatusSchema = z.enum(["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELED"]);

export async function GET(request: Request) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorizedResponse();
  const search = new URL(request.url).searchParams;
  const businessId = search.get("businessId")?.trim();
  const locationId = search.get("locationId")?.trim();
  const rawStatus = search.get("status")?.trim();
  if (!businessId || !locationId) return validationResponse("Business ID and location ID are required.");
  const status = rawStatus ? orderStatusSchema.safeParse(rawStatus) : undefined;
  if (rawStatus && !status?.success) return validationResponse("Order status is invalid.", { status: ["Unsupported status"] });
  try {
    const orders = await orderService.listOrders(session.userId, businessId, locationId, status?.success ? status.data : undefined);
    return successResponse(orders);
  } catch (error) {
    return handleApiError(error, "ORDERS_LIST_FAILED", "Unable to retrieve orders.");
  }
}
