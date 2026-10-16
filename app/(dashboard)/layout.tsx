import DashboardNavbar from "@/components/dashboard/Navbar";
import { BusinessLocationProvider } from "@/components/dashboard/BusinessLocationProvider";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main>
      <BusinessLocationProvider>
        <DashboardNavbar />
        <div className="flex min-h-[calc(100dvh-3.5rem)] w-full items-start" style={{ background: '#f4f5f7' }}>
          {children}
        </div>
      </BusinessLocationProvider>
    </main>
  );
}
