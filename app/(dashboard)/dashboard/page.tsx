import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function DashboardPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Overview" section="overview" />
      <div className="flex-1 px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your restaurant performance at a glance.
          </p>
        </div>
      </div>
    </section>
  );
}
