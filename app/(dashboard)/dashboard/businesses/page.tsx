"use client";

import Link from "next/link";
import { Building2, MapPin, Plus, Star } from "lucide-react";
import { useBusinesses } from "@/features/businesses/queries/use-businesses";

export default function BusinessesPage() {
  const { data: businesses = [], isLoading, isError, error } = useBusinesses();

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Businesses
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your businesses and their locations.
            </p>
          </div>
          <Link
            href="/dashboard/businesses/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New Business
          </Link>
        </div>

        {isLoading && (
          <div className="mt-8 grid gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl border bg-card"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <h2 className="font-medium">Unable to load businesses</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>
          </div>
        )}

        {!isLoading && !isError && businesses.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">No businesses yet</h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Create your first business to start managing locations and review
              cards.
            </p>

            <Link
              href="/dashboard/businesses/new"
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Create Business
            </Link>
          </div>
        )}

        {!isLoading && !isError && businesses.length > 0 && (
          <div className="mt-8 grid gap-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="size-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-semibold">
                          {business.name}
                        </h2>

                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {business.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        /{business.slug}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/businesses/${business.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View details
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <MapPin className="size-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Locations</p>

                      <p className="text-sm font-medium">
                        {business._count.locations}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <Star className="size-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Review Cards
                      </p>

                      <p className="text-sm font-medium">
                        {business._count.reviewCards}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
