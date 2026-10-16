"use client";

import {
  Building2,
  Check,
  CircleAlert,
  FileText,
  ImagePlus,
  Hash,
  MapPin,
  Pencil,
  Save,
  X,
  Store,
  Camera,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import type { Business } from "@/features/businesses/queries/business.queries";
import { useDashboardBusinessLocation } from "@/components/dashboard/BusinessLocationProvider";
import { SettingsSection } from "./SettingsSection";

type ProfileForm = {
  name: string;
  slug: string;
  legalName: string;
  businessType: string;
  gstin: string;
};

const businessTypes = [
  { value: "CAFE", label: "Cafe & Bistro" },
  { value: "RESTAURANT", label: "Dine-in Restaurant" },
  { value: "QSR", label: "Quick Service Restaurant (QSR)" },
  { value: "CLOUD_KITCHEN", label: "Cloud Kitchen / Ghost Kitchen" },
  { value: "BAKERY", label: "Bakery & Patisserie" },
  { value: "FOOD_TRUCK", label: "Food Truck" },
  { value: "OTHER", label: "Other Food Business" },
];

function getInitialForm(business: {
  name: string;
  slug: string;
  legalName: string | null;
  businessType: string;
  gstin: string | null;
}): ProfileForm {
  return {
    name: business.name,
    slug: business.slug,
    legalName: business.legalName ?? "",
    businessType: business.businessType,
    gstin: business.gstin ?? "",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function Field({
  label,
  hint,
  icon: Icon,
  children,
}: {
  label: string;
  hint?: string;
  icon: typeof Building2;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
        {label}
      </span>
      {hint ? <span className="mt-1 block text-[11px] text-slate-400">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#FF5B2E] focus:ring-4 focus:ring-[#FF5B2E]/10 disabled:cursor-not-allowed disabled:bg-slate-50/70 disabled:text-slate-500 font-medium";

export function BusinessProfileContent() {
  const { business, isLoading, isError } = useDashboardBusinessLocation();

  return (
    <SettingsSection
      title="Business profile"
      description="Manage how your business is identified across your workspace and customer experiences."
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-44 animate-pulse rounded-3xl bg-slate-200/70" />
          <div className="h-56 animate-pulse rounded-3xl bg-slate-200/70" />
        </div>
      ) : null}

      {isError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-xs">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Unable to load your business profile</p>
            <p className="mt-1 text-red-600">
              Refresh the page and try again.
            </p>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && !business ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
          <Building2 className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 font-semibold text-slate-900">
            No business profile found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Please complete onboarding to manage your business profile.
          </p>
        </div>
      ) : null}

      {business ? <BusinessProfileEditor key={business.id} business={business} /> : null}
    </SettingsSection>
  );
}

function BusinessProfileEditor({
  business,
}: {
  business: Business;
}) {
  const initialForm = getInitialForm(business);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSaved(false);
  }

  function cancelEditing() {
    setForm(initialForm);
    setIsEditing(false);
    setIsSaved(false);
  }

  function saveLocally() {
    setIsEditing(false);
    setIsSaved(true);
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
        <div className="relative isolate overflow-hidden bg-linear-to-br from-[#fff8f3] via-white to-[#f7f8fb] px-5 py-6 sm:px-7 sm:py-7">
          <div aria-hidden="true" className="absolute -right-12 -top-24 -z-10 h-64 w-64 rounded-full bg-orange-100/70 blur-3xl" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-[22px] border border-orange-100 bg-white text-[#e8582b] shadow-sm shadow-orange-900/5">
                <span className="text-2xl font-bold tracking-tight">{form.name.trim().slice(0, 1).toUpperCase() || <Store className="h-7 w-7" />}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Business identity</p>
                <h2 className="mt-1 truncate text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{form.name || "Your business"}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{business.onboardingProfile?.firstLocationName ?? "Add your primary outlet"}</span>
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {business.status === "ACTIVE" ? "Active business" : business.status}
            </span>
          </div>
        </div>
        <div className="grid divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <SummaryItem icon={Hash} label="Public profile URL" value={form.slug ? `/r/${form.slug}` : "Not set"} />
          <SummaryItem icon={Store} label="Primary outlet" value={business.onboardingProfile?.firstLocationName ?? "Not set"} />
          <SummaryItem icon={MapPin} label="Profile created" value={formatDate(business.createdAt)} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#e8582b]">Brand presence</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Logo &amp; outlet photos</h2>
            <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">A home for the images customers will recognize across your menus and business pages.</p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">Coming soon</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)]">
          <div className="flex min-h-32 items-center gap-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-white text-orange-400 shadow-xs"><ImagePlus className="h-6 w-6" strokeWidth={1.7} /></div>
            <div><p className="text-sm font-semibold text-slate-800">Business logo</p><p className="mt-1 text-xs leading-5 text-slate-500">Your mark for menus, receipts, and listings.</p></div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">Outlet gallery</p><p className="mt-1 text-xs text-slate-500">Show guests what your space looks like.</p></div><Camera className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={1.7} /></div>
            <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Outlet photo placeholders">
              {[0, 1, 2].map((item) => <div key={item} className="flex aspect-[1.65] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-slate-300"><ImagePlus className="h-4 w-4" strokeWidth={1.7} /></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details Form Card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">Business information</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Profile details</h2>
            <p className="mt-1 text-sm text-slate-500">Your registered details and customer-facing profile information.</p>
          </div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              Edit details
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          ) : null}
        </div>

        <div className="grid gap-x-6 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
          <Field label="Brand / Display Name" icon={Building2}>
            <input
              className={inputClass}
              value={form.name}
              disabled={!isEditing}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </Field>
          <Field
            label="Public URL Slug"
            hint="Used in digital QR menus (e.g. urbankitchen.in/r/munchy-krunchy)"
            icon={Hash}
          >
            <input
              className={inputClass}
              value={form.slug}
              disabled={!isEditing}
              onChange={(event) => updateField("slug", event.target.value)}
            />
          </Field>
          <Field label="Registered Legal Name" icon={FileText}>
            <input
              className={inputClass}
              placeholder="e.g. Munchy Krunchy Hospitality LLP"
              value={form.legalName}
              disabled={!isEditing}
              onChange={(event) => updateField("legalName", event.target.value)}
            />
          </Field>
          <Field label="Food Business Category" icon={Building2}>
            <select
              className={inputClass}
              value={form.businessType}
              disabled={!isEditing}
              onChange={(event) => updateField("businessType", event.target.value)}
            >
              {businessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="GSTIN (Goods &amp; Services Tax Number)"
            hint="15-character statutory GST identification for B2B invoices."
            icon={FileText}
          >
            <input
              className={`${inputClass} uppercase font-mono`}
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={form.gstin}
              disabled={!isEditing}
              onChange={(event) => updateField("gstin", event.target.value)}
            />
          </Field>
        </div>

        {isEditing ? (
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-slate-500">
              Review your changes before saving your business profile.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLocally}
                className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-4 text-sm font-semibold text-white shadow-xs hover:bg-slate-800"
              >
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {isSaved ? (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <Check className="h-4 w-4" />
          Business profile updated successfully.
        </div>
      ) : null}
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-5 py-4 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
