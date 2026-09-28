"use client";

import { useQuery } from "@tanstack/react-query";
import { getBusinessById, getBusinesses } from "./business.queries";

export const businessQueryKey = ["businesses"];

export function useBusinesses() {
  return useQuery({
    queryKey: businessQueryKey,
    queryFn: getBusinesses,
  });
}

export function businessDetailQueryKey(businessId: string) {
  return ["business", businessId] as const;
}

export function useBusiness(businessId: string) {
  return useQuery({
    queryKey: businessDetailQueryKey(businessId),
    queryFn: () => getBusinessById(businessId),
    enabled: Boolean(businessId),
  });
}
