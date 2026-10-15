import DashboardNavbar from "@/components/dashboard/Navbar";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main>
      <DashboardNavbar />
      <div className="flex w-full min-h-[calc(100dvh-3.5rem)] overflow-hidden">
        {children}
      </div>
    </main>
  );
}
