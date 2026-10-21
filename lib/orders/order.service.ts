import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { ApiError } from "@/lib/api/api-error";
import { controlPrisma } from "@/lib/db/control";
import { resolveTenant } from "@/lib/tenancy/resolve-tenant";
import { getTenantPrisma } from "@/lib/tenancy/tenant-client";
import { getBusinessTenantContext } from "@/lib/context/business-tenant-context";
import type {
  CreatePublicOrderInput,
  UpdateOrderStatusInput,
} from "@/features/orders/schemas/order.schema";
import type { PublicOrderAccess } from "@/lib/orders/public-order-access";
import {
  canTransitionOrderStatus,
  resolveOrderUnitPrice,
  type OrderStatus,
} from "@/lib/orders/order.rules";

type TenantDb = Awaited<ReturnType<typeof getTenantPrisma>>;

export class OrderServiceError extends ApiError {}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

async function publicTableContext(token: string) {
  const route = await controlPrisma.tableRoute.findUnique({
    where: { token },
    select: {
      businessId: true,
      tableId: true,
      tenantKey: true,
      status: true,
      business: { select: { status: true } },
    },
  });
  if (
    !route ||
    route.status !== "ACTIVE" ||
    route.business.status !== "ACTIVE"
  ) {
    throw new OrderServiceError(
      "This table link is unavailable.",
      "TABLE_LINK_UNAVAILABLE",
      404,
    );
  }

  const tenant = await resolveTenant(route.businessId);
  if (tenant.tenantKey !== route.tenantKey) {
    throw new OrderServiceError(
      "This table link is unavailable.",
      "TABLE_LINK_UNAVAILABLE",
      404,
    );
  }
  const db = await getTenantPrisma(tenant);
  const table = await db.table.findUnique({
    where: { id: route.tableId },
    select: {
      id: true,
      publicToken: true,
      status: true,
      locationId: true,
      location: { select: { status: true } },
    },
  });
  if (
    !table ||
    table.publicToken !== token ||
    table.status !== "ACTIVE" ||
    table.location.status !== "ACTIVE"
  ) {
    throw new OrderServiceError(
      "This table link is unavailable.",
      "TABLE_LINK_UNAVAILABLE",
      404,
    );
  }
  return { db, table };
}

function makeOrderNumber() {
  return `SB-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

async function findPublishedMenu(db: TenantDb, locationId: string) {
  const menu = await db.menu.findFirst({
    where: { locationId, status: "PUBLISHED" },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: { id: true },
  });
  if (!menu) return null;
  const products = await db.menuProduct.findMany({
    where: {
      menuId: menu.id,
      isVisible: true,
      product: {
        status: "ACTIVE",
        category: {
          status: "ACTIVE",
          menuCategories: { some: { menuId: menu.id } },
        },
      },
    },
    select: {
      productId: true,
      displayName: true,
      priceOverrideMinor: true,
      product: {
        select: {
          name: true,
          basePriceMinor: true,
          currency: true,
          availability: {
            where: { locationId },
            select: { isAvailable: true, priceOverrideMinor: true },
          },
        },
      },
    },
  });
  return { id: menu.id, products };
}

async function findExistingOrder(
  db: TenantDb,
  idempotencyKey: string,
  requestHash: string,
) {
  const existing = await db.order.findUnique({
    where: { idempotencyKey },
    select: {
      orderNumber: true,
      status: true,
      subtotalMinor: true,
      discountMinor: true,
      taxMinor: true,
      totalMinor: true,
      currency: true,
      placedAt: true,
      requestHash: true,
      table: { select: { name: true } },
      location: { select: { name: true } },
      items: {
        select: {
          productName: true,
          quantity: true,
          unitPriceMinor: true,
          totalMinor: true,
          notes: true,
        },
      },
    },
  });
  if (!existing) return null;
  if (existing.requestHash !== requestHash) {
    throw new OrderServiceError(
      "This order submission key was already used for different items.",
      "IDEMPOTENCY_CONFLICT",
      409,
    );
  }
  const { requestHash: _requestHash, ...receipt } = existing;
  void _requestHash;
  return receipt;
}

export class OrderService {
  async getPublicTableOrders(token: string, accesses: PublicOrderAccess[]) {
    if (!accesses.length) return [];
    const { db, table } = await publicTableContext(token);
    const accessByOrderNumber = new Map(
      accesses.map(({ orderNumber, accessKey }) => [orderNumber, accessKey]),
    );
    const candidates = await db.order.findMany({
      where: {
        tableId: table.id,
        orderNumber: { in: [...accessByOrderNumber.keys()] },
        idempotencyKey: { in: [...new Set(accesses.map(({ accessKey }) => accessKey))] },
      },
      orderBy: [{ placedAt: "desc" }, { id: "desc" }],
      take: accesses.length,
      select: {
        orderNumber: true,
        idempotencyKey: true,
        status: true,
        subtotalMinor: true,
        discountMinor: true,
        taxMinor: true,
        totalMinor: true,
        currency: true,
        placedAt: true,
        table: { select: { name: true } },
        location: { select: { name: true } },
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPriceMinor: true,
            totalMinor: true,
            notes: true,
          },
        },
      },
    });
    return candidates
      .filter((order) => accessByOrderNumber.get(order.orderNumber) === order.idempotencyKey)
      .map((order) => {
        const { idempotencyKey, ...receipt } = order;
        void idempotencyKey;
        return receipt;
      });
  }

  async getPublicTableOrder(
    token: string,
    orderNumber: string,
    accessKey: string,
  ) {
    const { db, table } = await publicTableContext(token);
    const order = await db.order.findFirst({
      where: { orderNumber, idempotencyKey: accessKey, tableId: table.id },
      select: {
        orderNumber: true,
        status: true,
        subtotalMinor: true,
        discountMinor: true,
        taxMinor: true,
        totalMinor: true,
        currency: true,
        placedAt: true,
        table: { select: { name: true } },
        location: { select: { name: true } },
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPriceMinor: true,
            totalMinor: true,
            notes: true,
          },
        },
      },
    });
    if (!order) {
      throw new OrderServiceError(
        "This order could not be found for this table.",
        "ORDER_NOT_FOUND",
        404,
      );
    }
    return order;
  }

  async createPublicTableOrder(token: string, input: CreatePublicOrderInput) {
    const { db, table } = await publicTableContext(token);
    const canonicalInput = {
      items: [...input.items].sort((a, b) =>
        a.productId.localeCompare(b.productId),
      ),
      customerName: input.customerName ?? "",
      customerPhone: input.customerPhone ?? "",
      notes: input.notes ?? "",
    };
    const requestHash = createHash("sha256")
      .update(JSON.stringify(canonicalInput))
      .digest("hex");
    const existing = await findExistingOrder(
      db,
      input.idempotencyKey,
      requestHash,
    );
    if (existing) return { ...existing, duplicate: true };

    const menu = await findPublishedMenu(db, table.locationId);
    if (!menu)
      throw new OrderServiceError(
        "There is no published menu for this location.",
        "PUBLISHED_MENU_UNAVAILABLE",
        409,
      );
    const requestedIds = new Set(input.items.map((item) => item.productId));
    if (requestedIds.size !== input.items.length) {
      throw new OrderServiceError(
        "Each product can appear only once in the order.",
        "DUPLICATE_ORDER_PRODUCT",
        400,
      );
    }
    const products = new Map(
      menu.products.map((entry) => [entry.productId, entry]),
    );
    const unavailable = input.items.filter((item) => {
      const product = products.get(item.productId);
      return !product || product.product.availability[0]?.isAvailable === false;
    });
    if (unavailable.length) {
      throw new OrderServiceError(
        "One or more items are no longer available. Refresh the menu and try again.",
        "ORDER_ITEMS_UNAVAILABLE",
        409,
        {
          productIds: unavailable.map(({ productId }) => productId),
        },
      );
    }

    const currency = input.items.map(
      ({ productId }) => products.get(productId)!.product.currency,
    )[0];
    if (
      input.items.some(
        ({ productId }) =>
          products.get(productId)!.product.currency !== currency,
      )
    ) {
      throw new OrderServiceError(
        "Items with different currencies cannot be ordered together.",
        "ORDER_CURRENCY_MISMATCH",
        400,
      );
    }
    const orderItems = input.items.map((item) => {
      const entry = products.get(item.productId)!;
      const unitPriceMinor = resolveOrderUnitPrice(
        entry.priceOverrideMinor,
        entry.product.availability[0]?.priceOverrideMinor ?? null,
        entry.product.basePriceMinor,
      );
      return {
        productId: item.productId,
        productName: entry.displayName || entry.product.name,
        unitPriceMinor,
        quantity: item.quantity,
        totalMinor: unitPriceMinor * item.quantity,
        notes: item.notes || null,
      };
    });
    const subtotalMinor = orderItems.reduce(
      (sum, item) => sum + item.totalMinor,
      0,
    );
    if (!Number.isSafeInteger(subtotalMinor) || subtotalMinor > 2_147_483_647) {
      throw new OrderServiceError(
        "The order total is too large.",
        "ORDER_TOTAL_INVALID",
        400,
      );
    }

    try {
      return await db.order.create({
        data: {
          orderNumber: makeOrderNumber(),
          idempotencyKey: input.idempotencyKey,
          requestHash,
          locationId: table.locationId,
          tableId: table.id,
          source: "CUSTOMER_TABLE",
          subtotalMinor,
          discountMinor: 0,
          taxMinor: 0,
          totalMinor: subtotalMinor,
          currency,
          customerName: input.customerName || null,
          customerPhone: input.customerPhone || null,
          notes: input.notes || null,
          items: { create: orderItems },
        },
        select: {
          orderNumber: true,
          status: true,
          subtotalMinor: true,
          discountMinor: true,
          taxMinor: true,
          totalMinor: true,
          currency: true,
          placedAt: true,
          table: { select: { name: true } },
          location: { select: { name: true } },
          items: {
            select: {
              productName: true,
              quantity: true,
              unitPriceMinor: true,
              totalMinor: true,
              notes: true,
            },
          },
        },
      });
    } catch (error) {
      if (isUniqueConflict(error)) {
        const duplicate = await findExistingOrder(
          db,
          input.idempotencyKey,
          requestHash,
        );
        if (duplicate) return { ...duplicate, duplicate: true };
        throw new OrderServiceError(
          "Unable to create this order. Please retry.",
          "ORDER_CONFLICT",
          409,
        );
      }
      throw error;
    }
  }

  async listOrders(
    userId: string,
    businessId: string,
    locationId: string,
    status?: OrderStatus,
  ) {
    const { db } = await getBusinessTenantContext(userId, businessId, "read");
    return db.order.findMany({
      where: {
        locationId,
        ...(status
          ? { status }
          : {
              status: {
                in: ["PENDING", "ACCEPTED", "PREPARING", "READY", "SERVED"],
              },
            }),
      },
      orderBy: [{ placedAt: "asc" }, { id: "asc" }],
      take: 100,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        source: true,
        table: { select: { name: true } },
        customerName: true,
        customerPhone: true,
        notes: true,
        subtotalMinor: true,
        taxMinor: true,
        discountMinor: true,
        totalMinor: true,
        currency: true,
        placedAt: true,
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            unitPriceMinor: true,
            totalMinor: true,
            notes: true,
          },
        },
      },
    });
  }

  async updateOrderStatus(
    userId: string,
    businessId: string,
    locationId: string,
    orderId: string,
    input: UpdateOrderStatusInput,
  ) {
    const { db } = await getBusinessTenantContext(userId, businessId, "manage");
    return db.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, locationId },
        select: { id: true, status: true },
      });
      if (!order)
        throw new OrderServiceError("Order not found.", "ORDER_NOT_FOUND", 404);
      if (
        !canTransitionOrderStatus(order.status as OrderStatus, input.status)
      ) {
        throw new OrderServiceError(
          `Order cannot move from ${order.status} to ${input.status}.`,
          "ORDER_STATUS_TRANSITION_INVALID",
          409,
        );
      }
      const result = await tx.order.updateMany({
        where: { id: orderId, locationId, status: order.status },
        data: {
          status: input.status,
          ...(input.status === "ACCEPTED" ? { acceptedAt: new Date() } : {}),
          ...(input.status === "COMPLETED" ? { completedAt: new Date() } : {}),
          ...(input.status === "CANCELED" ? { canceledAt: new Date() } : {}),
        },
      });
      if (!result.count)
        throw new OrderServiceError(
          "The order changed while you were updating it. Refresh and try again.",
          "ORDER_STATUS_CONFLICT",
          409,
        );
      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        select: { id: true, orderNumber: true, status: true },
      });
    });
  }
}

export const orderService = new OrderService();
