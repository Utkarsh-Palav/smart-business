import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function FinancePage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Finance" section="finance" />
      <div className="flex flex-1 items-center justify-center">Finance</div>
    </section>
  );
}
