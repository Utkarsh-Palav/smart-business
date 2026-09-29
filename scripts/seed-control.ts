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

  /*
   * ------------------------------------------------------------
   * STARTER PLAN
   * ------------------------------------------------------------
   */

  const starterPlan = await prisma.plan.upsert({
    where: {
      slug: "starter",
    },
    update: {
      name: "Starter",
      description: "Starter plan for small businesses.",
      isActive: true,
    },
    create: {
      name: "Starter",
      slug: "starter",
      description: "Starter plan for small businesses.",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  console.log(
    `✓ Plan: ${starterPlan.name} (${starterPlan.slug})`,
  );

  /*
   * ------------------------------------------------------------
   * STARTER PLAN ENTITLEMENTS
   * ------------------------------------------------------------
   */

  const entitlements = [
    {
      key: "maxLocations",
      value: "3",
    },
    {
      key: "maxReviewCards",
      value: "3",
    },
  ];

  for (const entitlement of entitlements) {
    await prisma.planEntitlement.upsert({
      where: {
        planId_key: {
          planId: starterPlan.id,
          key: entitlement.key,
        },
      },
      update: {
        value: entitlement.value,
      },
      create: {
        planId: starterPlan.id,
        key: entitlement.key,
        value: entitlement.value,
      },
    });

    console.log(
      `✓ Entitlement: ${entitlement.key}=${entitlement.value}`,
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