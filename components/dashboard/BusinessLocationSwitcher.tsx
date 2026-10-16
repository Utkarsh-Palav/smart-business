"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Building2, Check, ChevronsUpDown, CircleAlert, MapPin } from "lucide-react";
import { useDashboardBusinessLocation } from "./BusinessLocationProvider";

export function BusinessLocationSwitcher() {
  const { businesses, business, locations, location, isLoading, isError, selectBusiness, selectLocation } = useDashboardBusinessLocation();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={switcherRef} className="relative min-w-0">
      <button
        type="button"
        aria-label="Choose business and outlet"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-w-0 max-w-[min(15rem,48vw)] cursor-pointer items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.05] px-2.5 py-1.5 text-left transition-all duration-200 hover:border-white/15 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/40 sm:max-w-64"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/25 to-orange-400/10 text-orange-300 ring-1 ring-orange-200/10">
          <Building2 className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="max-w-full truncate text-xs font-semibold text-white/90 sm:text-sm">{business?.name ?? (isLoading ? "Loading workspace…" : "Choose a business")}</span>
          <span className="flex max-w-full items-center gap-1 truncate text-[10px] text-white/45 sm:text-[11px]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{location?.name ?? (business ? "No outlet selected" : "Business and outlet")}</span>
          </span>
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-white/40" />
      </button>

      {isOpen ? <div role="dialog" aria-label="Choose business and outlet" className="absolute left-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl shadow-black/25">
        {isError ? <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><span>Couldn’t load your businesses or outlets. Try refreshing the page.</span></div> : null}
        {isLoading ? <div className="px-3 py-5 text-center text-sm text-slate-500">Loading your workspace…</div> : null}
        {!isLoading && businesses.length === 0 && !isError ? <div className="px-3 py-5 text-center"><p className="text-sm font-semibold text-slate-800">No businesses found</p><Link href="/settings/profile" onClick={() => setIsOpen(false)} className="mt-2 inline-block text-xs font-semibold text-orange-700 hover:underline">Complete business setup</Link></div> : null}
        {!isLoading && businesses.length > 0 ? <>
          <p className="px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Businesses</p>
          <div className="max-h-44 overflow-y-auto">
            {businesses.map((item) => <button key={item.id} type="button" aria-pressed={item.id === business?.id} onClick={() => selectBusiness(item.id)} className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-slate-50">
              <span className="flex min-w-0 items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><Building2 className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-sm font-medium text-slate-800">{item.name}</span><span className="block truncate text-[11px] text-slate-400">{item.slug}</span></span></span>
              {item.id === business?.id ? <Check className="h-4 w-4 shrink-0 text-orange-600" /> : null}
            </button>)}
          </div>
          <div className="my-2 border-t border-slate-100" />
          <div className="flex items-center justify-between px-2 pb-1 pt-0.5"><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Outlets</p><Link href="/settings/locations" onClick={() => setIsOpen(false)} className="text-[11px] font-semibold text-orange-700 hover:underline">Manage</Link></div>
          <div className="max-h-48 overflow-y-auto">
            {locations.length === 0 && !isError ? <p className="px-2.5 py-3 text-xs text-slate-500">{business ? "No outlets are set up yet." : "Choose a business first."}</p> : null}
            {locations.map((item) => <button key={item.id} type="button" aria-pressed={item.id === location?.id} onClick={() => selectLocation(item.id)} className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition hover:bg-slate-50">
              <span className="flex min-w-0 items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><MapPin className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-sm font-medium text-slate-800">{item.name}</span><span className="block truncate text-[11px] text-slate-400">{[item.city, item.state].filter(Boolean).join(", ") || item.slug}</span></span></span>
              {item.id === location?.id ? <Check className="h-4 w-4 shrink-0 text-orange-600" /> : null}
            </button>)}
          </div>
        </> : null}
      </div> : null}
    </div>
  );
}
