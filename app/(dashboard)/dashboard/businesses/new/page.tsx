"use client";

import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: () => void;
      modal: { ondismiss: () => void };
    }) => { open: () => void };
  }
}

type PlanPrice = {
  id: string;
  currency: string;
  amountMinor: number;
  interval: "MONTH" | "YEAR";
  intervalCount: number;
  unit: "BUSINESS" | "LOCATION";
  priceType: "FIXED" | "STARTING_AT";
};

type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  prices: PlanPrice[];
};

export default function NewBusinessPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [businessType, setBusinessType] = useState("CAFE");
  const [legalName, setLegalName] = useState("");
  const [gstin, setGstin] = useState("");
  const [firstLocationName, setFirstLocationName] = useState("");
  const [firstLocationSlug, setFirstLocationSlug] = useState("");
  const [operatingMode, setOperatingMode] = useState("DINE_IN");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanPriceId, setSelectedPlanPriceId] = useState("");
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      try {
        const response = await fetch("/api/plans");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result?.error?.message || "Unable to load plans.");
        }

        if (isMounted) {
          setPlans(result.data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load plans.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlans(false);
        }
      }
    }

    void loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

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
    if (!firstLocationName) {
      setFirstLocationName(value);
    }
  }

  function handleFirstLocationNameChange(value: string) {
    setFirstLocationName(value);
    if (!firstLocationSlug) {
      setFirstLocationSlug(
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

    if (!selectedPlanPriceId) {
      setError("Select a plan before continuing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/onboarding/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          slug: trimmedSlug,
          businessType,
          legalName: legalName.trim() || undefined,
          gstin: gstin.trim().toUpperCase() || undefined,
          firstLocation: {
            name: firstLocationName.trim(),
            slug: firstLocationSlug.trim(),
            operatingMode,
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2.trim() || undefined,
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            phone: phone.trim() || undefined,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const message = result?.error?.message || "Failed to save onboarding.";

        throw new Error(message);
      }

      const planResponse = await fetch(`/api/onboarding/drafts/${result.data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planPriceId: selectedPlanPriceId }),
      });
      const planResult = await planResponse.json();

      if (!planResponse.ok || !planResult.success) {
        throw new Error(
          planResult?.error?.message || "Failed to select onboarding plan.",
        );
      }

      setSavedDraftId(result.data.id);

      const checkoutResponse = await fetch(
        `/api/onboarding/drafts/${result.data.id}/checkout`,
        { method: "POST" },
      );
      const checkoutResult = await checkoutResponse.json();

      if (!checkoutResponse.ok || !checkoutResult.success) {
        throw new Error(
          checkoutResult?.error?.message || "Unable to start payment checkout.",
        );
      }

      if (!window.Razorpay || !isRazorpayReady) {
        throw new Error(
          "Payment checkout is still loading. Please try again in a moment.",
        );
      }

      const razorpay = new window.Razorpay({
        key: checkoutResult.data.keyId,
        amount: checkoutResult.data.amountMinor,
        currency: checkoutResult.data.currency,
        name: "Smart Business",
        description: "Restaurant onboarding",
        order_id: checkoutResult.data.orderId,
        handler: () => {
          setError(
            "Payment submitted. We are waiting for secure confirmation from Razorpay.",
          );
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      });

      razorpay.open();
      return;

    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save onboarding.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayReady(true)}
      />
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
          <div className="space-y-8">
            <fieldset className="space-y-5">
              <legend className="text-base font-semibold">Business details</legend>

            <div className="space-y-2">
              <label htmlFor="business-name" className="text-sm font-medium">
                Business display name
              </label>

              <input
                id="business-name"
                type="text"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Palav's Restaurants"
                required
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="business-type" className="text-sm font-medium">
                Business type
              </label>
              <select
                id="business-type"
                value={businessType}
                onChange={(event) => setBusinessType(event.target.value)}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="CAFE">Cafe</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="QSR">Quick service restaurant</option>
                <option value="CLOUD_KITCHEN">Cloud kitchen</option>
                <option value="BAKERY">Bakery</option>
                <option value="FOOD_TRUCK">Food truck</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="legal-name" className="text-sm font-medium">
                  Legal name <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="legal-name"
                  type="text"
                  value={legalName}
                  onChange={(event) => setLegalName(event.target.value)}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gstin" className="text-sm font-medium">
                  GSTIN <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="gstin"
                  type="text"
                  value={gstin}
                  onChange={(event) => setGstin(event.target.value.toUpperCase())}
                  maxLength={15}
                  autoCapitalize="characters"
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm uppercase outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
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
                required
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and hyphens.
              </p>
            </div>
            </fieldset>

            <fieldset className="space-y-5 border-t pt-6">
              <legend className="px-1 text-base font-semibold">First outlet</legend>

              <div className="space-y-2">
                <label htmlFor="outlet-name" className="text-sm font-medium">
                  Outlet name
                </label>
                <input
                  id="outlet-name"
                  type="text"
                  value={firstLocationName}
                  onChange={(event) =>
                    handleFirstLocationNameChange(event.target.value)
                  }
                  placeholder="Palav's Andheri"
                  required
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="outlet-slug" className="text-sm font-medium">
                    Outlet slug
                  </label>
                  <input
                    id="outlet-slug"
                    type="text"
                    value={firstLocationSlug}
                    onChange={(event) =>
                      setFirstLocationSlug(
                        event.target.value.toLowerCase().replace(/\s+/g, "-"),
                      )
                    }
                    required
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="operating-mode" className="text-sm font-medium">
                    Outlet operating mode
                  </label>
                  <select
                    id="operating-mode"
                    value={operatingMode}
                    onChange={(event) => setOperatingMode(event.target.value)}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="DINE_IN">Dine-in</option>
                    <option value="TAKEAWAY">Takeaway</option>
                    <option value="DELIVERY_ONLY">Delivery only</option>
                    <option value="HYBRID">Dine-in and takeaway/delivery</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address-line-1" className="text-sm font-medium">
                  Street address
                </label>
                <input
                  id="address-line-1"
                  type="text"
                  value={addressLine1}
                  onChange={(event) => setAddressLine1(event.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address-line-2" className="text-sm font-medium">
                  Address line 2 <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="address-line-2"
                  type="text"
                  value={addressLine2}
                  onChange={(event) => setAddressLine2(event.target.value)}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">State</label>
                  <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="postal-code" className="text-sm font-medium">PIN code</label>
                  <input
                    id="postal-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="outlet-phone" className="text-sm font-medium">
                    Outlet phone <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="outlet-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-5 border-t pt-6">
              <legend className="px-1 text-base font-semibold">Choose a plan</legend>
              <p className="text-sm text-muted-foreground">
                Your details will be saved as an onboarding draft. Payment and tenant setup happen after Razorpay checkout is connected.
              </p>
              <select
                id="plan-price"
                value={selectedPlanPriceId}
                onChange={(event) => setSelectedPlanPriceId(event.target.value)}
                disabled={isSubmitting || isLoadingPlans}
                required
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {isLoadingPlans ? "Loading plans..." : "Select a plan"}
                </option>
                {plans.flatMap((plan) =>
                  plan.prices.map((price) => (
                    <option key={price.id} value={price.id}>
                      {plan.name} - {price.priceType === "STARTING_AT" ? "Starting at " : ""}
                      {(price.amountMinor / 100).toLocaleString("en-IN", {
                        style: "currency",
                        currency: price.currency,
                        maximumFractionDigits: 0,
                      })} / {price.interval.toLowerCase()} per {price.unit.toLowerCase()}
                    </option>
                  )),
                )}
              </select>
            </fieldset>

            {savedDraftId && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
                Onboarding draft saved. Draft ID: {savedDraftId}. Razorpay checkout will be the next step.
              </div>
            )}

            {/* Error */}
            {error && (
              <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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

                {isSubmitting ? "Saving..." : "Save and continue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
