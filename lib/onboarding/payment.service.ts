import "server-only";

import { controlPrisma } from "@/lib/db/control";
import {
  createRazorpayOrder,
  getRazorpayKeyId,
} from "@/lib/payments/razorpay";

import { OnboardingError } from "./onboarding.service";

export async function createOnboardingCheckout(
  userId: string,
  draftId: string,
) {
  const draft = await controlPrisma.businessOnboardingDraft.findFirst({
    where: { id: draftId, userId },
    select: {
      id: true,
      businessName: true,
      status: true,
      expiresAt: true,
      quotedAmountMinor: true,
      quotedCurrency: true,
      planPriceId: true,
      paymentAttempts: {
        where: { status: "CREATED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          orderId: true,
          amountMinor: true,
          currency: true,
          status: true,
        },
      },
    },
  });

  if (!draft) {
    throw new OnboardingError("Onboarding draft was not found.", "DRAFT_NOT_FOUND", 404);
  }

  if (draft.expiresAt <= new Date()) {
    throw new OnboardingError("Onboarding draft has expired.", "DRAFT_EXPIRED", 410);
  }

  if (draft.status !== "DRAFT" && draft.status !== "PENDING_PAYMENT") {
    throw new OnboardingError(
      "This onboarding draft is not ready for checkout.",
      "DRAFT_NOT_EDITABLE",
      409,
    );
  }

  if (!draft.planPriceId || !draft.quotedAmountMinor || !draft.quotedCurrency) {
    throw new OnboardingError(
      "Select a plan before starting checkout.",
      "PLAN_PRICE_UNAVAILABLE",
      400,
    );
  }

  const existingAttempt = draft.paymentAttempts[0];

  if (existingAttempt) {
    return {
      keyId: getRazorpayKeyId(),
      draftId: draft.id,
      orderId: existingAttempt.orderId,
      amountMinor: existingAttempt.amountMinor,
      currency: existingAttempt.currency,
      status: existingAttempt.status,
    };
  }

  const order = await createRazorpayOrder({
    amountMinor: draft.quotedAmountMinor,
    currency: draft.quotedCurrency,
    receipt: `sb_${draft.id}`.slice(0, 40),
    notes: {
      onboardingDraftId: draft.id,
      businessName: draft.businessName.slice(0, 200),
    },
  });

  const attempt = await controlPrisma.$transaction(async (transaction) => {
    const current = await transaction.businessOnboardingDraft.findFirst({
      where: { id: draft.id, userId, status: { in: ["DRAFT", "PENDING_PAYMENT"] } },
      select: { id: true },
    });

    if (!current) {
      throw new OnboardingError(
        "Onboarding draft changed before checkout.",
        "DRAFT_UPDATE_CONFLICT",
        409,
      );
    }

    const created = await transaction.businessOnboardingPaymentAttempt.create({
      data: {
        draftId: draft.id,
        orderId: order.id,
        amountMinor: order.amount,
        currency: order.currency,
        status: "CREATED",
      },
      select: {
        orderId: true,
        amountMinor: true,
        currency: true,
        status: true,
      },
    });

    await transaction.businessOnboardingDraft.update({
      where: { id: draft.id },
      data: { status: "PENDING_PAYMENT" },
    });

    return created;
  });

  return {
    keyId: getRazorpayKeyId(),
    draftId: draft.id,
    orderId: attempt.orderId,
    amountMinor: attempt.amountMinor,
    currency: attempt.currency,
    status: attempt.status,
  };
}