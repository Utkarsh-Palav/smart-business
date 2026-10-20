import { ApiError } from "@/lib/api/api-error";
import { Prisma } from "@/generated/tenant/client";
import { getBusinessTenantContext } from "@/lib/context/business-tenant-context";
import type {
  CreateCategoryInput,
  CreateMenuInput,
  CreateProductInput,
  UpdateAvailabilityInput,
  UpdateCategoryInput,
  UpdateMenuInput,
  UpdateProductInput,
} from "@/features/menus/schemas/menu.schema";

export class MenuManagementError extends ApiError {}

function isPrismaCode(error: unknown, code: string) {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function uniqueConflict<T>(operation: () => Promise<T>, resource: string): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isPrismaCode(error, "P2002")) {
      throw new MenuManagementError(
        `A ${resource} with that slug already exists.`,
        `${resource.toUpperCase()}_SLUG_EXISTS`,
        409,
      );
    }
    throw error;
  }
}

export class MenuManagementService {
  private async context(
    userId: string,
    businessId: string,
    access: "read" | "manage" = "manage",
  ) {
    return getBusinessTenantContext(userId, businessId, access);
  }

  private async requireMenu(db: Awaited<ReturnType<typeof this.context>>["db"], menuId: string) {
    const menu = await db.menu.findUnique({
      where: { id: menuId },
      select: { id: true, name: true, slug: true, status: true, locationId: true },
    });
    if (!menu) throw new MenuManagementError("Menu not found.", "MENU_NOT_FOUND", 404);
    return menu;
  }

  async listMenus(userId: string, businessId: string, locationId: string) {
    const { db } = await this.context(userId, businessId, "read");
    return db.menu.findMany({
      where: { locationId },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { categories: true, products: true } },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  }

  async createMenu(userId: string, businessId: string, locationId: string, input: CreateMenuInput) {
    const { db } = await this.context(userId, businessId);
    try {
      return await uniqueConflict(
        () => db.menu.create({ data: { ...input, locationId } }),
        "MENU",
      );
    } catch (error) {
      if (isPrismaCode(error, "P2003")) {
        throw new MenuManagementError("Location not found.", "LOCATION_NOT_FOUND", 404);
      }
      throw error;
    }
  }

  async getMenu(
    userId: string,
    businessId: string,
    menuId: string,
    locationId: string,
  ) {
    const { db } = await this.context(userId, businessId, "read");
    const menu = await db.menu.findFirst({
      where: { id: menuId, locationId },
      relationLoadStrategy: "join",
      include: {
        categories: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          include: { category: true },
        },
        products: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          include: {
            product: {
              include: {
                category: true,
                availability: { where: { locationId } },
              },
            },
          },
        },
        _count: { select: { categories: true, products: true } },
      },
    });
    if (!menu) throw new MenuManagementError("Menu not found.", "MENU_NOT_FOUND", 404);
    return menu;
  }

  async updateMenu(userId: string, businessId: string, menuId: string, input: UpdateMenuInput) {
    const { db } = await this.context(userId, businessId);
    const menu = await this.requireMenu(db, menuId);
    if (menu.status === "ARCHIVED") {
      throw new MenuManagementError("Archived menus cannot be edited.", "MENU_ARCHIVED", 409);
    }
    return uniqueConflict(() => db.menu.update({ where: { id: menuId }, data: input }), "MENU");
  }

  async publishMenu(userId: string, businessId: string, menuId: string) {
    const { db } = await this.context(userId, businessId);
    try {
      return await db.$transaction(async (tx) => {
        const menu = await tx.menu.findUnique({
          where: { id: menuId },
          select: { id: true, locationId: true, status: true },
        });
        if (!menu) throw new MenuManagementError("Menu not found.", "MENU_NOT_FOUND", 404);
        if (menu.status === "ARCHIVED") {
          throw new MenuManagementError("Archived menus cannot be published.", "MENU_ARCHIVED", 409);
        }
        const published = await tx.menu.findFirst({
          where: { locationId: menu.locationId, status: "PUBLISHED", id: { not: menuId } },
          select: { id: true },
        });
        if (published) {
          throw new MenuManagementError(
            "Another menu is already published for this location. Archive it before publishing this menu.",
            "PUBLISHED_MENU_EXISTS",
            409,
          );
        }
        return tx.menu.update({ where: { id: menuId }, data: { status: "PUBLISHED" } });
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if (isPrismaCode(error, "P2034")) {
        throw new MenuManagementError(
          "Another menu was published at the same time. Refresh and try again.",
          "PUBLISHED_MENU_CONFLICT",
          409,
        );
      }
      throw error;
    }
  }

  async archiveMenu(userId: string, businessId: string, menuId: string) {
    const { db } = await this.context(userId, businessId);
    await this.requireMenu(db, menuId);
    return db.menu.update({ where: { id: menuId }, data: { status: "ARCHIVED" } });
  }

  async listCategories(userId: string, businessId: string, menuId: string) {
    const { db } = await this.context(userId, businessId, "read");
    await this.requireMenu(db, menuId);
    return db.menuCategory.findMany({
      where: { menuId },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: { category: true },
    });
  }

  async createCategory(userId: string, businessId: string, menuId: string, input: CreateCategoryInput) {
    const { db } = await this.context(userId, businessId);
    try {
      return await uniqueConflict(
        () => db.menuCategory.create({
          data: {
            sortOrder: input.sortOrder ?? 0,
            menu: { connect: { id: menuId } },
            category: {
              create: {
                name: input.name,
                slug: input.slug,
                description: input.description,
              },
            },
          },
          include: { category: true },
        }),
        "CATEGORY",
      );
    } catch (error) {
      if (isPrismaCode(error, "P2003")) {
        throw new MenuManagementError("Menu not found.", "MENU_NOT_FOUND", 404);
      }
      throw error;
    }
  }

  async updateCategory(userId: string, businessId: string, categoryId: string, input: UpdateCategoryInput) {
    const { db } = await this.context(userId, businessId);
    const category = await db.category.findUnique({ where: { id: categoryId }, select: { id: true } });
    if (!category) throw new MenuManagementError("Category not found.", "CATEGORY_NOT_FOUND", 404);
    const { menuId, sortOrder, ...categoryInput } = input;
    if (menuId) {
      await this.requireMenu(db, menuId);
      const link = await db.menuCategory.findUnique({
        where: { menuId_categoryId: { menuId, categoryId } },
        select: { id: true },
      });
      if (!link) throw new MenuManagementError("Category is not part of this menu.", "CATEGORY_NOT_IN_MENU", 404);
      return uniqueConflict(() => db.$transaction(async (tx) => {
        const updated = await tx.category.update({ where: { id: categoryId }, data: categoryInput });
        if (sortOrder !== undefined) {
          await tx.menuCategory.update({
            where: { menuId_categoryId: { menuId, categoryId } },
            data: { sortOrder },
          });
        }
        return { ...updated, sortOrder };
      }), "CATEGORY");
    }
    return uniqueConflict(() => db.category.update({ where: { id: categoryId }, data: categoryInput }), "CATEGORY");
  }

  async removeCategoryFromMenu(userId: string, businessId: string, categoryId: string, menuId: string) {
    const { db } = await this.context(userId, businessId);
    await this.requireMenu(db, menuId);
    const category = await db.category.findUnique({ where: { id: categoryId }, select: { id: true } });
    if (!category) throw new MenuManagementError("Category not found.", "CATEGORY_NOT_FOUND", 404);
    const link = await db.menuCategory.findUnique({
      where: { menuId_categoryId: { menuId, categoryId } },
      select: { id: true },
    });
    if (!link) throw new MenuManagementError("Category is not part of this menu.", "CATEGORY_NOT_IN_MENU", 404);
    const productCount = await db.menuProduct.count({
      where: { menuId, product: { categoryId } },
    });
    if (productCount > 0) {
      throw new MenuManagementError(
        "Move this menu’s products to another category before removing the category.",
        "CATEGORY_HAS_PRODUCTS",
        409,
      );
    }
    await db.menuCategory.delete({ where: { menuId_categoryId: { menuId, categoryId } } });
    return { categoryId, menuId, removed: true };
  }

  async listProducts(userId: string, businessId: string, menuId: string) {
    const { db } = await this.context(userId, businessId, "read");
    const menu = await this.requireMenu(db, menuId);
    return db.menuProduct.findMany({
      where: { menuId },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: {
        product: {
          include: {
            category: true,
            availability: { where: { locationId: menu.locationId } },
          },
        },
      },
    });
  }

  async createProduct(
    userId: string,
    businessId: string,
    menuId: string,
    input: CreateProductInput,
  ) {
    const { db } = await this.context(userId, businessId, "manage");
    const validationRows = await db.$queryRaw<
      Array<{ menuId: string; locationId: string; categoryStatus: string | null }>
    >(Prisma.sql`
      SELECT
        menu."id" AS "menuId",
        menu."locationId" AS "locationId",
        category."status"::text AS "categoryStatus"
      FROM "public"."Menu" AS menu
      LEFT JOIN "public"."MenuCategory" AS menu_category
        ON menu_category."menuId" = menu."id"
        AND menu_category."categoryId" = ${input.categoryId}
      LEFT JOIN "public"."Category" AS category
        ON category."id" = menu_category."categoryId"
      WHERE menu."id" = ${menuId}
      LIMIT 1
    `);
    const menu = validationRows[0];
    if (!menu) throw new MenuManagementError("Menu not found.", "MENU_NOT_FOUND", 404);
    if (menu.categoryStatus === null) {
      throw new MenuManagementError("Choose a category that belongs to this menu.", "CATEGORY_NOT_IN_MENU", 400);
    }
    if (menu.categoryStatus !== "ACTIVE") {
      throw new MenuManagementError("Choose an active category.", "CATEGORY_INACTIVE", 400);
    }
    return uniqueConflict(async () => {
      return db.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            categoryId: input.categoryId,
            name: input.name,
            slug: input.slug,
            description: input.description,
            sku: input.sku,
            imageUrl: input.imageUrl,
            basePriceMinor: input.basePriceMinor,
            currency: input.currency,
          },
          select: { id: true },
        });

        await tx.productAvailability.createMany({
          data: [{
            productId: product.id,
            locationId: menu.locationId,
            isAvailable: true,
          }],
        });

        await tx.menuProduct.createMany({
          data: [{
            menuId,
            productId: product.id,
            displayName: input.displayName,
            displayDescription: input.displayDescription,
            priceOverrideMinor: input.priceOverrideMinor,
            sortOrder: input.sortOrder ?? 0,
            isVisible: input.isVisible ?? true,
          }],
        });

        return { id: product.id };
      });
    }, "PRODUCT");
  }

  async updateProduct(userId: string, businessId: string, productId: string, input: UpdateProductInput) {
    const { db } = await this.context(userId, businessId);
    const menu = await db.menu.findUnique({
      where: { id: input.menuId },
      select: {
        locationId: true,
        products: { where: { productId }, select: { id: true }, take: 1 },
        categories: {
          where: { categoryId: input.categoryId ?? "" },
          select: { category: { select: { status: true } } },
          take: 1,
        },
      },
    });
    if (!menu) throw new MenuManagementError("Menu not found.", "MENU_NOT_FOUND", 404);
    if (!menu.products.length) throw new MenuManagementError("Product is not part of this menu.", "PRODUCT_NOT_IN_MENU", 404);
    if (input.categoryId) {
      const categoryLink = menu.categories[0];
      if (!categoryLink) {
        throw new MenuManagementError("Choose a category that belongs to this menu.", "CATEGORY_NOT_IN_MENU", 400);
      }
      if (categoryLink.category.status !== "ACTIVE") {
        throw new MenuManagementError("Choose an active category.", "CATEGORY_INACTIVE", 400);
      }
    }
    const { menuId: _menuId, name, slug, categoryId, description, sku, imageUrl, basePriceMinor, currency, status, displayName, displayDescription, priceOverrideMinor, sortOrder, isVisible } = input;
    return uniqueConflict(() => db.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: { name, slug, categoryId, description, sku, imageUrl, basePriceMinor, currency, status },
      });
      const menuProduct = await tx.menuProduct.update({
        where: { menuId_productId: { menuId: _menuId, productId } },
        data: { displayName, displayDescription, priceOverrideMinor, sortOrder, isVisible },
      });
      const availability = await tx.productAvailability.findUnique({
        where: { productId_locationId: { productId, locationId: menu.locationId } },
      });
      return { ...menuProduct, product: { ...product, availability: availability ? [availability] : [] } };
    }), "PRODUCT");
  }

  async updateAvailability(userId: string, businessId: string, productId: string, input: UpdateAvailabilityInput) {
    const { db } = await this.context(userId, businessId);
    const menu = await db.menu.findUnique({
      where: { id: input.menuId },
      select: {
        locationId: true,
        products: { where: { productId }, select: { id: true }, take: 1 },
      },
    });
    if (!menu) throw new MenuManagementError("Menu not found.", "MENU_NOT_FOUND", 404);
    if (menu.locationId !== input.locationId) {
      throw new MenuManagementError("The menu does not belong to this location.", "LOCATION_MENU_MISMATCH", 400);
    }
    if (!menu.products.length) throw new MenuManagementError("Product is not part of this menu.", "PRODUCT_NOT_IN_MENU", 404);
    return db.productAvailability.upsert({
      where: { productId_locationId: { productId, locationId: input.locationId } },
      create: {
        productId,
        locationId: input.locationId,
        isAvailable: input.isAvailable,
        priceOverrideMinor: input.priceOverrideMinor,
      },
      update: { isAvailable: input.isAvailable, priceOverrideMinor: input.priceOverrideMinor },
    });
  }
}

export const menuManagementService = new MenuManagementService();
