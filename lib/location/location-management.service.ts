import "server-only";

import { randomBytes } from "node:crypto";
import { Prisma as TenantPrisma } from "@/generated/tenant/client";
import { controlPrisma } from "@/lib/db/control";
import { getTenantPrisma } from "@/lib/tenancy/tenant-client";
import { resolveTenant } from "@/lib/tenancy/resolve-tenant";
import { canManageBusinessLocations, canReadBusinessLocations } from "./location-management.policy";
import { normalizeTableCode } from "./location-code";

export class LocationManagementError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "LocationManagementError";
  }
}

async function getContext(userId: string, businessId: string, canManage: boolean) {
  const membership = await controlPrisma.businessMembership.findUnique({
    where: { userId_businessId: { userId, businessId } },
    select: {
      status: true,
      role: { select: { slug: true } },
      business: { select: { status: true } },
    },
  });

  const access = {
    status: membership?.status ?? "MISSING",
    businessStatus: membership?.business.status ?? "MISSING",
    roleSlug: membership?.role.slug ?? null,
  };
  if (!canReadBusinessLocations(access)) {
    throw new LocationManagementError("You do not have access to this business.", "BUSINESS_ACCESS_DENIED", 403);
  }
  if (canManage && !canManageBusinessLocations(access)) {
    throw new LocationManagementError("Your role cannot manage business locations or tables.", "ROLE_FORBIDDEN", 403);
  }

  let tenant;
  try {
    tenant = await resolveTenant(businessId);
  } catch {
    throw new LocationManagementError("The business data store is not available.", "TENANT_UNAVAILABLE", 503);
  }

  return { tenant, db: await getTenantPrisma(tenant) };
}

function isUniqueConstraint(error: unknown): boolean {
  return error instanceof TenantPrisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export class LocationManagementService {
  async listLocations(userId: string, businessId: string) {
    const { db } = await getContext(userId, businessId, false);
    const locations = await db.location.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        operatingMode: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { tables: true } },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    return locations.map((location) => ({ ...location, businessId }));
  }

  async createLocation(userId: string, input: {
    businessId: string; name: string; slug: string; operatingMode?: "DINE_IN" | "TAKEAWAY" | "DELIVERY_ONLY" | "HYBRID" | "OTHER";
    addressLine1?: string; addressLine2?: string; city?: string; state?: string; postalCode?: string; country?: string; phone?: string;
  }) {
    const { db } = await getContext(userId, input.businessId, true);
    try {
      const location = await db.location.create({
        data: {
          name: input.name,
          slug: input.slug,
          operatingMode: input.operatingMode ?? "DINE_IN",
          addressLine1: input.addressLine1 ?? null,
          addressLine2: input.addressLine2 ?? null,
          city: input.city ?? null,
          state: input.state ?? null,
          postalCode: input.postalCode ?? null,
          country: input.country ?? "IN",
          phone: input.phone ?? null,
        },
        select: { id: true, name: true, slug: true, status: true, operatingMode: true, createdAt: true, updatedAt: true },
      });
      return { ...location, businessId: input.businessId };
    } catch (error) {
      if (isUniqueConstraint(error)) throw new LocationManagementError("A location with this URL slug already exists.", "LOCATION_SLUG_CONFLICT", 409);
      throw error;
    }
  }

  async updateLocation(userId: string, businessId: string, locationId: string, input: {
    name?: string; slug?: string; status?: "ACTIVE" | "INACTIVE";
    operatingMode?: "DINE_IN" | "TAKEAWAY" | "DELIVERY_ONLY" | "HYBRID" | "OTHER";
    addressLine1?: string | null; addressLine2?: string | null; city?: string | null; state?: string | null;
    postalCode?: string | null; country?: string; phone?: string | null;
  }) {
    const { tenant, db } = await getContext(userId, businessId, true);
    const exists = await db.location.findUnique({ where: { id: locationId }, select: { id: true } });
    if (!exists) throw new LocationManagementError("Location not found.", "LOCATION_NOT_FOUND", 404);
    try {
      if (input.status === "INACTIVE") {
        const tables = await db.table.findMany({ where: { locationId }, select: { id: true } });
        if (tables.length > 0) {
          await controlPrisma.tableRoute.updateMany({
            where: { businessId, tenantKey: tenant.tenantKey, tableId: { in: tables.map((table) => table.id) } },
            data: { status: "INACTIVE" },
          });
        }
      }
      const location = await db.location.update({
        where: { id: locationId }, data: input,
        select: { id: true, name: true, slug: true, status: true, operatingMode: true, addressLine1: true, addressLine2: true, city: true, state: true, postalCode: true, country: true, phone: true, createdAt: true, updatedAt: true },
      });
      if (input.status === "ACTIVE") {
        const tables = await db.table.findMany({ where: { locationId, status: "ACTIVE" }, select: { id: true } });
        if (tables.length > 0) {
          await controlPrisma.tableRoute.updateMany({
            where: { businessId, tenantKey: tenant.tenantKey, tableId: { in: tables.map((table) => table.id) } },
            data: { status: "ACTIVE" },
          });
        }
      }
      return { ...location, businessId };
    } catch (error) {
      if (isUniqueConstraint(error)) throw new LocationManagementError("A location with this URL slug already exists.", "LOCATION_SLUG_CONFLICT", 409);
      throw error;
    }
  }

  async listTables(userId: string, businessId: string, locationId: string, origin: string) {
    const { db } = await getContext(userId, businessId, false);
    const location = await db.location.findUnique({ where: { id: locationId }, select: { id: true } });
    if (!location) throw new LocationManagementError("Location not found.", "LOCATION_NOT_FOUND", 404);
    const tables = await db.table.findMany({
      where: { locationId },
      select: { id: true, locationId: true, name: true, code: true, publicToken: true, status: true, capacity: true, createdAt: true, updatedAt: true, _count: { select: { orders: true } } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    return tables.map(({ publicToken, ...table }) => ({ ...table, publicUrl: new URL(`/t/${publicToken}`, origin).toString() }));
  }

  async createTable(userId: string, businessId: string, locationId: string, input: { name: string; code?: string; capacity?: number | null }, origin: string) {
    const { tenant, db } = await getContext(userId, businessId, true);
    const location = await db.location.findUnique({ where: { id: locationId }, select: { id: true, status: true } });
    if (!location) throw new LocationManagementError("Location not found.", "LOCATION_NOT_FOUND", 404);
    if (location.status !== "ACTIVE") throw new LocationManagementError("Activate this location before adding tables.", "LOCATION_INACTIVE", 409);
    const name = input.name.trim();
    const code = normalizeTableCode(input.code ?? name);
    if (!code) throw new LocationManagementError("Enter a name that can be used to create a table code.", "INVALID_TABLE_CODE", 400);

    let table = await db.table.findUnique({ where: { locationId_code: { locationId, code } } });
    if (table && (table.name.toLocaleLowerCase() !== name.toLocaleLowerCase() || (input.capacity ?? null) !== table.capacity)) {
      throw new LocationManagementError("A table with this code already exists. Choose a different name.", "TABLE_CODE_CONFLICT", 409);
    }
    if (!table) {
      try {
        table = await db.table.create({ data: { locationId, name, code, capacity: input.capacity ?? null, publicToken: randomBytes(24).toString("base64url") } });
      } catch (error) {
        if (isUniqueConstraint(error)) {
          table = await db.table.findUnique({ where: { locationId_code: { locationId, code } } });
          if (!table || table.name.toLocaleLowerCase() !== name.toLocaleLowerCase() || (input.capacity ?? null) !== table.capacity) {
            throw new LocationManagementError("A table with this name or code already exists at this location.", "TABLE_CODE_CONFLICT", 409);
          }
        } else {
          throw error;
        }
      }
    }

    try {
      const route = await controlPrisma.tableRoute.upsert({
        where: { tenantKey_tableId: { tenantKey: tenant.tenantKey, tableId: table.id } },
        create: { token: table.publicToken, businessId, tenantKey: tenant.tenantKey, tableId: table.id, status: table.status === "ACTIVE" ? "ACTIVE" : "INACTIVE" },
        update: { status: table.status === "ACTIVE" ? "ACTIVE" : "INACTIVE", token: table.publicToken },
        select: { token: true },
      });
      const { publicToken: _publicToken, ...safeTable } = table;
      return { ...safeTable, publicUrl: new URL(`/t/${route.token}`, origin).toString() };
    } catch {
      throw new LocationManagementError("The table could not be registered for public access. Retry to safely finish setup.", "TABLE_ROUTE_FAILED", 503);
    }
  }

  async updateTable(userId: string, businessId: string, locationId: string, tableId: string, input: { name?: string; capacity?: number | null; status?: "ACTIVE" | "INACTIVE" }, origin: string) {
    const { tenant, db } = await getContext(userId, businessId, true);
    if (input.status === "ACTIVE") {
      const location = await db.location.findUnique({ where: { id: locationId }, select: { status: true } });
      if (!location) throw new LocationManagementError("Location not found.", "LOCATION_NOT_FOUND", 404);
      if (location.status !== "ACTIVE") throw new LocationManagementError("Activate this location before enabling its tables.", "LOCATION_INACTIVE", 409);
    }
    const existing = await db.table.findFirst({ where: { id: tableId, locationId }, select: { id: true, publicToken: true } });
    if (!existing) throw new LocationManagementError("Table not found.", "TABLE_NOT_FOUND", 404);
    if (input.name) {
      const duplicate = await db.table.findFirst({ where: { locationId, id: { not: tableId }, name: { equals: input.name, mode: "insensitive" } }, select: { id: true } });
      if (duplicate) throw new LocationManagementError("A table with this name already exists at this location.", "TABLE_NAME_CONFLICT", 409);
    }
    if (input.status === "INACTIVE") {
      await controlPrisma.tableRoute.updateMany({ where: { businessId, tenantKey: tenant.tenantKey, tableId }, data: { status: "INACTIVE" } });
    }
    try {
      const table = await db.table.update({ where: { id: tableId }, data: input, select: { id: true, locationId: true, name: true, code: true, publicToken: true, status: true, capacity: true, createdAt: true, updatedAt: true, _count: { select: { orders: true } } } });
      if (input.status === "ACTIVE") {
        await controlPrisma.tableRoute.updateMany({ where: { businessId, tenantKey: tenant.tenantKey, tableId }, data: { status: "ACTIVE" } });
      }
      const { publicToken: _publicToken, ...safeTable } = table;
      return { ...safeTable, publicUrl: new URL(`/t/${table.publicToken}`, origin).toString() };
    } catch (error) {
      if (isUniqueConstraint(error)) throw new LocationManagementError("A table with this name already exists at this location.", "TABLE_NAME_CONFLICT", 409);
      throw error;
    }
  }
}

export const locationManagementService = new LocationManagementService();
