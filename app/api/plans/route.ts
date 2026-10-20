import { controlPrisma } from "@/lib/db/control";
import { handleApiError, successResponse } from "@/lib/api/responses";

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

    return successResponse(plans);
  } catch (error) {
    return handleApiError(
      error,
      "PLAN_CATALOG_UNAVAILABLE",
      "Unable to load plans.",
    );
  }
}
