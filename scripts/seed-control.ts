import "dotenv/config";

import { PrismaClient } from "@/generated/control/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.CONTROL_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("CONTROL_DATABASE_URL is not configured");
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Control DB...");

  /*
   * ------------------------------------------------------------
   * OWNER ROLE
   * ------------------------------------------------------------
   */

  const ownerRole = await prisma.role.upsert({
    where: {
      slug: "owner",
    },
    update: {
      name: "Owner",
      description: "Full access to the business.",
      isSystem: true,
    },
    create: {
      name: "Owner",
      slug: "owner",
      description: "Full access to the business.",
      isSystem: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  console.log(
    `✓ Role: ${ownerRole.name} (${ownerRole.slug})`,
  );

  const plans = [
    {
      name: "Starter",
      slug: "starter",
      description: "For single-outlet cafes, dessert shops, and new cloud kitchens.",
      entitlements: [
        { key: "maxLocations", value: "1" },
        { key: "maxReviewCards", value: "3" },
        { key: "digitalQrMenu", value: "true" },
        { key: "tableOrdering", value: "true" },
        { key: "directCounterBilling", value: "true" },
        { key: "whatsappBills", value: "true" },
        { key: "basicSalesReports", value: "true" },
      ],
      prices: [
        {
          amountMinor: 79900,
          interval: "MONTH",
          unit: "BUSINESS",
          priceType: "FIXED",
        },
        {
          amountMinor: 958800,
          interval: "YEAR",
          unit: "BUSINESS",
          priceType: "FIXED",
        },
      ],
    },
    {
      name: "Growth",
      slug: "growth",
      description: "For growing restaurants managing up to five outlets.",
      entitlements: [
        { key: "maxLocations", value: "5" },
        { key: "digitalQrMenu", value: "true" },
        { key: "tableOrdering", value: "true" },
        { key: "directCounterBilling", value: "true" },
        { key: "whatsappBills", value: "true" },
        { key: "basicSalesReports", value: "true" },
        { key: "aggregatorHub", value: "true" },
        { key: "unifiedKitchenDisplay", value: "true" },
        { key: "globalMenuKillSwitch", value: "true" },
        { key: "recipeInventory", value: "true" },
      ],
      prices: [
        {
          amountMinor: 199900,
          interval: "MONTH",
          unit: "LOCATION",
          priceType: "FIXED",
        },
        {
          amountMinor: 2398800,
          interval: "YEAR",
          unit: "LOCATION",
          priceType: "FIXED",
        },
      ],
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      description: "Custom pricing for restaurant groups, multi-brand businesses, and franchises.",
      entitlements: [
        { key: "maxLocations", value: "unlimited" },
        { key: "digitalQrMenu", value: "true" },
        { key: "tableOrdering", value: "true" },
        { key: "directCounterBilling", value: "true" },
        { key: "whatsappBills", value: "true" },
        { key: "basicSalesReports", value: "true" },
        { key: "aggregatorHub", value: "true" },
        { key: "unifiedKitchenDisplay", value: "true" },
        { key: "globalMenuKillSwitch", value: "true" },
        { key: "recipeInventory", value: "true" },
        { key: "multiBusinessManagement", value: "true" },
        { key: "multiBrandManagement", value: "true" },
        { key: "advancedRbac", value: "true" },
        { key: "franchiseRoyaltyCalculations", value: "true" },
        { key: "settlementReconciliation", value: "true" },
        { key: "centralRollups", value: "true" },
        { key: "dedicatedAccountManager", value: "true" },
        { key: "prioritySupport", value: "true" },
      ],
      prices: [
        {
          amountMinor: 399900,
          interval: "MONTH",
          unit: "LOCATION",
          priceType: "STARTING_AT",
        },
      ],
    },
  ] as const;

  for (const definition of plans) {
    const plan = await prisma.$transaction(async (transaction) => {
      const savedPlan = await transaction.plan.upsert({
        where: { slug: definition.slug },
        update: {
          name: definition.name,
          description: definition.description,
          isActive: true,
        },
        create: {
          name: definition.name,
          slug: definition.slug,
          description: definition.description,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      await transaction.planEntitlement.deleteMany({
        where: { planId: savedPlan.id },
      });
      await transaction.planEntitlement.createMany({
        data: definition.entitlements.map((entitlement) => ({
          ...entitlement,
          planId: savedPlan.id,
        })),
      });

      await transaction.planPrice.deleteMany({
        where: { planId: savedPlan.id },
      });
      await transaction.planPrice.createMany({
        data: definition.prices.map((price) => ({
          ...price,
          planId: savedPlan.id,
          currency: "INR",
          intervalCount: 1,
        })),
      });

      return savedPlan;
    });

    console.log(
      `✓ Plan: ${plan.name} (${plan.slug}) with ${definition.entitlements.length} entitlements and ${definition.prices.length} prices`,
    );
  }

  console.log("");
  console.log("Control DB seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Control DB seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });