"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Business } from "@/features/businesses/queries/business.queries";
import type { Location } from "@/features/locations/queries/location.queries";
import { useBusinesses } from "@/features/businesses/queries/use-businesses";
import { useLocations } from "@/features/locations/queries/use-locations";

const STORAGE_KEY = "smart-business.dashboard-selection";

type DashboardSelectionContextValue = {
  businesses: Business[];
  business: Business | null;
  locations: Location[];
  location: Location | null;
  businessId: string | null;
  locationId: string | null;
  isLoading: boolean;
  isError: boolean;
  selectBusiness: (businessId: string) => void;
  selectLocation: (locationId: string) => void;
};

const DashboardSelectionContext = createContext<DashboardSelectionContextValue | null>(null);

export function BusinessLocationProvider({ children }: { children: ReactNode }) {
  const { data: businesses, isLoading: businessesLoading, isError: businessesError } = useBusinesses();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const businessList = businesses ?? [];

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { businessId?: unknown; locationId?: unknown };
        if (typeof parsed.businessId === "string") setBusinessId(parsed.businessId);
        if (typeof parsed.locationId === "string") setLocationId(parsed.locationId);
      }
    } catch {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Local storage can be disabled by the browser.
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || businessesLoading || businessList.length === 0) return;
    if (!businessList.some((business) => business.id === businessId)) {
      setBusinessId(businessList[0].id);
      setLocationId(null);
    }
  }, [businessId, businessList, businessesLoading, isHydrated]);

  const business = businessList.find((item) => item.id === businessId) ?? null;
  const { data: locations, isLoading: locationsLoading, isError: locationsError } = useLocations(business?.id ?? "");
  const locationList = locations ?? [];
  const location = locationList.find((item) => item.id === locationId) ?? locationList[0] ?? null;

  useEffect(() => {
    if (!isHydrated || !business || locationsLoading || locationsError) return;
    if (locationId !== (location?.id ?? null)) setLocationId(location?.id ?? null);
  }, [business, isHydrated, location, locationId, locationsError, locationsLoading]);

  useEffect(() => {
    if (!isHydrated || !business || locationsLoading || locationsError) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ businessId: business.id, locationId: location?.id ?? null }));
    } catch {
      // The current selection remains usable even if storage is unavailable.
    }
  }, [business, isHydrated, location, locationsError, locationsLoading]);

  const selectBusiness = useCallback((nextBusinessId: string) => {
    if (!businessList.some((item) => item.id === nextBusinessId)) return;
    setBusinessId(nextBusinessId);
    setLocationId(null);
  }, [businessList]);

  const selectLocation = useCallback((nextLocationId: string) => {
    if (!locationList.some((item) => item.id === nextLocationId)) return;
    setLocationId(nextLocationId);
  }, [locationList]);

  const value = useMemo<DashboardSelectionContextValue>(() => ({
    businesses: businessList,
    business,
    locations: locationList,
    location,
    businessId: business?.id ?? null,
    locationId: location?.id ?? null,
    isLoading: businessesLoading || !isHydrated || Boolean(business && locationsLoading),
    isError: businessesError || locationsError,
    selectBusiness,
    selectLocation,
  }), [business, businessList, businessesError, businessesLoading, isHydrated, location, locationList, locationsError, locationsLoading, selectBusiness, selectLocation]);

  return <DashboardSelectionContext.Provider value={value}>{children}</DashboardSelectionContext.Provider>;
}

export function useDashboardBusinessLocation() {
  const context = useContext(DashboardSelectionContext);
  if (!context) throw new Error("useDashboardBusinessLocation must be used inside BusinessLocationProvider.");
  return context;
}
