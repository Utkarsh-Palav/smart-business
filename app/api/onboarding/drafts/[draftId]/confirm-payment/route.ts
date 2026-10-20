import { z } from "zod";

import { getAuthenticatedSession } from "@/lib/auth/session/get-authenticated-session";
import { controlPrisma } from "@/lib/db/control";
import {
  getRazorpayPayment,
  verifyRazorpayPaymentSignature,
} from "@/lib/payments/razorpay";
import {
  errorResponse,
  handleApiError,
  successResponse,
  unauthorizedResponse,
  validationResponse,
} from "@/lib/api/responses";

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
    return unauthorizedResponse();
  }

  const parsed = confirmationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return validationResponse("Payment confirmation is incomplete.", parsed.error.flatten());
  }

  try {
    const { draftId } = await params;
    const attempt = await controlPrisma.businessOnboardingPaymentAttempt.findFirst({
      where: {
        draftId,
        orderId: parsed.data.razorpayOrderId,
        draft: { userId: session.userId },
      },
      select: { id: true, orderId: true },
    });

    if (
      !attempt ||
      !verifyRazorpayPaymentSignature({
        orderId: attempt.orderId,
        paymentId: parsed.data.razorpayPaymentId,
        signature: parsed.data.razorpaySignature,
      })
    ) {
      return errorResponse(
        "INVALID_PAYMENT_SIGNATURE",
        "Payment confirmation could not be verified.",
        400,
      );
    }

    const payment = await getRazorpayPayment(parsed.data.razorpayPaymentId);
    if (payment.order_id !== attempt.orderId || payment.status !== "captured") {
      return errorResponse(
        "PAYMENT_NOT_CAPTURED",
        "Payment has not been captured yet.",
        409,
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

    return successResponse({ confirmed: true });
  } catch (error) {
    return handleApiError(
      error,
      "PAYMENT_CONFIRMATION_FAILED",
      "Unable to confirm payment.",
    );
  }
}
