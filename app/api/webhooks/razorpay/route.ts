import { NextResponse } from "next/server";

import { controlPrisma } from "@/lib/db/control";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const eventId = request.headers.get("x-razorpay-event-id") ?? "";

  if (!eventId || !verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { success: false, error: "Invalid webhook signature." },
      { status: 401 },
    );
  }

  let body: RazorpayWebhookPayload;

  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid webhook payload." },
      { status: 400 },
    );
  }

  const eventType = body.event ?? "unknown";

  try {
    await controlPrisma.razorpayWebhookEvent.create({
      data: {
        eventId,
        eventType,
        payload: body as object,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ success: true, duplicate: true }, { status: 200 });
    }

    console.error("Razorpay webhook persistence failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  try {
    const paymentEntity = body.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id ?? body.payload?.order?.entity?.id;
    const paymentId = paymentEntity?.id;

    if (!orderId) {
      await markWebhookEvent(eventId, "IGNORED");
      return NextResponse.json({ success: true, ignored: true }, { status: 200 });
    }

    const status =
      eventType === "payment.captured" || eventType === "order.paid"
        ? "CAPTURED"
        : eventType === "payment.authorized"
          ? "AUTHORIZED"
          : eventType === "payment.failed"
            ? "FAILED"
            : null;

    if (!status) {
      await markWebhookEvent(eventId, "IGNORED");
      return NextResponse.json({ success: true, ignored: true }, { status: 200 });
    }

    await controlPrisma.$transaction(async (transaction) => {
      const attempt = await transaction.businessOnboardingPaymentAttempt.findUnique({
        where: { orderId },
        select: { id: true, draftId: true, status: true },
      });

      if (!attempt) {
        throw new Error(`Onboarding payment order was not found: ${orderId}`);
      }

      if (attempt.status !== "CAPTURED") {
        await transaction.businessOnboardingPaymentAttempt.update({
          where: { id: attempt.id },
          data: {
            status,
            ...(paymentId ? { paymentId } : {}),
          },
        });
      }

      if (attempt.status !== "CAPTURED") {
        await transaction.businessOnboardingDraft.update({
          where: { id: attempt.draftId },
          data: {
            status:
              status === "CAPTURED"
                ? "PAID"
                : status === "FAILED"
                  ? "PAYMENT_FAILED"
                  : "PENDING_PAYMENT",
          },
        });
      }

      await transaction.razorpayWebhookEvent.update({
        where: { eventId },
        data: { status: "PROCESSED", processedAt: new Date() },
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Razorpay webhook processing failed:", error);
    await markWebhookEvent(eventId, "FAILED", "Webhook processing failed");
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

async function markWebhookEvent(
  eventId: string,
  status: "PROCESSED" | "IGNORED" | "FAILED",
  error?: string,
) {
  await controlPrisma.razorpayWebhookEvent.updateMany({
    where: { eventId },
    data: {
      status,
      ...(error ? { error } : {}),
      ...(status === "PROCESSED" ? { processedAt: new Date() } : {}),
    },
  });
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}