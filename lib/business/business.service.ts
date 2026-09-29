import "server-only";
import { CreateBusinessInput, CreateBusinessResult } from "./business.types";
import { BusinessError } from "./business.errors";
import { controlPrisma } from "../db/control";
import { Prisma } from "@/generated/control/client";

const OWNER_ROLE_SLUG = "owner";
const STARTER_PLAN_SLUG = "starter";

export class BusinessService {
  async createBusiness(
    input: CreateBusinessInput,
  ): Promise<CreateBusinessResult> {
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();
    const legalName = input.legalName?.trim() || null;
    const gstin = input.gstin?.trim().toUpperCase() || null;

    if (!input.userId || !name || !slug) {
      throw new BusinessError(
        "Business name and slug are required.",
        "INVALID_INPUT",
      );
    }

    try {
      const result = await controlPrisma.$transaction(async (tx) => {
        /**
         * 1. Verify the authenticated user exists.
         */
        const user = await tx.user.findUnique({
          where: {
            id: input.userId,
          },
          select: {
            id: true,
            status: true,
          },
        });

        if (!user) {
          throw new BusinessError(
            "User account could not be found.",
            "USER_NOT_FOUND",
          );
        }

        /**
         * 2. Resolve the system Owner role.
         */
        const ownerRole = await tx.role.findUnique({
          where: {
            slug: OWNER_ROLE_SLUG,
          },
          select: {
            id: true,
          },
        });

        if (!ownerRole) {
          throw new BusinessError(
            "Owner role is not configured.",
            "OWNER_ROLE_NOT_FOUND",
          );
        }

        /**
         * 3. Resolve the Starter plan.
         */
        const starterPlan = await tx.plan.findUnique({
          where: {
            slug: STARTER_PLAN_SLUG,
          },
          select: {
            id: true,
            isActive: true,
          },
        });

        if (!starterPlan || !starterPlan.isActive) {
          throw new BusinessError(
            "Starter plan is not configured.",
            "STARTER_PLAN_NOT_FOUND",
          );
        }

        /**
         * 4. Create the Business.
         */
        const business = await tx.business.create({
          data: {
            name,
            slug,
            legalName,
            businessType: input.businessType,
            gstin,
            status: "ACTIVE",
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        });

        const onboardingProfile = await tx.businessOnboardingProfile.create({
          data: {
            businessId: business.id,
            firstLocationName: input.firstLocation.name.trim(),
            firstLocationSlug: input.firstLocation.slug.trim().toLowerCase(),
            operatingMode: input.firstLocation.operatingMode,
            addressLine1: input.firstLocation.addressLine1.trim(),
            addressLine2: input.firstLocation.addressLine2?.trim() || null,
            city: input.firstLocation.city.trim(),
            state: input.firstLocation.state.trim(),
            postalCode: input.firstLocation.postalCode.trim(),
            phone: input.firstLocation.phone?.trim() || null,
          },
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
        });

        /**
         * 5. Create the Owner membership.
         */
        const membership = await tx.businessMembership.create({
          data: {
            userId: user.id,
            businessId: business.id,
            roleId: ownerRole.id,
            status: "ACTIVE",
          },
          select: {
            id: true,
          },
        });

        /**
         * 6. Create the initial subscription.
         */
        const subscription = await tx.subscription.create({
          data: {
            businessId: business.id,
            planId: starterPlan.id,
            status: "TRIAL",
            currentPeriodStart: new Date(),
          },
          select: {
            id: true,
          },
        });

        /**
         * 7. Record the subscription event.
         */
        await tx.subscriptionEvent.create({
          data: {
            subscriptionId: subscription.id,
            type: "CREATED",
            metadata: {
              source: "BUSINESS_CREATION",
            },
          },
        });

        /*
         * 8. Create the tenant database lifecycle record.
         *
         * The actual Neon database is NOT created here.
         * External provisioning happens after this transaction commits.
         */
        const tenantKey = this.generateTenantKey(business.id);

        const tenantDatabase = await tx.tenantDatabase.create({
          data: {
            businessId: business.id,
            tenantKey,
            provider: "NEON",
            databaseName: tenantKey,
            databaseHost: null,
            status: "PROVISIONING",
          },
          select: {
            id: true,
            tenantKey: true,
            status: true,
          },
        });

        return {
          business,
          onboardingProfile,
          membership,
          subscription,
          tenantDatabase,
        };
      });

      return {
        businessId: result.business.id,
        businessName: result.business.name,
        businessSlug: result.business.slug,
        firstLocation: {
          name: result.onboardingProfile.firstLocationName,
          slug: result.onboardingProfile.firstLocationSlug,
          operatingMode: result.onboardingProfile.operatingMode,
          addressLine1: result.onboardingProfile.addressLine1,
          addressLine2: result.onboardingProfile.addressLine2 ?? undefined,
          city: result.onboardingProfile.city,
          state: result.onboardingProfile.state,
          postalCode: result.onboardingProfile.postalCode,
          country: result.onboardingProfile.country,
          phone: result.onboardingProfile.phone ?? undefined,
        },
        membershipId: result.membership.id,
        tenantDatabaseId: result.tenantDatabase.id,
        tenantKey: result.tenantDatabase.tenantKey,
        tenantDatabaseStatus: "PROVISIONING",
        subscriptionId: result.subscription.id,
        subscriptionStatus: "TRIAL",
      };
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BusinessError(
          "A business with this slug already exists.",
          "BUSINESS_SLUG_EXISTS",
          {
            cause: error,
          },
        );
      }

      throw new BusinessError(
        "Unable to create business.",
        "BUSINESS_CREATION_FAILED",
        {
          cause: error,
        },
      );
    }
  }

  private generateTenantKey(businessId: string): string {
    return `tenant-${businessId}`;
  }
}

export const businessService = new BusinessService();
