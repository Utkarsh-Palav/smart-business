"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLocation,
  createTable,
  getLocationsByBusinessId,
  getTables,
  updateLocation,
  updateTable,
} from "./location.queries";

export function locationQueryKey(businessId: string) {
  return ["locations", businessId] as const;
}

export function tablesQueryKey(businessId: string, locationId: string) {
  return ["locations", businessId, locationId, "tables"] as const;
}

export function useLocations(businessId: string) {
  return useQuery({
    queryKey: locationQueryKey(businessId),
    queryFn: () => getLocationsByBusinessId(businessId),
    enabled: Boolean(businessId),
  });
}

export function useTables(businessId: string, locationId: string) {
  return useQuery({
    queryKey: tablesQueryKey(businessId, locationId),
    queryFn: () => getTables(businessId, locationId),
    enabled: Boolean(businessId && locationId),
  });
}

export function useCreateLocation(businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof createLocation>[1]) => createLocation(businessId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: locationQueryKey(businessId) }),
  });
}

export function useUpdateLocation(businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ locationId, input }: { locationId: string; input: Parameters<typeof updateLocation>[2] }) => updateLocation(businessId, locationId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: locationQueryKey(businessId) }),
  });
}

export function useCreateTable(businessId: string, locationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof createTable>[2]) => createTable(businessId, locationId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tablesQueryKey(businessId, locationId) }),
  });
}

export function useUpdateTable(businessId: string, locationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, input }: { tableId: string; input: Parameters<typeof updateTable>[3] }) => updateTable(businessId, locationId, tableId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tablesQueryKey(businessId, locationId) }),
  });
}
