import "server-only";

import { Prisma } from "@/generated/tenant/client";
import { resolveTenant } from "@/lib/tenancy/resolve-tenant";
import { getTenantPrisma } from "@/lib/tenancy/tenant-client";
import { LocationError } from "./location.errors";
import type {
  CreateInitialLocationInput,
  InitialLocationResult,
} from "./location.types";

export class InitialLocationService {
  async createInitialLocation(
    input: CreateInitialLocationInput,
  ): Promise<InitialLocationResult> {
    const businessId = input.businessId?.trim();
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();

    if (!businessId || !name || !slug) {
      throw new LocationError(
        "Business ID, name, and slug are required to create initial location.",
        "INVALID_LOCATION_INPUT",
      );
    }

    /*
     * 1. Resolve the active tenant database.
     * resolveTenant throws TenantResolutionError if not found or not ACTIVE.
     */
    let tenant;
    try {
      tenant = await resolveTenant(businessId);
    } catch (error) {
      throw new LocationError(
        `Cannot create initial location: tenant database is not active.`,
        "TENANT_NOT_ACTIVE",
        { cause: error },
      );
    }

    /*
     * 2. Obtain the tenant Prisma client.
     */
    const tenantPrisma = await getTenantPrisma(tenant);

    /*
     * 3. Idempotently check if initial location already exists.
     */
    const existing = await tenantPrisma.location.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (existing) {
      return existing;
    }

    /*
     * 4. Create the initial location.
     */
    try {
      const created = await tenantPrisma.location.create({
        data: {
          name,
          slug,
          status: "ACTIVE",
          ...(input.operatingMode && { operatingMode: input.operatingMode }),
          addressLine1: input.addressLine1 ?? null,
          addressLine2: input.addressLine2 ?? null,
          city: input.city ?? null,
          state: input.state ?? null,
          postalCode: input.postalCode ?? null,
          country: input.country ?? "IN",
          phone: input.phone ?? null,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return created;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // Concurrent race condition handling: another process created the location
        const recheck = await tenantPrisma.location.findUnique({
          where: { slug },
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (recheck) {
          return recheck;
        }
      }

      throw new LocationError(
        "Failed to create initial location in tenant database.",
        "LOCATION_CREATION_FAILED",
        { cause: error },
      );
    }
  }
}

export const initialLocationService = new InitialLocationService();
