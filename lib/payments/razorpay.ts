import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

type RazorpayOrderResponse = {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
};

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay test credentials are not configured");
  }

  return { keyId, keySecret };
}

export async function createRazorpayOrder(input: {
  amountMinor: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
  const { keyId, keySecret } = getRazorpayCredentials();
  const response = await fetch(RAZORPAY_ORDERS_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountMinor,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    }),
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Razorpay order creation failed with status ${response.status}`);
  }

  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { id?: unknown }).id !== "string"
  ) {
    throw new Error("Razorpay returned an invalid order response");
  }

  return body as RazorpayOrderResponse;
}

export function getRazorpayKeyId(): string {
  return getRazorpayCredentials().keyId;
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return false;
  }

  const expected = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}