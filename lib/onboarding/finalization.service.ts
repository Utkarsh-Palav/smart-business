import "server-only";

import { Prisma } from "@/generated/control/client";
import { controlPrisma } from "@/lib/db/control";

import { OnboardingError } from "./onboarding.service";

const OWNER_ROLE_SLUG = "owner";

type FinalizedBusiness = {
  businessId: string;
  businessName: string;
  businessSlug: string;
  tenantDatabaseId: string;
  tenantKey: string;
  subscriptionId: string;
  subscriptionStatus: "ACTIVE";
  firstLocation: {
    name: string;
    slug: string;
    operatingMode: "DINE_IN" | "TAKEAWAY" | "DELIVERY_ONLY" | "HYBRID" | "OTHER";
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
};

export async function finalizePaidOnboarding(
  userId: string,
  draftId: string,
): Promise<FinalizedBusiness> {
  try {
    return await controlPrisma.$transaction(async (transaction) => {
      const draft = await transaction.businessOnboardingDraft.findFirst({
        where: { id: draftId, userId },
        select: {
          id: true,
          businessId: true,
          status: true,
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
          planPrice: {
            select: {
              planId: true,
              interval: true,
              intervalCount: true,
            },
          },
          paymentAttempts: {
            where: { status: "CAPTURED" },
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: { orderId: true, paymentId: true },
          },
        },
      });

      if (!draft) {
        throw new OnboardingError("Onboarding draft was not found.", "DRAFT_NOT_FOUND", 404);
      }

      if (draft.businessId && ["PROVISIONING", "PROVISIONING_FAILED", "COMPLETED"].includes(draft.status)) {
        const existing = await transaction.business.findUnique({
          where: { id: draft.businessId },
          select: {
            id: true,
            name: true,
            slug: true,
            tenantDatabase: {
              select: { id: true, tenantKey: true },
            },
            onboardingProfile: {
              select: {
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
              },
            },
            subscriptions: {
              where: { status: { in: ["ACTIVE", "TRIAL"] } },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { id: true, status: true },
            },
          },
        });

        if (!existing?.tenantDatabase || !existing.onboardingProfile || !existing.subscriptions[0]) {
          throw new OnboardingError(
            "Finalized business state is incomplete.",
            "DRAFT_UPDATE_CONFLICT",
            409,
          );
        }

        return {
          businessId: existing.id,
          businessName: existing.name,
          businessSlug: existing.slug,
          tenantDatabaseId: existing.tenantDatabase.id,
          tenantKey: existing.tenantDatabase.tenantKey,
          subscriptionId: existing.subscriptions[0].id,
          subscriptionStatus: "ACTIVE",
          firstLocation: toFirstLocation(existing.onboardingProfile),
        };
      }

      if (draft.status !== "PAID" || !draft.planPrice) {
        throw new OnboardingError(
          "Payment confirmation is required before business activation.",
          "DRAFT_NOT_EDITABLE",
          409,
        );
      }

      const claimed = await transaction.businessOnboardingDraft.updateMany({
        where: { id: draft.id, userId, status: "PAID", businessId: null },
        data: { status: "PROVISIONING" },
      });

      if (claimed.count !== 1) {
        throw new OnboardingError(
          "Onboarding finalization is already in progress.",
          "DRAFT_UPDATE_CONFLICT",
          409,
        );
      }

      const user = await transaction.user.findUnique({
        where: { id: userId },
        select: { id: true, status: true },
      });
      const ownerRole = await transaction.role.findUnique({
        where: { slug: OWNER_ROLE_SLUG },
        select: { id: true },
      });

      if (!user || user.status !== "ACTIVE") {
        throw new OnboardingError("User account is not active.", "USER_INACTIVE", 403);
      }

      if (!ownerRole) {
        throw new OnboardingError("Owner role is not configured.", "DRAFT_UPDATE_CONFLICT", 409);
      }

      const now = new Date();
      const currentPeriodEnd = addBillingInterval(
        now,
        draft.planPrice.interval,
        draft.planPrice.intervalCount,
      );
      const business = await transaction.business.create({
        data: {
          name: draft.businessName,
          slug: draft.businessSlug,
          legalName: draft.legalName,
          businessType: draft.businessType,
          gstin: draft.gstin,
          status: "ACTIVE",
        },
        select: { id: true, name: true, slug: true },
      });

      await transaction.businessOnboardingProfile.create({
        data: {
          businessId: business.id,
          firstLocationName: draft.firstLocationName,
          firstLocationSlug: draft.firstLocationSlug,
          operatingMode: draft.operatingMode,
          addressLine1: draft.addressLine1,
          addressLine2: draft.addressLine2,
          city: draft.city,
          state: draft.state,
          postalCode: draft.postalCode,
          country: draft.country,
          phone: draft.phone,
        },
      });

      await transaction.businessMembership.create({
        data: {
          userId,
          businessId: business.id,
          roleId: ownerRole.id,
          status: "ACTIVE",
        },
      });

      const subscription = await transaction.subscription.create({
        data: {
          businessId: business.id,
          planId: draft.planPrice.planId,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd,
        },
        select: { id: true },
      });

      await transaction.subscriptionEvent.create({
        data: {
          subscriptionId: subscription.id,
          type: "ACTIVATED",
          metadata: {
            source: "RAZORPAY_ONBOARDING",
            draftId: draft.id,
            razorpayOrderId: draft.paymentAttempts[0]?.orderId,
            razorpayPaymentId: draft.paymentAttempts[0]?.paymentId,
          },
        },
      });

      const tenantKey = `tenant-${business.id}`;
      const tenantDatabase = await transaction.tenantDatabase.create({
        data: {
          businessId: business.id,
          tenantKey,
          provider: "NEON",
          databaseName: tenantKey,
          status: "PROVISIONING",
        },
        select: { id: true, tenantKey: true },
      });

      return {
        businessId: business.id,
        businessName: business.name,
        businessSlug: business.slug,
        tenantDatabaseId: tenantDatabase.id,
        tenantKey: tenantDatabase.tenantKey,
        subscriptionId: subscription.id,
        subscriptionStatus: "ACTIVE" as const,
        firstLocation: {
          name: draft.firstLocationName,
          slug: draft.firstLocationSlug,
          operatingMode: draft.operatingMode,
          addressLine1: draft.addressLine1,
          addressLine2: draft.addressLine2 ?? undefined,
          city: draft.city,
          state: draft.state,
          postalCode: draft.postalCode,
          country: draft.country,
          phone: draft.phone ?? undefined,
        },
      };
    });
  } catch (error) {
    if (error instanceof OnboardingError) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new OnboardingError(
        "A business with this slug already exists.",
        "DRAFT_UPDATE_CONFLICT",
        409,
      );
    }

    throw error;
  }
}

function addBillingInterval(
  start: Date,
  interval: "MONTH" | "YEAR",
  intervalCount: number,
): Date {
  const end = new Date(start);

  if (interval === "YEAR") {
    end.setUTCFullYear(end.getUTCFullYear() + intervalCount);
  } else {
    end.setUTCMonth(end.getUTCMonth() + intervalCount);
  }

  return end;
}

function toFirstLocation(profile: {
  firstLocationName: string;
  firstLocationSlug: string;
  operatingMode: "DINE_IN" | "TAKEAWAY" | "DELIVERY_ONLY" | "HYBRID" | "OTHER";
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
}) {
  return {
    name: profile.firstLocationName,
    slug: profile.firstLocationSlug,
    operatingMode: profile.operatingMode,
    addressLine1: profile.addressLine1,
    addressLine2: profile.addressLine2 ?? undefined,
    city: profile.city,
    state: profile.state,
    postalCode: profile.postalCode,
    country: profile.country,
    phone: profile.phone ?? undefined,
  };
}