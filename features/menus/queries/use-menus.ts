"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createMenu,
  createProduct,
  getMenu,
  getMenus,
  setMenuStatus,
  updateProduct,
  updateProductAvailability,
  updateMenu,
  updateCategory,
  removeCategoryFromMenu,
} from "./menu.queries";
import type { CreateProductInput, MenuDetail, MenuProductLink, MenuSummary } from "./menu.queries";

export function menuListKey(businessId: string, locationId: string) {
  return ["menus", businessId, locationId] as const;
}

export function menuDetailKey(businessId: string, menuId: string, locationId?: string) {
  return locationId
    ? (["menu", businessId, menuId, locationId] as const)
    : (["menu", businessId, menuId] as const);
}

function useMenuMutation<TInput>(businessId: string, menuId: string, mutationFn: (input: TInput) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuDetailKey(businessId, menuId) });
    },
  });
}

export function useMenus(businessId: string, locationId: string) {
  return useQuery({
    queryKey: menuListKey(businessId, locationId),
    queryFn: () => getMenus(businessId, locationId),
    enabled: Boolean(businessId && locationId),
    staleTime: 20_000,
  });
}

export function useMenu(businessId: string, menuId: string, locationId: string) {
  return useQuery({
    queryKey: menuDetailKey(businessId, menuId, locationId),
    queryFn: () => getMenu(businessId, menuId, locationId),
    enabled: Boolean(businessId && menuId && locationId),
    staleTime: 20_000,
  });
}

export function useCreateMenu(businessId: string, locationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; slug: string }) => createMenu(businessId, locationId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuListKey(businessId, locationId) });
    },
  });
}

export function useUpdateMenu(businessId: string, menuId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name?: string; slug?: string }) => updateMenu(businessId, menuId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuDetailKey(businessId, menuId) });
      void queryClient.invalidateQueries({ queryKey: ["menus", businessId] });
    },
  });
}

export function useSetMenuStatus(businessId: string, menuId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: "publish" | "archive") => setMenuStatus(businessId, menuId, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: menuDetailKey(businessId, menuId) });
      void queryClient.invalidateQueries({ queryKey: ["menus", businessId] });
    },
  });
}

export function useCreateCategory(businessId: string, menuId: string, locationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof createCategory>[2]) => createCategory(businessId, menuId, input),
    onSuccess: () => {
      queryClient.setQueryData<MenuSummary[]>(menuListKey(businessId, locationId), (menus) =>
        menus?.map((menu) => menu.id === menuId
          ? { ...menu, _count: { ...menu._count, categories: menu._count.categories + 1 } }
          : menu),
      );
      void queryClient.invalidateQueries({ queryKey: menuDetailKey(businessId, menuId) });
    },
  });
}

export function useUpdateCategory(businessId: string, menuId: string) {
  return useMenuMutation(businessId, menuId, (input: { categoryId: string; values: Parameters<typeof updateCategory>[3] }) => updateCategory(businessId, menuId, input.categoryId, input.values));
}

export function useRemoveCategory(businessId: string, menuId: string, locationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => removeCategoryFromMenu(businessId, menuId, categoryId),
    onSuccess: () => {
      queryClient.setQueryData<MenuSummary[]>(menuListKey(businessId, locationId), (menus) =>
        menus?.map((menu) => menu.id === menuId
          ? { ...menu, _count: { ...menu._count, categories: Math.max(0, menu._count.categories - 1) } }
          : menu),
      );
      void queryClient.invalidateQueries({ queryKey: menuDetailKey(businessId, menuId) });
    },
  });
}

export function useCreateProduct(businessId: string, menuId: string, locationId: string) {
  const queryClient = useQueryClient();
  const detailKey = menuDetailKey(businessId, menuId, locationId);
  const listKey = menuListKey(businessId, locationId);

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(businessId, menuId, input),
    onMutate: async (input) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: listKey }),
      ]);

      const previousDetail = queryClient.getQueryData<MenuDetail>(detailKey);
      const previousMenus = queryClient.getQueryData<MenuSummary[]>(listKey);
      const category = previousDetail?.categories.find(
        (entry) => entry.categoryId === input.categoryId,
      )?.category;

      if (previousDetail && category) {
        const pendingId = `pending-${Date.now()}`;
        const optimisticProduct: MenuProductLink = {
          id: pendingId,
          menuId,
          productId: pendingId,
          displayName: input.displayName ?? null,
          displayDescription: input.displayDescription ?? null,
          sortOrder: input.sortOrder ?? previousDetail.products.length,
          isVisible: input.isVisible ?? true,
          priceOverrideMinor: input.priceOverrideMinor ?? null,
          product: {
            id: pendingId,
            name: input.name,
            slug: input.slug,
            description: input.description ?? null,
            sku: input.sku ?? null,
            imageUrl: input.imageUrl ?? null,
            basePriceMinor: input.basePriceMinor,
            currency: input.currency ?? "INR",
            status: "ACTIVE",
            category,
            availability: [{
              locationId,
              isAvailable: true,
              priceOverrideMinor: null,
            }],
          },
        };

        queryClient.setQueryData<MenuDetail>(detailKey, {
          ...previousDetail,
          products: [...previousDetail.products, optimisticProduct],
          _count: { ...previousDetail._count, products: previousDetail._count.products + 1 },
        });
      }

      if (previousMenus) {
        queryClient.setQueryData<MenuSummary[]>(listKey, previousMenus.map((menu) =>
          menu.id === menuId
            ? { ...menu, _count: { ...menu._count, products: menu._count.products + 1 } }
            : menu,
        ));
      }

      return { previousDetail, previousMenus };
    },
    onError: (_error, _input, snapshot) => {
      if (snapshot?.previousDetail) queryClient.setQueryData(detailKey, snapshot.previousDetail);
      if (snapshot?.previousMenus) queryClient.setQueryData(listKey, snapshot.previousMenus);
    },
    onSuccess: () => {
      // Reconcile the optimistic row with the database generated IDs in the background.
      void queryClient.invalidateQueries({ queryKey: detailKey });
    },
  });
}

export function useUpdateProduct(businessId: string, menuId: string) {
  return useMenuMutation(businessId, menuId, (input: { productId: string; values: Record<string, unknown> }) => updateProduct(businessId, input.productId, menuId, input.values));
}

export function useUpdateProductAvailability(businessId: string, menuId: string, locationId: string) {
  return useMenuMutation(businessId, menuId, (input: { productId: string; isAvailable: boolean }) => updateProductAvailability(businessId, input.productId, { menuId, locationId, isAvailable: input.isAvailable }));
}
