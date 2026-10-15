import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function CustomersPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Customers" section="customers" />
      <div className="flex flex-1 items-center justify-center">Customers</div>
    </section>
  );
}
