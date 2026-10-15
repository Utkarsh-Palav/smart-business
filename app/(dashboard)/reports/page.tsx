import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function ReportsPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Reports" section="reports" />
      <div className="flex flex-1 items-center justify-center">Reports</div>
    </section>
  );
}
