"use client";

import {
  Activity,
  BadgePercent,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  CalendarDays,
  CheckSquare,
  CircleHelp,
  Clock3,
  CreditCard,
  FileText,
  HandCoins,
  HeartHandshake,
  Handshake,
  History,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  PackageCheck,
  Palette,
  PanelTop,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  PlusCircle,
  Receipt,
  ReceiptText,
  Radio,
  RefreshCw,
  Salad,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Tags,
  TicketPercent,
  Truck,
  TriangleAlert,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoutButton } from "./LogoutButton";

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

const item = (label: string, href: string, icon: LucideIcon): SidebarItem => ({
  label,
  href,
  icon,
});

const railItemsBySection: Record<string, SidebarItem[]> = {
  overview: [
    item("Analytics", "/dashboard#analytics", BarChart3),
    item("Alerts", "/dashboard#alerts", TriangleAlert),
    item("Partners", "/dashboard#partners", Handshake),
    item("Live activity", "/dashboard#live", Radio),
  ],
  orders: [
    item("Order overview", "/orders", ShoppingBag),
    item("Order queue", "/orders#queue", Clock3),
    item("Order alerts", "/orders#alerts", TriangleAlert),
    item("Live orders", "/orders#live", Radio),
  ],
  menu: [
    item("Menu overview", "/menu", Salad),
    item("Food items", "/menu#items", Boxes),
    item("Availability", "/menu#availability", CheckSquare),
    item("Live menu", "/menu#live", Radio),
  ],
  inventory: [
    item("Inventory overview", "/inventory", Boxes),
    item("Stock alerts", "/inventory#alerts", TriangleAlert),
    item("Suppliers", "/inventory#suppliers", Handshake),
    item("Stock movement", "/inventory#movement", RefreshCw),
  ],
  customers: [
    item("Customer overview", "/customers", Users),
    item("Customer alerts", "/customers#alerts", TriangleAlert),
    item("Loyalty", "/customers#loyalty", HeartHandshake),
    item("Live activity", "/customers#live", Radio),
  ],
  marketing: [
    item("Marketing overview", "/marketing", Megaphone),
    item("Campaign alerts", "/marketing#alerts", TriangleAlert),
    item("Partners", "/marketing#partners", Handshake),
    item("Live campaigns", "/marketing#live", Radio),
  ],
  finance: [
    item("Finance overview", "/finance", WalletCards),
    item("Payment alerts", "/finance#alerts", TriangleAlert),
    item("Settlements", "/finance#settlements", HandCoins),
    item("Live payments", "/finance#live", Radio),
  ],
  reports: [
    item("Reports overview", "/reports", BarChart3),
    item("Report alerts", "/reports#alerts", TriangleAlert),
    item("Shared reports", "/reports#shared", Handshake),
    item("Live metrics", "/reports#live", Radio),
  ],
  staff: [
    item("Team overview", "/staff", Users),
    item("Staff alerts", "/staff#alerts", TriangleAlert),
    item("Partners", "/staff#partners", Handshake),
    item("Live activity", "/staff#live", Radio),
  ],
  settings: [
    item("Settings overview", "/settings", Settings2),
    item("Setup alerts", "/settings#alerts", TriangleAlert),
    item("Connected services", "/settings#connected", Handshake),
    item("System status", "/settings#status", Radio),
  ],
  help: [
    item("Help overview", "/help", CircleHelp),
    item("Important alerts", "/help#alerts", TriangleAlert),
    item("Support partners", "/help#partners", Handshake),
    item("System status", "/help#status", Radio),
  ],
};

const sidebarGroups: Record<string, SidebarGroup[]> = {
  overview: [
    {
      label: "Analytics",
      items: [
        item("Revenue", "/dashboard#revenue", BarChart3),
        item("Expenses and bills", "/dashboard#expenses", Receipt),
        item("Online vs offline", "/dashboard#online-offline", CreditCard),
        item("Orders and sales", "/dashboard#orders-sales", ReceiptText),
        item("Profit summary", "/dashboard#profit", WalletCards),
      ],
    },
    {
      label: "Needs attention",
      items: [
        item("Alerts", "/dashboard#alerts", TriangleAlert),
        item("Pending tasks", "/dashboard#tasks", CheckSquare),
        item("Low stock", "/dashboard#low-stock", PackageCheck),
      ],
    },
    {
      label: "Partners",
      items: [
        item("Partner performance", "/dashboard#partners", Handshake),
        item("Connected channels", "/dashboard#channels", ShoppingBag),
      ],
    },
    {
      label: "Live",
      items: [
        item("Live activity", "/dashboard#live", Radio),
        item("Recent activity", "/dashboard#activity", Activity),
      ],
    },
  ],
  orders: [
    {
      label: "Today",
      items: [
        item("All orders", "/orders", ShoppingBag),
        item("New orders", "/orders#new", Zap),
      ],
    },
    {
      label: "Order status",
      items: [
        item("Preparing", "/orders#preparing", Clock3),
        item("Ready for pickup", "/orders#ready", PackageCheck),
        item("Completed", "/orders#completed", CheckSquare),
        item("Cancelled", "/orders#cancelled", XCircle),
      ],
    },
    {
      label: "Order type",
      items: [
        item("Dine-in", "/orders#dine-in", Store),
        item("Takeaway", "/orders#takeaway", ShoppingBag),
        item("Delivery", "/orders#delivery", Truck),
      ],
    },
    {
      label: "Channels",
      items: [item("Order sources", "/orders#sources", SlidersHorizontal)],
    },
  ],
  menu: [
    {
      label: "Menu",
      items: [
        item("Menu overview", "/menu", LayoutDashboard),
        item("Food items", "/menu#items", Salad),
        item("Categories", "/menu#categories", Tags),
      ],
    },
    {
      label: "Build your menu",
      items: [
        item("Add-ons", "/menu#add-ons", PlusCircle),
        item("Combos", "/menu#combos", Boxes),
        item("Availability", "/menu#availability", CheckSquare),
      ],
    },
    {
      label: "Customer access",
      items: [item("Digital menu", "/menu#digital", PanelTop)],
    },
    {
      label: "Configure",
      items: [item("Menu settings", "/menu#settings", Settings2)],
    },
  ],
  inventory: [
    {
      label: "Today",
      items: [
        item("Inventory overview", "/inventory", LayoutDashboard),
        item("Low stock", "/inventory#low-stock", Bell),
      ],
    },
    {
      label: "Stock control",
      items: [
        item("Ingredients", "/inventory#ingredients", Salad),
        item("Stock levels", "/inventory#stock", Boxes),
        item("Stock movement", "/inventory#movement", RefreshCw),
        item("Wastage", "/inventory#wastage", XCircle),
      ],
    },
    {
      label: "Procure",
      items: [
        item("Purchases", "/inventory#purchases", ShoppingCart),
        item("Suppliers", "/inventory#suppliers", Truck),
      ],
    },
    {
      label: "Make",
      items: [item("Recipes", "/inventory#recipes", BookOpen)],
    },
    {
      label: "Configure",
      items: [item("Inventory settings", "/inventory#settings", Settings2)],
    },
  ],
  customers: [
    {
      label: "Customers",
      items: [
        item("All customers", "/customers", Users),
        item("New customers", "/customers#new", UserPlus),
        item("Regular customers", "/customers#regular", UserCheck),
      ],
    },
    {
      label: "Relationships",
      items: [
        item("Feedback", "/customers#feedback", MessageSquare),
        item("Loyalty", "/customers#loyalty", HeartHandshake),
        item("Customer groups", "/customers#groups", Users),
      ],
    },
  ],
  marketing: [
    {
      label: "Marketing",
      items: [
        item("Marketing overview", "/marketing", LayoutDashboard),
        item("Campaigns", "/marketing#campaigns", Megaphone),
        item("Customer messages", "/marketing#messages", MessageSquare),
      ],
    },
    {
      label: "Offers and rewards",
      items: [
        item("Offers", "/marketing#offers", TicketPercent),
        item("Discounts", "/marketing#discounts", BadgePercent),
        item("Loyalty rewards", "/marketing#loyalty", HeartHandshake),
      ],
    },
  ],
  finance: [
    {
      label: "Finance",
      items: [
        item("Finance overview", "/finance", LayoutDashboard),
        item("Sales", "/finance#sales", BarChart3),
        item("Expenses", "/finance#expenses", Receipt),
      ],
    },
    {
      label: "Money received",
      items: [
        item("Payments", "/finance#payments", CreditCard),
        item("Settlements", "/finance#settlements", HandCoins),
      ],
    },
    {
      label: "Records",
      items: [
        item("Invoices", "/finance#invoices", FileText),
        item("Taxes", "/finance#taxes", Percent),
      ],
    },
  ],
  reports: [
    {
      label: "Reports",
      items: [
        item("Reports overview", "/reports", LayoutDashboard),
        item("Sales reports", "/reports#sales", BarChart3),
        item("Order reports", "/reports#orders", ReceiptText),
      ],
    },
    {
      label: "Business performance",
      items: [
        item("Menu performance", "/reports#menu", Salad),
        item("Inventory reports", "/reports#inventory", Boxes),
        item("Customer reports", "/reports#customers", Users),
        item("Profit summary", "/reports#profit", WalletCards),
      ],
    },
  ],
  staff: [
    {
      label: "Team",
      items: [
        item("Staff overview", "/staff", LayoutDashboard),
        item("Team members", "/staff#members", Users),
        item("Roles and permissions", "/staff#roles", ShieldCheck),
      ],
    },
    {
      label: "People operations",
      items: [
        item("Attendance", "/staff#attendance", CalendarDays),
        item("Schedules", "/staff#schedules", Clock3),
        item("Activity log", "/staff#activity", History),
      ],
    },
  ],
  settings: [
    {
      label: "Business",
      items: [
        item("Business profile", "/settings", Building2),
        item("Locations", "/settings#locations", Store),
        item("Order channels", "/settings#channels", ShoppingBag),
      ],
    },
    {
      label: "Operations",
      items: [
        item("Staff and roles", "/settings#staff", Users),
        item("Payment settings", "/settings#payments", CreditCard),
        item("Notifications", "/settings#notifications", Bell),
      ],
    },
    {
      label: "Account",
      items: [
        item("Subscription", "/settings#subscription", WalletCards),
        item("Security", "/settings#security", ShieldCheck),
      ],
    },
    {
      label: "Customize",
      items: [
        item("Appearance", "/settings#appearance", Palette),
        item("Advanced settings", "/settings#advanced", SlidersHorizontal),
      ],
    },
  ],
  help: [
    {
      label: "Learn",
      items: [
        item("Help center", "/help", CircleHelp),
        item("Getting started", "/help#getting-started", BookOpen),
        item("Release notes", "/help#updates", History),
      ],
    },
    {
      label: "Support",
      items: [item("Contact support", "/help#support", MessageSquare)],
    },
  ],
};

const overviewGroupsByRail: Record<string, SidebarGroup[]> = {
  analytics: [sidebarGroups.overview[0]],
  alerts: [sidebarGroups.overview[1]],
  partners: [sidebarGroups.overview[2]],
  live: [sidebarGroups.overview[3]],
};

type PageSidebarProps = {
  section: keyof typeof sidebarGroups;
  title: string;
};

function getHash(href: string) {
  return href.split("#")[1] ?? "";
}

function isActive(pathname: string, hash: string, href: string) {
  const [path, itemHash] = href.split("#");
  return path === pathname && (itemHash ? itemHash === hash : !hash);
}

export function PageSidebar({ section, title }: PageSidebarProps) {
  const pathname = usePathname();
  const railItems = railItemsBySection[section];
  const [currentHash, setCurrentHash] = useState("");
  const [selectedRail, setSelectedRail] = useState(getHash(railItems[0].href));
  const [isContextOpen, setIsContextOpen] = useState(true);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      setCurrentHash(hash);
      if (railItems.some((railItem) => getHash(railItem.href) === hash)) {
        setSelectedRail(hash);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [railItems]);

  const groups =
    section === "overview"
      ? overviewGroupsByRail[selectedRail] ?? overviewGroupsByRail.analytics
      : [
          {
            label:
              railItems.find((railItem) => getHash(railItem.href) === selectedRail)
                ?.label ?? title,
            items:
              sidebarGroups[section].flatMap((group) => group.items).slice(
                Math.max(0, railItems.findIndex((railItem) => getHash(railItem.href) === selectedRail)) * 3,
                Math.max(0, railItems.findIndex((railItem) => getHash(railItem.href) === selectedRail)) * 3 + 3,
              ),
          },
        ];

  return (
    <aside className="sticky top-14 flex h-[calc(100dvh-3.5rem)] shrink-0 self-start border-r border-slate-200 bg-white">
      <nav
        aria-label="Main sections"
        className="flex h-full w-14 flex-col items-center justify-between border-r border-slate-200 bg-slate-50 pt-4"
      >
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            aria-label={`${isContextOpen ? "Hide" : "Show"} ${title} sidebar`}
            aria-expanded={isContextOpen}
            onClick={() => setIsContextOpen((open) => !open)}
            className="group relative flex h-9 w-9 items-center justify-center text-slate-500 transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            {isContextOpen ? (
              <PanelLeftClose size={18} strokeWidth={1.8} />
            ) : (
              <PanelLeftOpen size={18} strokeWidth={1.8} />
            )}
            <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100">
              {isContextOpen ? "Hide sidebar" : "Show sidebar"}
            </span>
          </button>
          <span aria-hidden="true" className="mb-2 h-px w-10 bg-slate-200" />
          {railItems.map(({ label, href, icon: Icon }) => {
            const active = selectedRail === getHash(href);

            return (
              <Link
                key={label}
                href={href}
                onClick={() => setSelectedRail(getHash(href))}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-9 w-9 items-center justify-center rounded-md border-r-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                  active
                    ? "border-slate-800 bg-white text-slate-950 shadow-sm"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-950"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="group relative">
          <LogoutButton iconOnly />
          <span className="pointer-events-none absolute bottom-0 left-full z-30 ml-2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100">
            Log out
          </span>
        </div>
      </nav>

      <section
        aria-label={`${title} actions`}
        className={`${
          isContextOpen ? "block" : "hidden"
        } fixed bottom-0 left-14 top-14 z-30 h-[calc(100dvh-3.5rem)] w-64 overflow-y-auto border-r border-slate-200 bg-white shadow-xl shadow-slate-950/10 md:static md:z-auto md:h-full md:w-64 md:shadow-none md:transition-[width] md:duration-200 ${
          isContextOpen ? "" : "md:w-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">{title}</p>
            <p className="mt-0.5 text-xs text-slate-500">Quick actions</p>
          </div>
        </div>
        <div className="space-y-5 px-3 py-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {group.label}
              </p>
              <div className="mt-1.5 space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = isActive(pathname, currentHash, href);

                  return (
                    <Link
                      key={label}
                      href={href}
                      className={`flex items-center gap-2.5 rounded-md border-l-2 px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                        active
                          ? "border-slate-800 bg-slate-100 font-medium text-slate-950"
                          : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
