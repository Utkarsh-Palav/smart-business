import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function MenuPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Menu" section="menu" />
      <div className="flex flex-1 items-center justify-center">Menu</div>
    </section>
  );
}
