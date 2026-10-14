import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/Navbar";
import {
  BellRing,
  ChefHat,
  ChevronsUpDown,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main>
      <DashboardNavbar />
      <div className="flex w-full min-h-[calc(100vh-3.5rem)] overflow-hidden">
        {children}
      </div>
    </main>
  );
}
