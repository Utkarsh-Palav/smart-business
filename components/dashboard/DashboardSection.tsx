import type { ReactNode } from "react";

type DashboardSectionProps = {
  section: string;
  subsection: string;
  children?: ReactNode;
};

const labels: Record<string, string> = {
  analytics: "Analytics",
  alerts: "Alerts",
  partners: "Partners",
  live: "Live activity",
  overview: "Overview",
  queue: "Order queue",
  items: "Food items",
  availability: "Availability",
  suppliers: "Suppliers",
  movement: "Stock movement",
  relationships: "Relationships",
  campaigns: "Campaigns",
  settlements: "Settlements",
  performance: "Business performance",
  team: "Team",
  operations: "People operations",
  learn: "Learn",
  support: "Support",
};

export function DashboardSection({
  section,
  subsection,
  children,
}: DashboardSectionProps) {
  const title = labels[subsection] ?? subsection.replaceAll("-", " ");

  return (
    <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {section}
        </p>
        <h1 className="mt-2 text-2xl font-semibold capitalize text-slate-950">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This route is ready for the {title.toLowerCase()} experience.
        </p>
        {children ?? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Build this section independently without loading other dashboard
            sections.
          </div>
        )}
      </div>
    </div>
  );
}
