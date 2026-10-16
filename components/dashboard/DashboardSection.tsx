"use client";

import type { ReactNode } from "react";
import {
  OrdersSectionView,
  MenuSectionView,
  InventorySectionView,
  CustomersSectionView,
  FinanceSectionView,
  GenericSectionView,
} from "./SectionMockViews";
import { Store, Sparkles } from "lucide-react";
import { useDashboardBusinessLocation } from "./BusinessLocationProvider";

type DashboardSectionProps = {
  section: string;
  subsection: string;
  children?: ReactNode;
};

const labels: Record<string, string> = {
  analytics: "Analytics & Financial Pulse",
  alerts: "Operations & Stock Alerts",
  partners: "Connected Channels & Partners",
  live: "Live Kitchen Display",
  overview: "Operational Overview",
  queue: "Order Dispatch Queue",
  items: "Food Items & Recipes",
  availability: "Menu Availability & 86 Controls",
  suppliers: "Vendor & Supplier Ledger",
  movement: "Stock Movements & Wastage",
  relationships: "Customer CRM & Loyalty",
  campaigns: "Marketing & Broadcast Campaigns",
  settlements: "Bank Settlement Batches",
  performance: "Business Performance Analytics",
  team: "Staff & Shift Roster",
  operations: "People Operations & Attendance",
  learn: "Knowledge Base & Guides",
  support: "Priority Support & Concierge",
};

export function DashboardSection({
  section,
  subsection,
  children,
}: DashboardSectionProps) {
  const { business, location } = useDashboardBusinessLocation();
  const title = labels[subsection] ?? subsection.replaceAll("-", " ");
  const normalizedSec = section.toLowerCase();

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Section Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF5B2E]">
                {section}
              </span>
              <span className="text-xs text-slate-300">•</span>
              {business ? <span className="flex min-w-0 items-center gap-1 text-xs font-medium text-slate-500">
                <Store className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="max-w-48 truncate">{business.name}</span>
                {location ? <><span aria-hidden="true">/</span><span className="max-w-40 truncate">{location.name}</span></> : null}
              </span> : null}
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight capitalize text-slate-900 sm:text-3xl">
              {title}
            </h1>
          </div>
        </div>

        {/* Main Content Area */}
        {children ? (
          children
        ) : normalizedSec.includes("order") ? (
          <OrdersSectionView subsection={subsection} />
        ) : normalizedSec.includes("menu") ? (
          <MenuSectionView subsection={subsection} />
        ) : normalizedSec.includes("inventory") ? (
          <InventorySectionView subsection={subsection} />
        ) : normalizedSec.includes("customer") ? (
          <CustomersSectionView subsection={subsection} />
        ) : normalizedSec.includes("finance") ? (
          <FinanceSectionView subsection={subsection} />
        ) : (
          <GenericSectionView section={section} subsection={subsection} />
        )}
      </div>
    </div>
  );
}
