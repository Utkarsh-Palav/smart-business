import { handleApiError, successResponse, validationResponse } from "@/lib/api/responses";
import { orderService } from "@/lib/orders/order.service";

type PublicOrderRouteContext = {
  params: Promise<{ token: string; orderNumber: string }>;
};

export async function GET(request: Request, { params }: PublicOrderRouteContext) {
  const accessKey = request.headers.get("x-order-access-key") ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(accessKey)) {
    return validationResponse("A valid order access key is required.");
  }

  try {
    const { token, orderNumber } = await params;
    const order = await orderService.getPublicTableOrder(token, orderNumber, accessKey);
    const response = successResponse(order);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const response = handleApiError(error, "ORDER_LOOKUP_FAILED", "Unable to load this order.");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
