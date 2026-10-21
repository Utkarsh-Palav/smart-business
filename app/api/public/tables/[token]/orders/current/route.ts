import { errorResponse, handleApiError, successResponse } from "@/lib/api/responses";
import {
  decodePublicOrderAccess,
  publicOrderCookieName,
  readRequestCookie,
} from "@/lib/orders/public-order-access";
import { orderService } from "@/lib/orders/order.service";

type CurrentOrderRouteContext = { params: Promise<{ token: string }> };

export async function GET(request: Request, { params }: CurrentOrderRouteContext) {
  const { token } = await params;
  const accesses = decodePublicOrderAccess(
    readRequestCookie(request, publicOrderCookieName(token)),
  );
  if (!accesses.length) {
    const response = errorResponse("ORDER_NOT_FOUND", "No saved orders were found on this device.", 404);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  try {
    const orders = await orderService.getPublicTableOrders(token, accesses);
    const response = orders.length
      ? successResponse({ orders })
      : errorResponse("ORDER_NOT_FOUND", "No saved orders were found on this device.", 404);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const response = handleApiError(error, "ORDER_LOOKUP_FAILED", "Unable to load this order.");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
