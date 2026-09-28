"use client";

import { use } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  CreditCard,
  MapPin,
} from "lucide-react";

import { useBusiness } from "@/features/businesses/queries/use-businesses";
import { useLocations } from "@/features/locations/queries/use-locations";

type BusinessPageProps = {
  params: Promise<{
    businessId: string;
  }>;
};

export default function BusinessDetailsPage({
  params,
}: BusinessPageProps) {
  const { businessId } = use(params);

  const {
    data: business,
    isLoading,
    isError,
    error,
  } = useBusiness(businessId);

  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
  } = useLocations(businessId);

  /*
   * ------------------------------------------------------------
   * Business loading state
   * ------------------------------------------------------------
   */
  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header skeleton */}
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />

          {/* Statistics skeleton */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl border bg-card"
              />
            ))}
          </div>

          {/* Locations skeleton */}
          <div className="mt-8">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />

            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-xl border bg-card"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * Business error / not found state
   * ------------------------------------------------------------
   */
  if (isError || !business) {
    return (
      <div className="p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard/businesses"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to businesses
          </Link>

          <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <h1 className="font-semibold">
              Unable to load business
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Business not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * Main Business Details UI
   * ------------------------------------------------------------
   */
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================================
            Back navigation
            ====================================================== */}
        <Link
          href="/dashboard/businesses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Businesses
        </Link>

        {/* ======================================================
            Business Header
            ====================================================== */}
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            {/* Business icon */}
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Building2 className="size-6 text-muted-foreground" />
            </div>

            {/* Business information */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {business.name}
                </h1>

                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {business.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                /{business.slug}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            Business Statistics
            ====================================================== */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {/* Locations */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <MapPin className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Locations
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {business._count.locations}
                </p>
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Review Cards
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {business._count.reviewCards}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <p className="mt-2 text-lg font-semibold">
              {business.status}
            </p>
          </div>
        </div>

        {/* ======================================================
            Locations Section
            ====================================================== */}
        <section className="mt-10">
          {/* Locations header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Locations
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage locations belonging to this business.
              </p>
            </div>

            <Link
              href={`/dashboard/businesses/${businessId}/locations/new`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add Location
            </Link>
          </div>

          {/* ====================================================
              Locations Content
              ==================================================== */}
          <div className="mt-6">
            {/* Loading */}
            {isLocationsLoading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-xl border bg-card"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!isLocationsLoading && isLocationsError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="font-medium">
                  Unable to load locations
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Something went wrong while loading the
                  locations for this business.
                </p>
              </div>
            )}

            {/* Empty state */}
            {!isLocationsLoading &&
              !isLocationsError &&
              (!locations || locations.length === 0) && (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="size-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold">
                    No locations yet
                  </h3>

                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Add the first location for this business
                    to start managing its operations.
                  </p>

                  <Link
                    href={`/dashboard/businesses/${businessId}/locations/new`}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Add Location
                  </Link>
                </div>
              )}

            {/* Locations list */}
            {!isLocationsLoading &&
              !isLocationsError &&
              locations &&
              locations.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Location information */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                              <MapPin className="size-4 text-muted-foreground" />
                            </div>

                            <h3 className="truncate font-medium">
                              {location.name}
                            </h3>
                          </div>

                          <p className="mt-3 text-sm text-muted-foreground">
                            /{location.slug}
                          </p>
                        </div>

                        {/* Status */}
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                            location.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {location.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section>
      </div>
    </div>
  );
}