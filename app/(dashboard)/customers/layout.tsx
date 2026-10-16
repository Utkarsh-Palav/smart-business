import { PageSidebar } from "@/components/dashboard/PageSidebar";
import type { ReactNode } from "react";

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Customers" section="customers" />
      <main className="flex min-w-0 flex-1">{children}</main>
    </section>
  );
}
