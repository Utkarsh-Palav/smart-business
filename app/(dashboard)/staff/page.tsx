"use client";

import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { Activity, CalendarFold, ChefHat, CircleAlert, IndianRupee, SquareCheckBig, Summary } from "lucide-react";

function SidebarIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative flex" aria-label={label}>
      <span className="flex h-9 w-9 items-center justify-center border-r-2 border-transparent px-2 text-slate-600 transition-colors duration-150 group-hover:border-slate-300 group-hover:bg-slate-50 group-hover:text-slate-950 group-focus-within:border-slate-400 group-focus-within:bg-slate-50 group-focus-within:text-slate-950">
        {children}
      </span>
      <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
    </span>
  );
}

export default function StaffPage() {
  return (
    <section className="flex w-full items-center justify-center">
      <aside className="flex h-full w-14 flex-col items-center justify-between border-r pt-4">
        <div className="flex flex-col items-center gap-3">
          <SidebarIcon label="Summary"><Summary size={18} /></SidebarIcon>
          <SidebarIcon label="Today"><CalendarFold size={18} /></SidebarIcon>
          <SidebarIcon label="Sales summary"><IndianRupee size={18} /></SidebarIcon>
          <SidebarIcon label="Order summary"><ChefHat size={18} /></SidebarIcon>
          <SidebarIcon label="Low stock"><CircleAlert size={18} /></SidebarIcon>
          <SidebarIcon label="Pending tasks"><SquareCheckBig size={18} /></SidebarIcon>
          <SidebarIcon label="Recent activity"><Activity size={18} /></SidebarIcon>
        </div>
        <div className="group relative">
          <LogoutButton iconOnly />
          <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100">
            Log out
          </span>
        </div>
      </aside>
      <div className="flex h-full flex-1 flex-col items-center justify-center">Staff</div>
    </section>
  );
}
