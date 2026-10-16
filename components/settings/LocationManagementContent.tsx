"use client";

import { useState, type FormEvent } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  ExternalLink,
  MapPin,
  Plus,
  QrCode,
  Store,
  Users,
} from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import {
  useCreateLocation,
  useCreateTable,
  useTables,
  useUpdateLocation,
  useUpdateTable,
} from "@/features/locations/queries/use-locations";
import type { Location, Table } from "@/features/locations/queries/location.queries";
import { useDashboardBusinessLocation } from "@/components/dashboard/BusinessLocationProvider";

const inputClass = "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-slate-50";
const selectClass = `${inputClass} cursor-pointer`;
type LocationDraft = {
  name: string; slug: string; operatingMode: Location["operatingMode"];
  addressLine1: string; addressLine2: string; city: string; state: string;
  postalCode: string; country: string; phone: string;
};

const emptyLocationDraft: LocationDraft = {
  name: "", slug: "", operatingMode: "DINE_IN", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "", country: "IN", phone: "",
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function mutationMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function LocationEditor({
  location,
  businessId,
  onDone,
}: {
  location: Location;
  businessId: string;
  onDone: () => void;
}) {
  const update = useUpdateLocation(businessId);
  const [draft, setDraft] = useState<LocationDraft>({
    name: location.name,
    slug: location.slug,
    operatingMode: location.operatingMode,
    addressLine1: location.addressLine1 ?? "",
    addressLine2: location.addressLine2 ?? "",
    city: location.city ?? "",
    state: location.state ?? "",
    postalCode: location.postalCode ?? "",
    country: location.country,
    phone: location.phone ?? "",
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await update.mutateAsync({ locationId: location.id, input: draft });
      onDone();
    } catch { /* The mutation message is shown below. */ }
  }

  return (
    <form onSubmit={submit} className="mt-4 border-t border-slate-100 pt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-slate-600">Location name<input className={`${inputClass} mt-1.5`} required minLength={2} maxLength={100} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
        <label className="text-xs font-semibold text-slate-600">Public URL slug<input className={`${inputClass} mt-1.5`} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value.toLowerCase() })} /></label>
        <label className="text-xs font-semibold text-slate-600">Operating mode<select className={`${selectClass} mt-1.5`} value={draft.operatingMode} onChange={(event) => setDraft({ ...draft, operatingMode: event.target.value as LocationDraft["operatingMode"] })}><option value="DINE_IN">Dine in</option><option value="TAKEAWAY">Takeaway</option><option value="DELIVERY_ONLY">Delivery only</option><option value="HYBRID">Hybrid</option><option value="OTHER">Other</option></select></label>
        <label className="text-xs font-semibold text-slate-600">Phone<input className={`${inputClass} mt-1.5`} maxLength={30} value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
        <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Address line 1<input className={`${inputClass} mt-1.5`} maxLength={160} value={draft.addressLine1} onChange={(event) => setDraft({ ...draft, addressLine1: event.target.value })} /></label>
        <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Address line 2<input className={`${inputClass} mt-1.5`} maxLength={160} value={draft.addressLine2} onChange={(event) => setDraft({ ...draft, addressLine2: event.target.value })} /></label>
        <label className="text-xs font-semibold text-slate-600">City<input className={`${inputClass} mt-1.5`} value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label>
        <label className="text-xs font-semibold text-slate-600">State / region<input className={`${inputClass} mt-1.5`} value={draft.state} onChange={(event) => setDraft({ ...draft, state: event.target.value })} /></label>
        <label className="text-xs font-semibold text-slate-600">Postal code<input className={`${inputClass} mt-1.5`} value={draft.postalCode} onChange={(event) => setDraft({ ...draft, postalCode: event.target.value })} /></label>
        <label className="text-xs font-semibold text-slate-600">Country code<input className={`${inputClass} mt-1.5 uppercase`} maxLength={2} value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value.toUpperCase() })} /></label>
      </div>
      {update.isError ? <p role="alert" className="mt-3 text-sm text-red-600">{mutationMessage(update.error)}</p> : null}
      <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onDone} className="h-9 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button disabled={update.isPending} className="h-9 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">{update.isPending ? "Saving…" : "Save location"}</button></div>
    </form>
  );
}

function TableList({ businessId, location }: { businessId: string; location: Location }) {
  const { data: tables, isLoading, isError, error } = useTables(businessId, location.id);
  const create = useCreateTable(businessId, location.id);
  const update = useUpdateTable(businessId, location.id);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState("");

  async function createTable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await create.mutateAsync({ name, capacity: Number.isFinite(capacity) ? capacity : null });
      setName(""); setCapacity(2); setShowForm(false);
    } catch { /* The mutation message is shown below. */ }
  }

  async function saveTable(table: Table) {
    try {
      await update.mutateAsync({ tableId: table.id, input: { name: editName, capacity: editCapacity === "" ? null : Number(editCapacity) } });
      setEditingId(null);
    } catch { /* The mutation message is shown below. */ }
  }

  async function copyLink(table: Table) {
    try {
      await navigator.clipboard.writeText(table.publicUrl);
      setCopiedId(table.id);
      window.setTimeout(() => setCopiedId((current) => current === table.id ? null : current), 1800);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="text-sm font-bold text-slate-900">Tables</h3><p className="mt-0.5 text-xs text-slate-500">Create a table and share its public QR link.</p></div>
        <button type="button" disabled={location.status !== "ACTIVE"} onClick={() => setShowForm((open) => !open)} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-orange-600 px-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"><Plus className="h-4 w-4" />Add table</button>
      </div>
      {showForm ? <form onSubmit={createTable} className="mt-3 grid gap-2 rounded-2xl bg-slate-50 p-3 sm:grid-cols-[1fr_120px_auto] sm:items-end">
        <label className="text-xs font-semibold text-slate-600">Table name<input autoFocus required maxLength={60} className={`${inputClass} mt-1.5`} placeholder="e.g. Window 1" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="text-xs font-semibold text-slate-600">Seats<input type="number" min={1} max={100} className={`${inputClass} mt-1.5`} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} /></label>
        <button disabled={create.isPending} className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">{create.isPending ? "Creating…" : "Create table"}</button>
      </form> : null}
      {create.isError ? <p role="alert" className="mt-2 text-sm text-red-600">{mutationMessage(create.error)}</p> : null}
      {isLoading ? <div className="mt-4 h-20 animate-pulse rounded-2xl bg-slate-100" /> : null}
      {isError ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{mutationMessage(error)}</p> : null}
      {!isLoading && !isError && tables?.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-5 text-center"><QrCode className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-2 text-sm font-semibold text-slate-700">No tables yet</p><p className="mt-1 text-xs text-slate-500">Add a table to generate its shareable QR link.</p></div> : null}
      {tables?.length ? <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
        {tables.map((table) => <div key={table.id} className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          {editingId === table.id ? <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_100px_auto] sm:items-end">
            <label className="text-xs font-semibold text-slate-600">Table name<input className={`${inputClass} mt-1`} value={editName} onChange={(event) => setEditName(event.target.value)} /></label>
            <label className="text-xs font-semibold text-slate-600">Seats<input type="number" min={1} max={100} className={`${inputClass} mt-1`} value={editCapacity} onChange={(event) => setEditCapacity(event.target.value)} /></label>
            <div className="flex gap-1.5"><button type="button" onClick={() => setEditingId(null)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600">Cancel</button><button type="button" onClick={() => void saveTable(table)} disabled={update.isPending} className="h-10 rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white disabled:opacity-50">Save</button></div>
          </div> : <>
            <div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><QrCode className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{table.name}</p><p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500"><span>{table.capacity ? `${table.capacity} seats` : "Capacity not set"}</span><span aria-hidden="true">·</span><span className={table.status === "ACTIVE" ? "text-emerald-700" : "text-slate-500"}>{table.status === "ACTIVE" ? "Active" : "Inactive"}</span>{table._count.orders ? <><span aria-hidden="true">·</span><span>{table._count.orders} orders</span></> : null}</p></div></div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end"><button type="button" onClick={() => { setEditingId(table.id); setEditName(table.name); setEditCapacity(table.capacity?.toString() ?? ""); }} className="h-9 rounded-xl px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100">Edit</button><button type="button" onClick={() => void update.mutateAsync({ tableId: table.id, input: { status: table.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } }).catch(() => undefined)} disabled={update.isPending || (location.status !== "ACTIVE" && table.status !== "ACTIVE")} title={location.status !== "ACTIVE" && table.status !== "ACTIVE" ? "Activate the location before enabling its tables." : undefined} className="h-9 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">{table.status === "ACTIVE" ? "Disable" : "Enable"}</button><button type="button" onClick={() => void copyLink(table)} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-semibold text-orange-800 hover:bg-orange-100">{copiedId === table.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copiedId === table.id ? "Copied" : "Copy link"}</button><a href={table.publicUrl} target="_blank" rel="noreferrer" aria-label={`Open ${table.name} public link`} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"><ExternalLink className="h-4 w-4" /></a></div>
          </>}
        </div>)}
      </div> : null}
      {update.isError ? <p role="alert" className="mt-2 text-sm text-red-600">{mutationMessage(update.error)}</p> : null}
    </div>
  );
}

export function LocationManagementContent() {
  const { businesses, business, locations, location: selectedLocation, isLoading, isError, selectBusiness, selectLocation } = useDashboardBusinessLocation();
  const businessId = business?.id ?? "";
  const createLocation = useCreateLocation(businessId);
  const updateLocation = useUpdateLocation(businessId);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [draft, setDraft] = useState<LocationDraft>(emptyLocationDraft);

  async function submitLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createLocation.mutateAsync(draft);
      setDraft(emptyLocationDraft);
      setShowLocationForm(false);
    } catch { /* The mutation message is shown below. */ }
  }

  return (
    <SettingsSection title="Locations & tables" description="Organize your outlets, manage seating, and create shareable QR links for each table.">
      {isLoading ? <div className="space-y-3"><div className="h-24 animate-pulse rounded-3xl bg-slate-200/70" /><div className="h-64 animate-pulse rounded-3xl bg-slate-200/70" /></div> : null}
      {isError ? <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" /><p>Unable to load your businesses or locations. Refresh the page and try again.</p></div> : null}
      {!isLoading && !isError && !business ? <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center"><Building2 className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 font-semibold text-slate-900">No business found</p><p className="mt-1 text-sm text-slate-500">Complete business setup before managing locations.</p></div> : null}
      {business && !isLoading && !isError ? <div className="space-y-5">
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><Store className="h-5 w-5" /></span><div><p className="text-sm font-bold text-slate-900">Your locations</p><p className="mt-0.5 text-xs text-slate-500">{locations?.length ?? 0} {(locations?.length ?? 0) === 1 ? "outlet" : "outlets"} in {business.name}</p></div></div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {businesses && businesses.length > 1 ? <label className="sr-only" htmlFor="location-business">Select business</label> : null}
              {businesses.length > 1 ? <select id="location-business" className={`${selectClass} sm:w-52`} value={business.id} onChange={(event) => { selectBusiness(event.target.value); setEditingLocationId(null); }} aria-label="Select business">{businesses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select> : null}
              <button type="button" onClick={() => setShowLocationForm((open) => !open)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700"><Plus className="h-4 w-4" />Add location</button>
            </div>
          </div>
          {showLocationForm ? <form onSubmit={submitLocation} className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-600">Location name<input required minLength={2} maxLength={100} className={`${inputClass} mt-1.5`} placeholder="e.g. Downtown cafe" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, slug: slugify(event.target.value) })} /></label>
            <label className="text-xs font-semibold text-slate-600">Public URL slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className={`${inputClass} mt-1.5`} placeholder="downtown-cafe" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value.toLowerCase() })} /></label>
            <label className="text-xs font-semibold text-slate-600">Operating mode<select className={`${selectClass} mt-1.5`} value={draft.operatingMode} onChange={(event) => setDraft({ ...draft, operatingMode: event.target.value as LocationDraft["operatingMode"] })}><option value="DINE_IN">Dine in</option><option value="TAKEAWAY">Takeaway</option><option value="DELIVERY_ONLY">Delivery only</option><option value="HYBRID">Hybrid</option><option value="OTHER">Other</option></select></label>
            <label className="text-xs font-semibold text-slate-600">City<input className={`${inputClass} mt-1.5`} value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label>
            <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Address<input className={`${inputClass} mt-1.5`} value={draft.addressLine1} onChange={(event) => setDraft({ ...draft, addressLine1: event.target.value })} /></label>
            {createLocation.isError ? <p role="alert" className="text-sm text-red-600 sm:col-span-2">{mutationMessage(createLocation.error)}</p> : null}
            <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => setShowLocationForm(false)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600">Cancel</button><button disabled={createLocation.isPending} className="h-9 rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">{createLocation.isPending ? "Adding…" : "Add location"}</button></div>
          </form> : null}
        </section>

        {!isLoading && locations?.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><MapPin className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 font-semibold text-slate-900">No locations found</p><p className="mt-1 text-sm text-slate-500">Add an outlet to start organizing its tables.</p></div> : null}
        {updateLocation.isError ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{mutationMessage(updateLocation.error)}</p> : null}
        {locations?.map((location) => <section key={location.id} className={`rounded-3xl border bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6 ${selectedLocation?.id === location.id ? "border-orange-200 ring-1 ring-orange-100" : "border-slate-200/80"}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => selectLocation(location.id)} className="flex min-w-0 items-center gap-3 text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><MapPin className="h-5 w-5" /></span>
              <span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><span className="truncate text-sm font-bold text-slate-900">{location.name}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${location.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{location.status === "ACTIVE" ? "Active" : "Inactive"}</span></span><span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500"><span>{[location.city, location.state].filter(Boolean).join(", ") || location.slug}</span><span aria-hidden="true">·</span><span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{location._count?.tables ?? 0} tables</span></span></span>
            </button>
            <div className="flex items-center gap-2 sm:justify-end"><button type="button" onClick={() => { selectLocation(location.id); setEditingLocationId((current) => current === location.id ? null : location.id); }} className="h-9 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">{editingLocationId === location.id ? "Close editor" : "Edit details"}</button><button type="button" disabled={updateLocation.isPending} onClick={() => void updateLocation.mutateAsync({ locationId: location.id, input: { status: location.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } }).catch(() => undefined)} className="h-9 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-50">{location.status === "ACTIVE" ? "Deactivate" : "Activate"}</button><button type="button" onClick={() => selectLocation(location.id)} aria-label={`${selectedLocation?.id === location.id ? "Selected" : "Select"} ${location.name}`} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"><ChevronDown className={`h-4 w-4 transition ${selectedLocation?.id === location.id ? "rotate-180" : ""}`} /></button></div>
          </div>
          {editingLocationId === location.id ? <LocationEditor location={location} businessId={businessId} onDone={() => setEditingLocationId(null)} /> : null}
          {selectedLocation?.id === location.id ? <TableList businessId={businessId} location={location} /> : null}
        </section>)}
      </div> : null}
    </SettingsSection>
  );
}

