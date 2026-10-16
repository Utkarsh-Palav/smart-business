"use client";

import type { ReactNode } from "react";
import { Store } from "lucide-react";
import { useDashboardBusinessLocation } from "@/components/dashboard/BusinessLocationProvider";

type SettingsSectionProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  const { business, location } = useDashboardBusinessLocation();

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF5B2E]">Workspace Settings</span>
            {business ? <>
              <span className="text-xs text-slate-300">·</span>
              <span className="flex min-w-0 items-center gap-1 text-xs font-medium text-slate-500">
                <Store className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="max-w-48 truncate">{business.name}</span>
                {location ? <><span aria-hidden="true">/</span><span className="max-w-40 truncate">{location.name}</span></> : null}
              </span>
            </> : null}
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SettingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}
