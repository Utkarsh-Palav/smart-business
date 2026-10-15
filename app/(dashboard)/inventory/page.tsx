import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function InventoryPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Inventory" section="inventory" />
      <div className="flex flex-1 items-center justify-center">Inventory</div>
    </section>
  );
}
