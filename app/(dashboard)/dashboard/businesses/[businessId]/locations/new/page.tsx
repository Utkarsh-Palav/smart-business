"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  Loader2,
  MapPin,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

import {
  locationQueryKey,
} from "@/features/locations/queries/use-locations";

type LocationPageProps = {
  params: Promise<{
    businessId: string;
  }>;
};

type CreateLocationResponse = {
  success: boolean;
  data?: {
    id: string;
    businessId: string;
    name: string;
    slug: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
  issues?: unknown;
};

export default function NewLocationPage({
  params,
}: LocationPageProps) {
  const { businessId } = use(params);

  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * ------------------------------------------------------------
   * Automatically generate slug from location name
   * ------------------------------------------------------------
   */
  function handleNameChange(value: string) {
    setName(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setSlug(generatedSlug);
  }

  /*
   * ------------------------------------------------------------
   * Submit
   * ------------------------------------------------------------
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    /*
     * Client-side validation
     */
    if (trimmedName.length < 2) {
      setError(
        "Location name must be at least 2 characters.",
      );
      return;
    }

    if (trimmedSlug.length < 2) {
      setError(
        "Location slug must be at least 2 characters.",
      );
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      setError(
        "Slug can only contain lowercase letters, numbers, and hyphens.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          name: trimmedName,
          slug: trimmedSlug,
        }),
      });

      const result: CreateLocationResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to create location.",
        );
      }

      /*
       * Invalidate the locations query for this business.
       *
       * When Business Details is opened again,
       * TanStack Query will fetch the latest locations.
       */
      await queryClient.invalidateQueries({
        queryKey: locationQueryKey(businessId),
      });

      /*
       * Return to Business Details
       */
      router.push(
        `/dashboard/businesses/${businessId}`,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create location.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        {/* ====================================================
            Back navigation
            ==================================================== */}
        <Link
          href={`/dashboard/businesses/${businessId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to business
        </Link>

        {/* ====================================================
            Page Header
            ==================================================== */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <MapPin className="size-5 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Add Location
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a new location to this business.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            Form
            ==================================================== */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border bg-card p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* ==================================================
                Location Name
                ================================================== */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Location Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                placeholder="e.g. Kashi Nagar"
                disabled={isSubmitting}
                autoComplete="off"
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="text-xs text-muted-foreground">
                The name your team will use to identify this
                location.
              </p>
            </div>

            {/* ==================================================
                Location Slug
                ================================================== */}
            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-sm font-medium"
              >
                Slug
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-"),
                  )
                }
                placeholder="e.g. kashi-nagar"
                disabled={isSubmitting}
                autoComplete="off"
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="text-xs text-muted-foreground">
                Lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            {/* ==================================================
                Error
                ================================================== */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
              >
                <p className="text-sm font-medium text-destructive">
                  {error}
                </p>
              </div>
            )}

            {/* ==================================================
                Actions
                ================================================== */}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Link
                href={`/dashboard/businesses/${businessId}`}
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                {isSubmitting
                  ? "Creating..."
                  : "Create Location"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}