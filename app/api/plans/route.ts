import { NextResponse } from "next/server";

import { controlPrisma } from "@/lib/db/control";

export async function GET() {
  try {
    const plans = await controlPrisma.plan.findMany({
      where: {
        isActive: true,
        prices: { some: { isActive: true } },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        entitlements: {
          select: {
            key: true,
            value: true,
          },
          orderBy: { key: "asc" },
        },
        prices: {
          where: { isActive: true },
          select: {
            id: true,
            currency: true,
            amountMinor: true,
            interval: true,
            intervalCount: true,
            unit: true,
            priceType: true,
          },
          orderBy: [{ unit: "asc" }, { interval: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: plans,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Plan catalog request failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PLAN_CATALOG_UNAVAILABLE",
          message: "Unable to load plans.",
        },
      },
      { status: 500 },
    );
  }
}