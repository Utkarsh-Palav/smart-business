import { apiRequest } from "@/lib/api/client";

export type MenuStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type RecordStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type MenuSummary = {
  id: string;
  name: string;
  slug: string;
  status: MenuStatus;
  createdAt: string;
  updatedAt: string;
  _count: { categories: number; products: number };
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

export type MenuCategoryLink = {
  id: string;
  menuId: string;
  categoryId: string;
  sortOrder: number;
  category: MenuCategory;
};

export type MenuProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  imageUrl: string | null;
  basePriceMinor: number;
  currency: string;
  status: RecordStatus;
  category: MenuCategory;
  availability: {
    locationId: string;
    isAvailable: boolean;
    priceOverrideMinor: number | null;
  }[];
};

export type MenuProductLink = {
  id: string;
  menuId: string;
  productId: string;
  displayName: string | null;
  displayDescription: string | null;
  sortOrder: number;
  isVisible: boolean;
  priceOverrideMinor: number | null;
  product: MenuProduct;
};

export type MenuDetail = MenuSummary & {
  locationId: string;
  categories: MenuCategoryLink[];
  products: MenuProductLink[];
};

export type MenuDraftInput = { name: string; slug: string };

function businessQuery(businessId: string) {
  return `businessId=${encodeURIComponent(businessId)}`;
}

export function menuListUrl(businessId: string, locationId: string) {
  return `/api/locations/${encodeURIComponent(locationId)}/menus?${businessQuery(businessId)}`;
}

export function menuDetailUrl(
  businessId: string,
  menuId: string,
  locationId?: string,
) {
  const locationQuery = locationId
    ? `&locationId=${encodeURIComponent(locationId)}`
    : "";
  return `/api/menus/${encodeURIComponent(menuId)}?${businessQuery(businessId)}${locationQuery}`;
}

export async function getMenus(businessId: string, locationId: string) {
  return apiRequest<MenuSummary[]>(menuListUrl(businessId, locationId));
}

export async function createMenu(
  businessId: string,
  locationId: string,
  input: MenuDraftInput,
) {
  return apiRequest<{ id: string }>(menuListUrl(businessId, locationId), {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMenu(
  businessId: string,
  menuId: string,
  locationId: string,
) {
  return apiRequest<MenuDetail>(menuDetailUrl(businessId, menuId, locationId));
}

export async function updateMenu(
  businessId: string,
  menuId: string,
  input: Partial<MenuDraftInput>,
) {
  return apiRequest<MenuSummary>(menuDetailUrl(businessId, menuId), {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function setMenuStatus(
  businessId: string,
  menuId: string,
  action: "publish" | "archive",
) {
  return apiRequest<MenuSummary>(
    `/api/menus/${encodeURIComponent(menuId)}/${action}?${businessQuery(businessId)}`,
    {
      method: "POST",
    },
  );
}

export async function createCategory(
  businessId: string,
  menuId: string,
  input: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
  },
) {
  return apiRequest<MenuCategoryLink>(
    `/api/menus/${encodeURIComponent(menuId)}/categories?${businessQuery(businessId)}`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateCategory(
  businessId: string,
  menuId: string,
  categoryId: string,
  input: {
    name?: string;
    slug?: string;
    description?: string | null;
    status?: RecordStatus;
    sortOrder?: number;
  },
) {
  return apiRequest<MenuCategory>(
    `/api/categories/${encodeURIComponent(categoryId)}?${businessQuery(businessId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ menuId, ...input }),
    },
  );
}

export async function removeCategoryFromMenu(
  businessId: string,
  menuId: string,
  categoryId: string,
) {
  return apiRequest<{ categoryId: string; menuId: string; removed: true }>(
    `/api/categories/${encodeURIComponent(categoryId)}?${businessQuery(businessId)}&menuId=${encodeURIComponent(menuId)}`,
    { method: "DELETE" },
  );
}

export type CreateProductInput = {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  sku?: string;
  imageUrl?: string | null;
  basePriceMinor: number;
  currency?: string;
  displayName?: string;
  displayDescription?: string;
  priceOverrideMinor?: number | null;
  sortOrder?: number;
  isVisible?: boolean;
};

export async function createProduct(
  businessId: string,
  menuId: string,
  input: CreateProductInput,
) {
  return apiRequest<{ id: string }>(
    `/api/menus/${encodeURIComponent(menuId)}/products?${businessQuery(businessId)}`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateProduct(
  businessId: string,
  productId: string,
  menuId: string,
  input: Record<string, unknown>,
) {
  return apiRequest<MenuProductLink>(
    `/api/products/${encodeURIComponent(productId)}?${businessQuery(businessId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ menuId, ...input }),
    },
  );
}

export async function updateProductAvailability(
  businessId: string,
  productId: string,
  input: { menuId: string; locationId: string; isAvailable: boolean },
) {
  return apiRequest<{
    isAvailable: boolean;
    priceOverrideMinor: number | null;
  }>(
    `/api/products/${encodeURIComponent(productId)}/availability?${businessQuery(businessId)}`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
}
