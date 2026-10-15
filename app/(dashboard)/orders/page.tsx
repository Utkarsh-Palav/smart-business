import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function OrdersPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Orders" section="orders" />
      <div className="flex flex-1 items-center justify-center">Orders</div>
    </section>
  );
}
