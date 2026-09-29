import { BuildingComplex, ChartPie, ConciergeBell, ReceiptIndianRupee, ShelvingUnit, Utensils } from "lucide-react";
import Link from "next/link";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight"
        >
          Smart Business
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        <Link
          href="/dashboard"
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted flex items-center justify-start gap-2"
        >
          <ChartPie size={20} className="text-gray-500" /> Overview
        </Link>

        <Link
          href="/dashboard/businesses"
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted flex items-center justify-start gap-2"
        >
          <ShelvingUnit size={20} className="text-gray-500" /> Inventory
        </Link>

        <Link
          href="/dashboard/review-cards"
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted flex items-center justify-start gap-2"
        >
          <Utensils size={20} className="text-gray-500" /> Tables
        </Link>

        <Link
          href="/dashboard/locations"
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted flex items-center justify-start gap-2"
        >
          <ConciergeBell size={20} className="text-gray-500" />Orders
        </Link>

        <Link
          href="/dashboard/review-cards"
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted flex items-center justify-start gap-2"
        >
          <ReceiptIndianRupee size={20} className="text-gray-500" /> Bills
        </Link>
      </nav>
    </aside>
  );
}
