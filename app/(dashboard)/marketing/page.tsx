import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function MarketingPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Marketing" section="marketing" />
      <div className="flex flex-1 items-center justify-center">Marketing</div>
    </section>
  );
}
