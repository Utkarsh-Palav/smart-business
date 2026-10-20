"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Archive,
  Eye,
  LoaderCircle,
  Plus,
  RefreshCw,
  Send,
  UtensilsCrossed,
} from "lucide-react";
import { useDashboardBusinessLocation } from "@/components/dashboard/BusinessLocationProvider";
import {
  useCreateCategory,
  useCreateMenu,
  useCreateProduct,
  useMenu,
  useMenus,
  useSetMenuStatus,
  useUpdateCategory,
  useUpdateMenu,
  useUpdateProduct,
  useUpdateProductAvailability,
  useRemoveCategory,
} from "@/features/menus/queries/use-menus";
import type {
  MenuCategoryLink,
  MenuProductLink,
  MenuStatus,
} from "@/features/menus/queries/menu.queries";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

function toSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(minor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    minor / 100,
  );
}

function statusClasses(status: MenuStatus) {
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700";
  if (status === "ARCHIVED") return "bg-slate-100 text-slate-500";
  return "bg-amber-50 text-amber-700";
}

type MenuManagementView = "menus" | "categories" | "products";

export function MenuManagementContent() {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const view: MenuManagementView =
    normalizedPathname === "/menu/overview/categories"
      ? "categories"
      : normalizedPathname === "/menu/items"
        ? "products"
        : "menus";
  const {
    business,
    location,
    isLoading: workspaceLoading,
    isError: workspaceError,
  } = useDashboardBusinessLocation();
  const businessId = business?.id ?? "";
  const locationId = location?.id ?? "";
  const menusQuery = useMenus(businessId, locationId);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const menuList = menusQuery.data ?? [];
  const resolvedMenuId = menuList.some((item) => item.id === selectedMenuId)
    ? selectedMenuId
    : (menuList[0]?.id ?? "");
  const menuQuery = useMenu(businessId, resolvedMenuId, locationId);
  const menu = menuQuery.data;
  const activeCategories = useMemo(
    () =>
      menu?.categories.filter(({ category }) => category.status === "ACTIVE") ??
      [],
    [menu?.categories],
  );

  const createMenuMutation = useCreateMenu(businessId, locationId);
  const updateMenuMutation = useUpdateMenu(businessId, resolvedMenuId);
  const statusMutation = useSetMenuStatus(businessId, resolvedMenuId);
  const createCategoryMutation = useCreateCategory(businessId, resolvedMenuId, locationId);
  const updateCategoryMutation = useUpdateCategory(businessId, resolvedMenuId);
  const removeCategoryMutation = useRemoveCategory(businessId, resolvedMenuId, locationId);
  const createProductMutation = useCreateProduct(businessId, resolvedMenuId, locationId);
  const updateProductMutation = useUpdateProduct(businessId, resolvedMenuId);
  const availabilityMutation = useUpdateProductAvailability(
    businessId,
    resolvedMenuId,
    locationId,
  );

  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuSlug, setNewMenuSlug] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categorySortOrder, setCategorySortOrder] = useState("0");
  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const resolvedProductCategoryId = activeCategories.some(
    ({ category }) => category.id === productCategoryId,
  )
    ? productCategoryId
    : (activeCategories[0]?.category.id ?? "");

  const mutationError = [
    createMenuMutation.error,
    updateMenuMutation.error,
    statusMutation.error,
    createCategoryMutation.error,
    updateCategoryMutation.error,
    removeCategoryMutation.error,
    createProductMutation.error,
    updateProductMutation.error,
    availabilityMutation.error,
  ].find(Boolean);

  async function submitNewMenu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = await createMenuMutation.mutateAsync({
      name: newMenuName.trim(),
      slug: newMenuSlug.trim(),
    });
    setSelectedMenuId(created.id);
    setNewMenuName("");
    setNewMenuSlug("");
  }

  async function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createCategoryMutation.mutateAsync({
      name: categoryName.trim(),
      slug: categorySlug.trim(),
      description: categoryDescription.trim() || undefined,
      sortOrder: Number(categorySortOrder),
    });
    setCategoryName("");
    setCategorySlug("");
    setCategoryDescription("");
    setCategorySortOrder("0");
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(productPrice);
    if (!Number.isFinite(amount) || amount < 0 || !resolvedProductCategoryId) return;
    await createProductMutation.mutateAsync({
      categoryId: resolvedProductCategoryId,
      name: productName.trim(),
      slug: productSlug.trim(),
      description: productDescription.trim() || undefined,
      basePriceMinor: Math.round(amount * 100),
    });
    setProductName("");
    setProductSlug("");
    setProductPrice("");
    setProductDescription("");
  }

  async function toggleProductVisibility(product: MenuProductLink) {
    await updateProductMutation.mutateAsync({
      productId: product.productId,
      values: { isVisible: !product.isVisible },
    });
  }

  async function changeCategoryStatus(
    categoryId: string,
    status: "ACTIVE" | "INACTIVE",
  ) {
    await updateCategoryMutation.mutateAsync({
      categoryId,
      values: { status },
    });
  }

  async function changeProductAvailability(product: MenuProductLink) {
    const available = product.product.availability[0]?.isAvailable ?? true;
    await availabilityMutation.mutateAsync({
      productId: product.productId,
      isAvailable: !available,
    });
  }

  const pageCopy = {
    menus: {
      title: "Menus",
      description: "Create, organize, and publish menus for this outlet.",
    },
    categories: {
      title: "Categories",
      description: "Organize each menu into clear sections for your customers.",
    },
    products: {
      title: "Products",
      description: "Manage menu items, prices, visibility, and availability.",
    },
  }[view];

  return (
    <div className="w-full space-y-6 p-5 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
            Menu workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            {pageCopy.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{pageCopy.description}</p>
        </div>
        {location ? (
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <span className="text-slate-500">Outlet</span>
            <span className="ml-2 font-semibold text-slate-800">
              {location.name}
            </span>
          </div>
        ) : null}
      </header>

      {workspaceError ? (
        <Alert tone="error">
          Could not load your business workspace or locations. Refresh and try
          again.
        </Alert>
      ) : null}
      {mutationError ? (
        <Alert tone="error">{mutationError.message}</Alert>
      ) : null}
      {menuQuery.error ? (
        <Alert tone="error">{menuQuery.error.message}</Alert>
      ) : null}

      {workspaceLoading || menusQuery.isLoading ? (
        <Panel>Loading menus…</Panel>
      ) : null}
      {!workspaceLoading && !workspaceError && !location ? (
        <Panel>
          <h2 className="font-semibold text-slate-900">Add an outlet first</h2>
          <p className="mt-1 text-sm text-slate-500">
            Menu management is organized by outlet. Create a location to get
            started.
          </p>
        </Panel>
      ) : null}

      {location && !workspaceLoading ? (
        <>
          {view === "menus" ? (
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
              <Panel>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-900">Menus</h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Only one menu can be published for this outlet at a time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => menusQuery.refetch()}
                    className={secondaryButtonClass}
                    aria-label="Refresh menus"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                {menusQuery.error ? (
                  <Alert tone="error">{menusQuery.error.message}</Alert>
                ) : null}
                {menuList.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {menuList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedMenuId(item.id)}
                        aria-pressed={resolvedMenuId === item.id}
                        className={`rounded-xl border p-3 text-left transition ${resolvedMenuId === item.id ? "border-orange-300 bg-orange-50/60" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-slate-900">
                            {item.name}
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusClasses(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-slate-500">
                          /{item.slug}
                        </span>
                        <span className="mt-2 block text-xs text-slate-500">
                          {item._count.categories} categories ·{" "}
                          {item._count.products} products
                        </span>
                      </button>
                    ))}
                  </div>
                ) : !menusQuery.isLoading ? (
                  <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    No menus yet. Create a draft menu to start building your
                    catalog.
                  </p>
                ) : null}
              </Panel>

              <Panel>
                <h2 className="font-semibold text-slate-900">Create a menu</h2>
                <form
                  onSubmit={submitNewMenu}
                  aria-busy={createMenuMutation.isPending}
                  className="mt-3 grid gap-3 sm:grid-cols-2"
                >
                  <label className="text-xs font-medium text-slate-600">
                    Name
                    <input
                      required
                      maxLength={100}
                      value={newMenuName}
                      onChange={(event) => {
                        setNewMenuName(event.target.value);
                        setNewMenuSlug(toSlug(event.target.value));
                      }}
                      className={inputClass}
                      placeholder="Dinner menu"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-600">
                    Slug
                    <input
                      required
                      maxLength={100}
                      pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                      value={newMenuSlug}
                      onChange={(event) =>
                        setNewMenuSlug(toSlug(event.target.value))
                      }
                      className={inputClass}
                      placeholder="dinner-menu"
                    />
                  </label>
                  <div className="sm:col-span-2">
                    <PendingSubmitButton
                      pending={createMenuMutation.isPending}
                      disabled={!newMenuName.trim() || !newMenuSlug}
                      label="Create draft"
                      pendingLabel="Creating menu…"
                    />
                  </div>
                </form>
              </Panel>
            </section>
          ) : (
            <Panel>
              <label className="block max-w-xl text-sm font-medium text-slate-700">
                Menu
                <select
                  value={resolvedMenuId}
                  onChange={(event) => setSelectedMenuId(event.target.value)}
                  className={inputClass}
                >
                  {menuList.length ? (
                    menuList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.status.toLowerCase()})
                      </option>
                    ))
                  ) : (
                    <option value="">No menus available</option>
                  )}
                </select>
              </label>
              {!menuList.length && !menusQuery.isLoading ? (
                <p className="mt-2 text-sm text-slate-500">
                  Create a menu first to manage its {view}.
                </p>
              ) : null}
            </Panel>
          )}

          {menu ? (
            <>
              {view === "menus" ? (
                <Panel>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClasses(menu.status)}`}
                      >
                        {menu.status}
                      </span>
                      <h2 className="mt-2 text-xl font-bold text-slate-950">
                        {menu.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-slate-500">
                        Menu URL slug: /{menu.slug}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={secondaryButtonClass}
                        onClick={() => setPreviewOpen((open) => !open)}
                      >
                        <Eye className="h-4 w-4" />
                        {previewOpen ? "Close preview" : "Preview"}
                      </button>
                      {menu.status !== "PUBLISHED" &&
                      menu.status !== "ARCHIVED" ? (
                        <button
                          type="button"
                          className={buttonClass}
                          disabled={statusMutation.isPending}
                          onClick={() => statusMutation.mutate("publish")}
                        >
                          <Send className="h-4 w-4" />
                          Publish
                        </button>
                      ) : null}
                      {menu.status !== "ARCHIVED" ? (
                        <button
                          type="button"
                          className={secondaryButtonClass}
                          disabled={statusMutation.isPending}
                          onClick={() => statusMutation.mutate("archive")}
                        >
                          <Archive className="h-4 w-4" />
                          Archive
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <MenuDetailsEditor
                    key={menu.id}
                    menu={menu}
                    busy={updateMenuMutation.isPending}
                    onSave={(values) => updateMenuMutation.mutate(values)}
                  />
                </Panel>
              ) : null}

              {view === "categories" ? (
                <section className="grid gap-5">
                  <Panel>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-slate-900">
                          Categories
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Organize the products shown on this menu.
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {menu.categories.length} total
                      </span>
                    </div>
                    <form
                      onSubmit={submitCategory}
                      aria-busy={createCategoryMutation.isPending}
                      className="mt-4 grid gap-2 sm:grid-cols-2"
                    >
                      <label className="text-xs font-medium text-slate-600">
                        Category name
                        <input
                          required
                          maxLength={100}
                          value={categoryName}
                          onChange={(event) => {
                            setCategoryName(event.target.value);
                            setCategorySlug(toSlug(event.target.value));
                          }}
                          className={inputClass}
                          placeholder="Small plates"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        Slug
                        <input
                          required
                          value={categorySlug}
                          onChange={(event) =>
                            setCategorySlug(toSlug(event.target.value))
                          }
                          className={inputClass}
                          placeholder="small-plates"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        Description
                        <input
                          maxLength={1000}
                          value={categoryDescription}
                          onChange={(event) =>
                            setCategoryDescription(event.target.value)
                          }
                          className={inputClass}
                          placeholder="Optional description"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        Display order
                        <input
                          type="number"
                          min="0"
                          max="10000"
                          value={categorySortOrder}
                          onChange={(event) =>
                            setCategorySortOrder(event.target.value)
                          }
                          className={inputClass}
                        />
                      </label>
                      <div className="sm:col-span-2">
                        <PendingSubmitButton
                          pending={createCategoryMutation.isPending}
                          disabled={!categoryName.trim() || !categorySlug}
                          label="Add category"
                          pendingLabel="Adding category…"
                        />
                      </div>
                    </form>
                    <div className="mt-4 divide-y divide-slate-100">
                      {menu.categories.length ? (
                        menu.categories.map((item) => (
                          <CategoryRow
                            key={item.id}
                            item={item}
                            onUpdate={(values) =>
                              updateCategoryMutation.mutate({
                                categoryId: item.categoryId,
                                values,
                              })
                            }
                            onStatus={(status) =>
                              changeCategoryStatus(item.categoryId, status)
                            }
                            onRemove={() =>
                              removeCategoryMutation.mutate(item.categoryId)
                            }
                            busy={
                              updateCategoryMutation.isPending ||
                              removeCategoryMutation.isPending
                            }
                          />
                        ))
                      ) : (
                        <p className="py-4 text-sm text-slate-500">
                          Add a category before adding products.
                        </p>
                      )}
                    </div>
                  </Panel>
                </section>
              ) : null}

              {view === "products" ? (
                <section className="grid gap-5">
                  <Panel>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-slate-900">
                          Products
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Prices are entered in rupees and stored in paise.
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {menu.products.length} total
                      </span>
                    </div>
                    <form
                      onSubmit={submitProduct}
                      aria-busy={createProductMutation.isPending}
                      className="mt-4 grid gap-3 sm:grid-cols-2"
                    >
                      <label className="text-xs font-medium text-slate-600">
                        Product name
                        <input
                          required
                          maxLength={120}
                          value={productName}
                          onChange={(event) => {
                            setProductName(event.target.value);
                            setProductSlug(toSlug(event.target.value));
                          }}
                          className={inputClass}
                          placeholder="Paneer tikka"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        Slug
                        <input
                          required
                          value={productSlug}
                          onChange={(event) =>
                            setProductSlug(toSlug(event.target.value))
                          }
                          className={inputClass}
                          placeholder="paneer-tikka"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        Category
                        <select
                          required
                          value={resolvedProductCategoryId}
                          onChange={(event) =>
                            setProductCategoryId(event.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Choose category</option>
                          {activeCategories.map(({ category }) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs font-medium text-slate-600">
                        Price (₹)
                        <input
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          value={productPrice}
                          onChange={(event) =>
                            setProductPrice(event.target.value)
                          }
                          className={inputClass}
                          placeholder="249.00"
                        />
                      </label>
                      <label className="text-xs font-medium text-slate-600 sm:col-span-2">
                        Description
                        <input
                          maxLength={2000}
                          value={productDescription}
                          onChange={(event) =>
                            setProductDescription(event.target.value)
                          }
                          className={inputClass}
                          placeholder="Optional description"
                        />
                      </label>
                      <div className="sm:col-span-2">
                        <PendingSubmitButton
                          pending={createProductMutation.isPending}
                          disabled={
                            !productName.trim() ||
                            !productSlug ||
                            !resolvedProductCategoryId ||
                            productPrice === ""
                          }
                          label="Add product"
                          pendingLabel="Adding product…"
                        />
                      </div>
                    </form>
                    <div className="mt-4 divide-y divide-slate-100">
                      {menu.products.length ? (
                        menu.products.map((item) => (
                          <ProductRow
                            key={item.id}
                            item={item}
                            categories={activeCategories.map(
                              ({ category }) => category,
                            )}
                            onSave={(values) =>
                              updateProductMutation.mutate({
                                productId: item.productId,
                                values,
                              })
                            }
                            onVisibility={() => toggleProductVisibility(item)}
                            onAvailability={() =>
                              changeProductAvailability(item)
                            }
                            onArchive={() =>
                              updateProductMutation.mutate({
                                productId: item.productId,
                                values: { status: "ARCHIVED" },
                              })
                            }
                          />
                        ))
                      ) : (
                        <p className="py-4 text-sm text-slate-500">
                          Products added to this menu will appear here.
                        </p>
                      )}
                    </div>
                  </Panel>
                </section>
              ) : null}

              {view === "menus" && previewOpen ? (
                <Panel>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                    <h2 className="font-semibold text-slate-900">
                      Menu preview
                    </h2>
                  </div>
                  <div className="mt-4 space-y-5">
                    {menu.categories
                      .filter(({ category }) => category.status === "ACTIVE")
                      .map(({ category }) => (
                        <section key={category.id}>
                          <h3 className="border-b border-slate-100 pb-2 text-sm font-bold text-slate-800">
                            {category.name}
                          </h3>
                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            {menu.products
                              .filter(
                                (product) =>
                                  product.product.category.id === category.id &&
                                  product.isVisible &&
                                  product.product.status === "ACTIVE",
                              )
                              .map((product) => (
                                <div
                                  key={product.id}
                                  className="flex justify-between gap-3 rounded-lg bg-slate-50 p-3"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                      {product.displayName ||
                                        product.product.name}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      {product.displayDescription ||
                                        product.product.description}
                                    </p>
                                  </div>
                                  <span className="shrink-0 text-sm font-semibold text-slate-900">
                                    {formatPrice(
                                      product.priceOverrideMinor ??
                                        product.product.basePriceMinor,
                                      product.product.currency,
                                    )}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </section>
                      ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    Public table links show the published menu. Availability and
                    visibility changes update the preview.
                  </p>
                </Panel>
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function CategoryRow({
  item,
  onUpdate,
  onStatus,
  onRemove,
  busy,
}: {
  item: MenuCategoryLink;
  onUpdate: (values: {
    name?: string;
    slug?: string;
    description?: string | null;
    sortOrder?: number;
  }) => void;
  onStatus: (status: "ACTIVE" | "INACTIVE") => void;
  onRemove: () => void;
  busy: boolean;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {item.category.name}
          </p>
          <p className="truncate text-xs text-slate-400">
            /{item.category.slug} · order {item.sortOrder} ·{" "}
            {item.category.status.toLowerCase()}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          {item.category.status !== "ARCHIVED" ? (
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={busy}
              onClick={() =>
                onStatus(
                  item.category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                )
              }
            >
              {item.category.status === "ACTIVE" ? "Pause" : "Activate"}
            </button>
          ) : null}
          {item.category.status !== "ARCHIVED" ? (
            <button
              type="button"
              className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
              disabled={busy}
              onClick={onRemove}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            onUpdate({
              name: String(values.get("name") || ""),
              slug: toSlug(String(values.get("slug") || "")),
              description:
                String(values.get("description") || "").trim() || null,
              sortOrder: Number(values.get("sortOrder")),
            });
            setEditing(false);
          }}
          className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-2"
        >
          <label className="text-xs text-slate-600">
            Name
            <input
              name="name"
              required
              defaultValue={item.category.name}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Slug
            <input
              name="slug"
              required
              defaultValue={item.category.slug}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Description
            <input
              name="description"
              defaultValue={item.category.description ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Display order
            <input
              name="sortOrder"
              type="number"
              min="0"
              max="10000"
              defaultValue={item.sortOrder}
              className={inputClass}
            />
          </label>
          <div className="sm:col-span-2">
            <button className={buttonClass} disabled={busy}>
              Save category
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function MenuDetailsEditor({
  menu,
  onSave,
  busy,
}: {
  menu: { id: string; name: string; slug: string; status: MenuStatus };
  onSave: (values: { name: string; slug: string }) => void;
  busy: boolean;
}) {
  const [name, setName] = useState(menu.name);
  const [slug, setSlug] = useState(menu.slug);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ name: name.trim(), slug: toSlug(slug) });
      }}
      className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <label className="text-xs font-medium text-slate-600">
        Menu name
        <input
          required
          maxLength={100}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (menu.status === "DRAFT") setSlug(toSlug(event.target.value));
          }}
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-slate-600">
        Slug
        <input
          required
          maxLength={100}
          value={slug}
          onChange={(event) => setSlug(toSlug(event.target.value))}
          className={inputClass}
        />
      </label>
      <button className={secondaryButtonClass} disabled={busy}>
        Save details
      </button>
    </form>
  );
}

function ProductRow({
  item,
  categories,
  onSave,
  onVisibility,
  onAvailability,
  onArchive,
}: {
  item: MenuProductLink;
  categories: MenuCategoryLink["category"][];
  onSave: (values: Record<string, unknown>) => void;
  onVisibility: () => void;
  onAvailability: () => void;
  onArchive: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const available = item.product.availability[0]?.isAvailable ?? true;
  const archived = item.product.status === "ARCHIVED";
  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {item.displayName || item.product.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {item.product.category.name} ·{" "}
            {formatPrice(
              item.priceOverrideMinor ?? item.product.basePriceMinor,
              item.product.currency,
            )}{" "}
            · {item.product.status.toLowerCase()}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={onAvailability}
            disabled={archived}
          >
            {available ? "Available" : "Sold out"}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={onVisibility}
            disabled={archived}
          >
            {item.isVisible ? "Visible" : "Hidden"}
          </button>
          {!archived ? (
            <button
              type="button"
              className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
              onClick={onArchive}
            >
              Archive
            </button>
          ) : null}
        </div>
      </div>
      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            const priceOverride = String(
              values.get("priceOverride") || "",
            ).trim();
            onSave({
              name: String(values.get("name") || "").trim(),
              slug: toSlug(String(values.get("slug") || "")),
              categoryId: String(values.get("categoryId") || ""),
              description:
                String(values.get("description") || "").trim() || null,
              imageUrl: String(values.get("imageUrl") || "").trim() || null,
              basePriceMinor: Math.round(Number(values.get("basePrice")) * 100),
              displayName:
                String(values.get("displayName") || "").trim() || null,
              displayDescription:
                String(values.get("displayDescription") || "").trim() || null,
              priceOverrideMinor: priceOverride
                ? Math.round(Number(priceOverride) * 100)
                : null,
              sortOrder: Number(values.get("sortOrder")),
              status: String(values.get("status")),
            });
            setEditing(false);
          }}
          className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-2"
        >
          <label className="text-xs text-slate-600">
            Product name
            <input
              name="name"
              required
              defaultValue={item.product.name}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Slug
            <input
              name="slug"
              required
              defaultValue={item.product.slug}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Category
            <select
              name="categoryId"
              defaultValue={item.product.category.id}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-600">
            Base price (₹)
            <input
              name="basePrice"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={(item.product.basePriceMinor / 100).toFixed(2)}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Description
            <input
              name="description"
              defaultValue={item.product.description ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Image URL
            <input
              name="imageUrl"
              type="url"
              defaultValue={item.product.imageUrl ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Menu display name
            <input
              name="displayName"
              defaultValue={item.displayName ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Menu display description
            <input
              name="displayDescription"
              defaultValue={item.displayDescription ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Menu price override (₹)
            <input
              name="priceOverride"
              type="number"
              min="0"
              step="0.01"
              defaultValue={
                item.priceOverrideMinor === null
                  ? ""
                  : (item.priceOverrideMinor / 100).toFixed(2)
              }
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Display order
            <input
              name="sortOrder"
              type="number"
              min="0"
              max="10000"
              defaultValue={item.sortOrder}
              className={inputClass}
            />
          </label>
          <label className="text-xs text-slate-600">
            Product status
            <select
              name="status"
              defaultValue={item.product.status}
              className={inputClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <button className={buttonClass}>Save product</button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function PendingSubmitButton({
  pending,
  disabled,
  label,
  pendingLabel,
}: {
  pending: boolean;
  disabled?: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <button
      type="submit"
      className={buttonClass}
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Plus className="h-4 w-4" aria-hidden="true" />
      )}
      <span aria-live="polite">{pending ? pendingLabel : label}</span>
    </button>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      {children}
    </section>
  );
}

function Alert({ children, tone }: { children: ReactNode; tone: "error" }) {
  return (
    <div
      role="alert"
      className={
        tone === "error"
          ? "rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          : ""
      }
    >
      {children}
    </div>
  );
}
