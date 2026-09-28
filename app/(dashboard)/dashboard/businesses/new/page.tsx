"use client";

import { businessQueryKey } from "@/features/businesses/queries/use-businesses";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewBusinessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      setError("Business name is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Business slug is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          slug: trimmedSlug,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const message = result?.error || "Failed to create business.";

        throw new Error(message);
      }

      await queryClient.invalidateQueries({
        queryKey: businessQueryKey,
      });

      router.push("/dashboard/businesses");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create business.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          href="/dashboard/businesses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to businesses
        </Link>

        {/* Header */}
        <div className="mt-6">
          <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
            <Building2 className="size-5 text-muted-foreground" />
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Create Business
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a business to start managing its locations and review cards.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border bg-card p-6"
        >
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="business-name" className="text-sm font-medium">
                Business Name
              </label>

              <input
                id="business-name"
                type="text"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Munchy Krunchy"
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label htmlFor="business-slug" className="text-sm font-medium">
                Slug
              </label>

              <input
                id="business-slug"
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                placeholder="munchy-krunchy"
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and hyphens.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/businesses"
                className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}

                {isSubmitting ? "Creating..." : "Create Business"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
