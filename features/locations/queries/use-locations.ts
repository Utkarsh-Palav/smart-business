"use client";

import { useQuery } from "@tanstack/react-query";
import { getLocationsByBusinessId } from "./location.queries";
import { boolean } from "zod";

export function locationQueryKey(businessId: string) {
  return ["locations", businessId] as const;
}

export function useLocations(businessId: string) {
  return useQuery({
    queryKey: locationQueryKey(businessId),
    queryFn: () => getLocationsByBusinessId(businessId),
    enabled: Boolean(businessId),
  });
}
