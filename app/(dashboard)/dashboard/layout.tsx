import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="flex min-h-dvh">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
