import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { controlPrisma } from "@/lib/db/control";
import {
  getRazorpayPayment,
  verifyRazorpayPaymentSignature,
} from "@/lib/payments/razorpay";

const confirmationSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const session = await getAuthenticatedSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication is required." } },
      { status: 401 },
    );
  }

  const parsed = confirmationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Payment confirmation is incomplete." } },
      { status: 400 },
    );
  }

  const { draftId } = await params;
  const attempt = await controlPrisma.businessOnboardingPaymentAttempt.findFirst({
    where: { draftId, orderId: parsed.data.razorpayOrderId, draft: { userId: session.userId } },
    select: { id: true, orderId: true },
  });

  if (!attempt || !verifyRazorpayPaymentSignature({
    orderId: attempt.orderId,
    paymentId: parsed.data.razorpayPaymentId,
    signature: parsed.data.razorpaySignature,
  })) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_PAYMENT_SIGNATURE", message: "Payment confirmation could not be verified." } },
      { status: 400 },
    );
  }

  const payment = await getRazorpayPayment(parsed.data.razorpayPaymentId);
  if (payment.order_id !== attempt.orderId || payment.status !== "captured") {
    return NextResponse.json(
      { success: false, error: { code: "PAYMENT_NOT_CAPTURED", message: "Payment has not been captured yet." } },
      { status: 409 },
    );
  }

  await controlPrisma.$transaction(async (transaction) => {
    await transaction.businessOnboardingPaymentAttempt.update({
      where: { id: attempt.id },
      data: { paymentId: payment.id, status: "CAPTURED" },
    });
    await transaction.businessOnboardingDraft.update({
      where: { id: draftId },
      data: { status: "PAID" },
    });
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
