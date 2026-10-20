import { notFound } from "next/navigation";
import { controlPrisma } from "@/lib/db/control";
import { resolveTenant } from "@/lib/tenancy/resolve-tenant";
import { getTenantPrisma } from "@/lib/tenancy/tenant-client";
import { PublicTableMenuClient } from "@/components/orders/PublicTableMenuClient";

type PublicMenuContent = {
  name: string;
  categories: {
    category: { id: string; name: string; description: string | null };
    sortOrder: number;
  }[];
  products: {
    id: string;
    displayName: string | null;
    displayDescription: string | null;
    priceOverrideMinor: number | null;
    product: {
      id: string;
      name: string;
      description: string | null;
      imageUrl: string | null;
      basePriceMinor: number;
      currency: string;
      categoryId: string;
      availability: { isAvailable: boolean; priceOverrideMinor: number | null }[];
    };
  }[];
};

type PublicTableMenu = {
  businessName: string;
  tableName: string;
  locationName: string;
  menu: PublicMenuContent | null;
};

async function getPublicTableMenu(token: string): Promise<PublicTableMenu | null> {
  const route = await controlPrisma.tableRoute.findUnique({
    where: { token },
    select: {
      businessId: true,
      tableId: true,
      tenantKey: true,
      status: true,
      business: { select: { status: true, name: true } },
    },
  });

  if (!route || route.status !== "ACTIVE" || route.business.status !== "ACTIVE") return null;

  const tenant = await resolveTenant(route.businessId);
  if (tenant.tenantKey !== route.tenantKey) return null;
  const db = await getTenantPrisma(tenant);
  const table = await db.table.findUnique({
    where: { id: route.tableId },
    select: {
      publicToken: true,
      name: true,
      status: true,
      location: {
        select: { id: true, name: true, status: true },
      },
    },
  });

  if (!table || table.publicToken !== token || table.status !== "ACTIVE" || table.location.status !== "ACTIVE") return null;
  const menu = await db.menu.findFirst({
    where: { locationId: table.location.id, status: "PUBLISHED" },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      name: true,
      categories: {
        where: { category: { status: "ACTIVE" } },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: {
          sortOrder: true,
          category: { select: { id: true, name: true, description: true } },
        },
      },
      products: {
        where: {
          isVisible: true,
          product: { status: "ACTIVE", category: { status: "ACTIVE" } },
        },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: {
          id: true,
          displayName: true,
          displayDescription: true,
          priceOverrideMinor: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              imageUrl: true,
              basePriceMinor: true,
              currency: true,
              categoryId: true,
              availability: {
                where: { locationId: table.location.id },
                select: { isAvailable: true, priceOverrideMinor: true },
              },
            },
          },
        },
      },
    },
  });
  if (!menu) {
    return { businessName: route.business.name, tableName: table.name, locationName: table.location.name, menu: null };
  }

  return {
    businessName: route.business.name,
    tableName: table.name,
    locationName: table.location.name,
    menu,
  };
}

export default async function PublicTableMenuPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let data: PublicTableMenu | null;
  try {
    data = await getPublicTableMenu(token);
  } catch {
    return <main className="grid min-h-screen place-items-center bg-stone-50 px-5"><section className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-bold text-stone-900">Menu temporarily unavailable</h1><p className="mt-2 text-sm text-stone-600">Please ask a staff member for help or try again shortly.</p></section></main>;
  }
  if (!data) notFound();
  return <PublicTableMenuClient data={data} token={token} />;
}
