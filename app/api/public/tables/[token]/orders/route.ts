import { createPublicOrderSchema } from "@/features/orders/schemas/order.schema";
import { handleApiError, successResponse, validationResponse } from "@/lib/api/responses";
import { encodePublicOrderAccess, publicOrderCookieName } from "@/lib/orders/public-order-access";
import { orderService } from "@/lib/orders/order.service";

type PublicOrderRouteContext = { params: Promise<{ token: string }> };

async function readBoundedJson(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new Error("BODY_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: Request, { params }: PublicOrderRouteContext) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) return validationResponse("Order request is too large.");
  let body: unknown;
  try {
    body = await readBoundedJson(request, 16_384);
  } catch {
    return validationResponse("Order request is too large.");
  }
  const parsed = createPublicOrderSchema.safeParse(body);
  if (!parsed.success) return validationResponse("Order details are invalid.", parsed.error.flatten());
  try {
    const { token } = await params;
    const order = await orderService.createPublicTableOrder(token, parsed.data);
    const response = successResponse(order, "duplicate" in order && order.duplicate ? 200 : 201);
    response.cookies.set(
      publicOrderCookieName(token),
      encodePublicOrderAccess({ orderNumber: order.orderNumber, accessKey: parsed.data.idempotencyKey }),
      {
        httpOnly: true,
        secure: new URL(request.url).protocol === "https:",
        sameSite: "lax",
        path: `/api/public/tables/${encodeURIComponent(token)}/orders`,
        maxAge: 60 * 60 * 24 * 30,
      },
    );
    return response;
  } catch (error) {
    return handleApiError(error, "ORDER_CREATE_FAILED", "Unable to place this order.");
  }
}
