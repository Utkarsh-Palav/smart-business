import "server-only";

import { controlPrisma } from "@/lib/db/control";
import type { CreateBusinessRequest } from "@/lib/business/business.schemas";

const ONBOARDING_DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export class OnboardingError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "USER_NOT_FOUND"
      | "USER_INACTIVE"
      | "DRAFT_NOT_FOUND"
      | "DRAFT_EXPIRED"
      | "DRAFT_NOT_EDITABLE"
      | "PLAN_PRICE_UNAVAILABLE"
      | "DRAFT_UPDATE_CONFLICT",
    public readonly status: 400 | 403 | 404 | 409 | 410,
  ) {
    super(message);
    this.name = "OnboardingError";
  }
}

const onboardingDraftSelect = {
  id: true,
  businessName: true,
  businessSlug: true,
  businessType: true,
  legalName: true,
  gstin: true,
  firstLocationName: true,
  firstLocationSlug: true,
  operatingMode: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  phone: true,
  planPriceId: true,
  quotedAmountMinor: true,
  quotedCurrency: true,
  quotedInterval: true,
  quotedIntervalCount: true,
  quotedUnit: true,
  quotedPriceType: true,
  quotedAt: true,
  status: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
  planPrice: {
    select: {
      id: true,
      plan: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  },
} as const;

export async function createOnboardingDraft(
  userId: string,
  input: CreateBusinessRequest,
) {
  const user = await controlPrisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true },
  });

  if (!user) {
    throw new OnboardingError("User account could not be found.", "USER_NOT_FOUND", 404);
  }

  if (user.status !== "ACTIVE") {
    throw new OnboardingError("User account is not active.", "USER_INACTIVE", 403);
  }

  const now = new Date();

  return controlPrisma.businessOnboardingDraft.create({
    data: {
      userId,
      businessName: input.name,
      businessSlug: input.slug,
      businessType: input.businessType,
      legalName: input.legalName || null,
      gstin: input.gstin || null,
      firstLocationName: input.firstLocation.name,
      firstLocationSlug: input.firstLocation.slug,
      operatingMode: input.firstLocation.operatingMode,
      addressLine1: input.firstLocation.addressLine1,
      addressLine2: input.firstLocation.addressLine2 || null,
      city: input.firstLocation.city,
      state: input.firstLocation.state,
      postalCode: input.firstLocation.postalCode,
      phone: input.firstLocation.phone || null,
      expiresAt: new Date(now.getTime() + ONBOARDING_DRAFT_TTL_MS),
    },
    select: onboardingDraftSelect,
  });
}

export async function getOnboardingDraft(userId: string, draftId: string) {
  const draft = await controlPrisma.businessOnboardingDraft.findFirst({
    where: { id: draftId, userId },
    select: onboardingDraftSelect,
  });

  if (!draft) {
    throw new OnboardingError("Onboarding draft was not found.", "DRAFT_NOT_FOUND", 404);
  }

  if (
    draft.expiresAt <= new Date() &&
    ["DRAFT", "PENDING_PAYMENT"].includes(draft.status)
  ) {
    await controlPrisma.businessOnboardingDraft.updateMany({
      where: {
        id: draft.id,
        userId,
        status: { in: ["DRAFT", "PENDING_PAYMENT"] },
      },
      data: { status: "EXPIRED" },
    });

    throw new OnboardingError("Onboarding draft has expired.", "DRAFT_EXPIRED", 410);
  }

  return draft;
}

export async function selectOnboardingPlan(
  userId: string,
  draftId: string,
  planPriceId: string,
) {
  return controlPrisma.$transaction(async (transaction) => {
    const draft = await transaction.businessOnboardingDraft.findFirst({
      where: { id: draftId, userId },
      select: { id: true, status: true, expiresAt: true },
    });

    if (!draft) {
      throw new OnboardingError("Onboarding draft was not found.", "DRAFT_NOT_FOUND", 404);
    }

    if (draft.expiresAt <= new Date() && draft.status === "DRAFT") {
      await transaction.businessOnboardingDraft.updateMany({
        where: { id: draft.id, userId, status: "DRAFT" },
        data: { status: "EXPIRED" },
      });

      throw new OnboardingError("Onboarding draft has expired.", "DRAFT_EXPIRED", 410);
    }

    if (draft.status !== "DRAFT") {
      throw new OnboardingError(
        "A plan can only be selected for a draft onboarding.",
        "DRAFT_NOT_EDITABLE",
        409,
      );
    }

    const price = await transaction.planPrice.findFirst({
      where: {
        id: planPriceId,
        isActive: true,
        plan: { is: { isActive: true } },
      },
      select: {
        id: true,
        amountMinor: true,
        currency: true,
        interval: true,
        intervalCount: true,
        unit: true,
        priceType: true,
      },
    });

    if (!price) {
      throw new OnboardingError(
        "The selected plan price is unavailable.",
        "PLAN_PRICE_UNAVAILABLE",
        400,
      );
    }

    const updated = await transaction.businessOnboardingDraft.updateMany({
      where: {
        id: draft.id,
        userId,
        status: "DRAFT",
        expiresAt: { gt: new Date() },
      },
      data: {
        planPriceId: price.id,
        quotedAmountMinor: price.amountMinor,
        quotedCurrency: price.currency,
        quotedInterval: price.interval,
        quotedIntervalCount: price.intervalCount,
        quotedUnit: price.unit,
        quotedPriceType: price.priceType,
        quotedAt: new Date(),
      },
    });

    if (updated.count !== 1) {
      throw new OnboardingError(
        "Onboarding draft changed while selecting the plan. Reload the draft and try again.",
        "DRAFT_UPDATE_CONFLICT",
        409,
      );
    }

    return transaction.businessOnboardingDraft.findUniqueOrThrow({
      where: { id: draft.id },
      select: onboardingDraftSelect,
    });
  });
}