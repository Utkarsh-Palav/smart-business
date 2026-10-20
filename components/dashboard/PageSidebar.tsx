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
  UsersRound,
  WalletCards,
  XCircle,
  Zap,
  Phone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoutButton } from "./LogoutButton";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type RailItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

export type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

const railItem = (id: string, label: string, href: string, icon: LucideIcon): RailItem => ({
  id,
  label,
  href,
  icon,
});

const subItem = (label: string, href: string, icon: LucideIcon): SidebarItem => ({
  label,
  href,
  icon,
});

// ==========================================
// 1. RAIL ITEMS BY SECTION (Layer 2)
// ==========================================
const railItemsBySection: Record<string, RailItem[]> = {
  overview: [
    railItem("analytics", "Analytics", "/dashboard/analytics/revenue", BarChart3),
    railItem("alerts", "Alerts", "/dashboard/alerts", TriangleAlert),
    railItem("partners", "Partners", "/dashboard/partners/performance", Handshake),
    railItem("live", "Live activity", "/dashboard/live/activity", Radio),
  ],
  orders: [
    railItem("active", "Active orders", "/orders/overview", ShoppingBag),
    railItem("queue", "Kitchen queue", "/orders/queue", Clock3),
    railItem("history", "Order history", "/orders/history/completed", CheckSquare),
    railItem("sources", "Order channels", "/orders/sources", SlidersHorizontal),
  ],
  menu: [
    railItem("overview", "Menu overview", "/menu/overview", LayoutDashboard),
    railItem("items", "Food catalog", "/menu/items", Salad),
    railItem("availability", "Availability", "/menu/availability", CheckSquare),
    railItem("digital", "Digital menu", "/menu/digital", PanelTop),
  ],
  inventory: [
    railItem("overview", "Stock overview", "/inventory/overview", LayoutDashboard),
    railItem("stock", "Stock control", "/inventory/stock/ingredients", Boxes),
    railItem("procure", "Procurement", "/inventory/procure/purchases", ShoppingCart),
    railItem("recipes", "Recipes", "/inventory/recipes", BookOpen),
  ],
  customers: [
    railItem("directory", "Customers", "/customers/overview", Users),
    railItem("loyalty", "Loyalty & rewards", "/customers/loyalty", HeartHandshake),
    railItem("feedback", "Guest feedback", "/customers/feedback", MessageSquare),
    railItem("segments", "Segments", "/customers/segments", UsersRound),
  ],
  marketing: [
    railItem("campaigns", "Campaigns", "/marketing/overview", Megaphone),
    railItem("offers", "Offers & promos", "/marketing/offers", TicketPercent),
    railItem("messages", "Customer messages", "/marketing/messages", MessageSquare),
    railItem("analytics", "Marketing stats", "/marketing/overview/stats", BarChart3),
  ],
  finance: [
    railItem("overview", "Finance overview", "/finance/overview", LayoutDashboard),
    railItem("sales", "Sales & income", "/finance/sales", BarChart3),
    railItem("settlements", "Settlements", "/finance/settlements", HandCoins),
    railItem("records", "Invoices & taxes", "/finance/records/invoices", FileText),
  ],
  reports: [
    railItem("overview", "Reports overview", "/reports/overview", LayoutDashboard),
    railItem("sales", "Sales reports", "/reports/sales", BarChart3),
    railItem("performance", "Business performance", "/reports/performance/menu", Salad),
    railItem("financial", "Financial summaries", "/reports/financial/profit", WalletCards),
  ],
  staff: [
    railItem("overview", "Staff overview", "/staff/overview", LayoutDashboard),
    railItem("team", "Team members", "/staff/team", Users),
    railItem("operations", "Shifts & attendance", "/staff/operations/schedules", CalendarDays),
    railItem("activity", "Activity log", "/staff/activity", History),
  ],
  settings: [
    railItem("business", "Business", "/settings/profile", Building2),
    railItem("operations", "Operations", "/settings/staff", Users),
    railItem("account", "Account", "/settings/subscription", WalletCards),
    railItem("customize", "Customize", "/settings/appearance", Palette),
  ],
  help: [
    railItem("learn", "Help center", "/help/learn", CircleHelp),
    railItem("guides", "Guides & setup", "/help/guides/getting-started", BookOpen),
    railItem("updates", "Release notes", "/help/updates", History),
    railItem("support", "Contact support", "/help/support", MessageSquare),
  ],
};

// ==========================================
// 2. GROUPS BY RAIL (Layer 3 Context Panel)
// ==========================================
const groupsBySectionAndRail: Record<string, Record<string, SidebarGroup[]>> = {
  overview: {
    analytics: [
      {
        label: "Analytics",
        items: [
          subItem("Revenue", "/dashboard/analytics/revenue", BarChart3),
          subItem("Expenses and bills", "/dashboard/analytics/expenses", Receipt),
          subItem("Online vs offline", "/dashboard/analytics/online-offline", CreditCard),
          subItem("Orders and sales", "/dashboard/analytics/orders-sales", ReceiptText),
          subItem("Profit summary", "/dashboard/analytics/profit", WalletCards),
        ],
      },
    ],
    alerts: [
      {
        label: "Needs Attention",
        items: [
          subItem("All alerts", "/dashboard/alerts", TriangleAlert),
          subItem("Pending tasks", "/dashboard/alerts/tasks", CheckSquare),
          subItem("Low stock alerts", "/dashboard/alerts/low-stock", PackageCheck),
        ],
      },
    ],
    partners: [
      {
        label: "Partners & Channels",
        items: [
          subItem("Partner performance", "/dashboard/partners/performance", Handshake),
          subItem("Connected channels", "/dashboard/partners/channels", ShoppingBag),
        ],
      },
    ],
    live: [
      {
        label: "Live Stream",
        items: [
          subItem("Live kitchen radar", "/dashboard/live/activity", Radio),
          subItem("Recent punch stream", "/dashboard/live/recent", Activity),
        ],
      },
    ],
  },
  orders: {
    active: [
      {
        label: "Today's Orders",
        items: [
          subItem("All active", "/orders/overview", ShoppingBag),
          subItem("New orders", "/orders/overview/new", Zap),
        ],
      },
    ],
    queue: [
      {
        label: "Kitchen Queue",
        items: [
          subItem("Live queue", "/orders/queue", Clock3),
          subItem("Preparing", "/orders/queue/preparing", Clock3),
          subItem("Ready for pickup", "/orders/queue/ready", PackageCheck),
        ],
      },
    ],
    history: [
      {
        label: "Order History",
        items: [
          subItem("Completed orders", "/orders/history/completed", CheckSquare),
          subItem("Cancelled & void", "/orders/history/cancelled", XCircle),
          subItem("Dine-in tickets", "/orders/history/dine-in", Store),
          subItem("Takeaway tickets", "/orders/history/takeaway", ShoppingBag),
          subItem("Delivery fleet", "/orders/history/delivery", Truck),
        ],
      },
    ],
    sources: [
      {
        label: "Order Channels",
        items: [
          subItem("Order channels", "/orders/sources", SlidersHorizontal),
          subItem("Aggregator sync", "/orders/sources/aggregators", Radio),
        ],
      },
    ],
  },
  menu: {
    overview: [
      {
        label: "Menu setup",
        items: [
          subItem("Menus and publishing", "/menu/overview", LayoutDashboard),
          subItem("Categories", "/menu/overview/categories", Tags),
        ],
      },
    ],
    items: [
      {
        label: "Product catalog",
        items: [
          subItem("Products", "/menu/items", Salad),
          subItem("Add-ons & extras", "/menu/items/add-ons", PlusCircle),
          subItem("Combos & bundles", "/menu/items/combos", Boxes),
        ],
      },
    ],
    availability: [
      {
        label: "Stock Controls",
        items: [
          subItem("Live availability (86)", "/menu/availability", CheckSquare),
          subItem("Shift timings", "/menu/availability/timings", Clock3),
        ],
      },
    ],
    digital: [
      {
        label: "Customer Access",
        items: [
          subItem("Digital QR menu", "/menu/digital", PanelTop),
          subItem("Menu settings", "/menu/digital/settings", Settings2),
        ],
      },
    ],
  },
  inventory: {
    overview: [
      {
        label: "Inventory Today",
        items: [
          subItem("Stock overview", "/inventory/overview", LayoutDashboard),
          subItem("Low stock alerts", "/inventory/overview/alerts", Bell),
        ],
      },
    ],
    stock: [
      {
        label: "Stock Control",
        items: [
          subItem("Raw ingredients", "/inventory/stock/ingredients", Salad),
          subItem("Stock levels", "/inventory/stock/levels", Boxes),
          subItem("Stock movement", "/inventory/stock/movement", RefreshCw),
          subItem("Kitchen wastage", "/inventory/stock/wastage", XCircle),
        ],
      },
    ],
    procure: [
      {
        label: "Procurement",
        items: [
          subItem("Purchase orders", "/inventory/procure/purchases", ShoppingCart),
          subItem("Vendors & suppliers", "/inventory/procure/suppliers", Truck),
        ],
      },
    ],
    recipes: [
      {
        label: "Production",
        items: [
          subItem("Recipes & yield", "/inventory/recipes", BookOpen),
          subItem("Inventory settings", "/inventory/recipes/settings", Settings2),
        ],
      },
    ],
  },
  customers: {
    directory: [
      {
        label: "Guest Directory",
        items: [
          subItem("All customers", "/customers/overview", Users),
          subItem("New customers", "/customers/overview/new", UserPlus),
          subItem("Regular customers", "/customers/overview/regular", UserCheck),
        ],
      },
    ],
    loyalty: [
      {
        label: "Loyalty Program",
        items: [
          subItem("Loyalty rewards", "/customers/loyalty", HeartHandshake),
          subItem("Points ledger", "/customers/loyalty/points", WalletCards),
        ],
      },
    ],
    feedback: [
      {
        label: "Guest Experience",
        items: [
          subItem("Guest feedback", "/customers/feedback", MessageSquare),
          subItem("Review card taps", "/customers/feedback/reviews", Sparkles),
        ],
      },
    ],
    segments: [
      {
        label: "Target Groups",
        items: [subItem("Customer groups", "/customers/segments", UsersRound)],
      },
    ],
  },
  marketing: {
    campaigns: [
      {
        label: "Campaigns",
        items: [
          subItem("Marketing overview", "/marketing/overview", LayoutDashboard),
          subItem("All campaigns", "/marketing/campaigns", Megaphone),
          subItem("Automated journeys", "/marketing/campaigns/journeys", Zap),
        ],
      },
    ],
    offers: [
      {
        label: "Offers & Rewards",
        items: [
          subItem("Promo codes", "/marketing/offers", TicketPercent),
          subItem("Discounts", "/marketing/offers/discounts", BadgePercent),
          subItem("Loyalty incentives", "/marketing/offers/loyalty", HeartHandshake),
        ],
      },
    ],
    messages: [
      {
        label: "Messaging",
        items: [
          subItem("WhatsApp broadcasts", "/marketing/messages", MessageSquare),
          subItem("SMS announcements", "/marketing/messages/sms", Phone),
        ],
      },
    ],
    analytics: [
      {
        label: "Performance",
        items: [subItem("Growth & stats", "/marketing/overview/stats", BarChart3)],
      },
    ],
  },
  finance: {
    overview: [
      {
        label: "Financial Pulse",
        items: [
          subItem("Financial overview", "/finance/overview", LayoutDashboard),
          subItem("Daily closing", "/finance/overview/closing", Receipt),
        ],
      },
    ],
    sales: [
      {
        label: "Sales & Income",
        items: [
          subItem("Sales ledger", "/finance/sales", BarChart3),
          subItem("Expense records", "/finance/sales/expenses", ReceiptText),
        ],
      },
    ],
    settlements: [
      {
        label: "Money Received",
        items: [
          subItem("Bank settlements", "/finance/settlements", HandCoins),
          subItem("Payment logs", "/finance/settlements/payments", CreditCard),
        ],
      },
    ],
    records: [
      {
        label: "Records & Taxes",
        items: [
          subItem("Invoices", "/finance/records/invoices", FileText),
          subItem("Taxes & GST", "/finance/records/taxes", Percent),
        ],
      },
    ],
  },
  reports: {
    overview: [
      {
        label: "Reports",
        items: [
          subItem("Reports overview", "/reports/overview", LayoutDashboard),
          subItem("Shared reports", "/reports/overview/shared", Handshake),
        ],
      },
    ],
    sales: [
      {
        label: "Sales Reports",
        items: [
          subItem("Sales reports", "/reports/sales", BarChart3),
          subItem("Order reports", "/reports/sales/orders", ReceiptText),
        ],
      },
    ],
    performance: [
      {
        label: "Business Performance",
        items: [
          subItem("Menu performance", "/reports/performance/menu", Salad),
          subItem("Inventory reports", "/reports/performance/inventory", Boxes),
          subItem("Customer reports", "/reports/performance/customers", Users),
        ],
      },
    ],
    financial: [
      {
        label: "Financial Summaries",
        items: [
          subItem("Profit summary", "/reports/financial/profit", WalletCards),
          subItem("Tax audit report", "/reports/financial/taxes", Percent),
        ],
      },
    ],
  },
  staff: {
    overview: [
      {
        label: "Team",
        items: [
          subItem("Staff overview", "/staff/overview", LayoutDashboard),
          subItem("Attendance snapshot", "/staff/overview/attendance", CheckSquare),
        ],
      },
    ],
    team: [
      {
        label: "Team Directory",
        items: [
          subItem("Team members", "/staff/team", Users),
          subItem("Roles & permissions", "/staff/team/roles", ShieldCheck),
        ],
      },
    ],
    operations: [
      {
        label: "People Operations",
        items: [
          subItem("Shift schedules", "/staff/operations/schedules", Clock3),
          subItem("Daily attendance", "/staff/operations/attendance", CalendarDays),
        ],
      },
    ],
    activity: [
      {
        label: "Audit",
        items: [
          subItem("Activity log", "/staff/activity", History),
          subItem("Audit trail", "/staff/activity/audit", ShieldCheck),
        ],
      },
    ],
  },
  settings: {
    business: [
      {
        label: "Business",
        items: [
          subItem("Business profile", "/settings/profile", Building2),
          subItem("Locations", "/settings/locations", Store),
          subItem("Order channels", "/settings/channels", ShoppingBag),
        ],
      },
    ],
    operations: [
      {
        label: "Operations",
        items: [
          subItem("Staff and roles", "/settings/staff", Users),
          subItem("Payment settings", "/settings/payments", CreditCard),
          subItem("Notifications", "/settings/notifications", Bell),
        ],
      },
    ],
    account: [
      {
        label: "Account",
        items: [
          subItem("Subscription", "/settings/subscription", WalletCards),
          subItem("Security", "/settings/security", ShieldCheck),
        ],
      },
    ],
    customize: [
      {
        label: "Customize",
        items: [
          subItem("Appearance", "/settings/appearance", Palette),
          subItem("Advanced settings", "/settings/advanced", SlidersHorizontal),
        ],
      },
    ],
  },
  help: {
    learn: [
      {
        label: "Learn",
        items: [
          subItem("Help center", "/help/learn", CircleHelp),
          subItem("FAQ & answers", "/help/learn/faq", BookOpen),
        ],
      },
    ],
    guides: [
      {
        label: "Guides",
        items: [
          subItem("Getting started", "/help/guides/getting-started", BookOpen),
          subItem("Hardware & POS setup", "/help/guides/hardware", SlidersHorizontal),
        ],
      },
    ],
    updates: [
      {
        label: "Updates",
        items: [
          subItem("Release notes", "/help/updates", History),
          subItem("System status", "/help/updates/status", Radio),
        ],
      },
    ],
    support: [
      {
        label: "Support",
        items: [
          subItem("Contact support", "/help/support", MessageSquare),
          subItem("Priority desk", "/help/support/priority", ShieldCheck),
        ],
      },
    ],
  },
};

type PageSidebarProps = {
  section: string;
  title: string;
};

export function PageSidebar({ section, title }: PageSidebarProps) {
  const pathname = usePathname();
  const normalizedSec = section.toLowerCase();
  const railItems = railItemsBySection[normalizedSec] ?? [];
  const sectionGroups = groupsBySectionAndRail[normalizedSec] ?? {};

  const [isContextOpen, setIsContextOpen] = useState(true);

  const matchesPath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const activeRail = railItems
    .flatMap((rail) => [
      { rail, href: rail.href },
      ...(sectionGroups[rail.id] ?? []).flatMap((group) =>
        group.items.map((item) => ({ rail, href: item.href })),
      ),
    ])
    .filter(({ href }) => matchesPath(href))
    .sort((left, right) => right.href.length - left.href.length)[0]?.rail ?? railItems[0];

  const currentGroups = activeRail ? sectionGroups[activeRail.id] ?? [] : [];
  const activeSubItemHref = currentGroups
    .flatMap((group) => group.items)
    .filter((item) => matchesPath(item.href))
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;

  return (
    <aside
      className="sticky top-14 flex h-[calc(100dvh-3.5rem)] shrink-0 self-start bg-white"
      style={{ borderRight: "1px solid #eef0f3" }}
    >
      {/* Icon Rail (Layer 2) */}
      <nav
        aria-label="Sub-navigation rail"
        className="flex h-full w-13 flex-col items-center justify-between pt-3"
        style={{ borderRight: "1px solid #eef0f3", background: "#f8f9fb" }}
      >
        <div className="flex flex-col items-center gap-1">
          {/* Collapse toggle */}
          <button
            type="button"
            aria-label={`${isContextOpen ? "Hide" : "Show"} ${title} sidebar`}
            aria-expanded={isContextOpen}
            onClick={() => setIsContextOpen((open) => !open)}
            className="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/40"
          >
            {isContextOpen ? (
              <PanelLeftClose size={16} strokeWidth={1.75} />
            ) : (
              <PanelLeftOpen size={16} strokeWidth={1.75} />
            )}
            <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#14181F] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/20 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100">
              {isContextOpen ? "Hide sidebar" : "Show sidebar"}
            </span>
          </button>

          <span aria-hidden="true" className="mb-1 mt-0.5 h-px w-8 bg-slate-200" />

          {/* Rail Icons */}
          {railItems.map((rail) => {
            const Icon = rail.icon;
            const isActive = activeRail?.id === rail.id;

            return (
              <Link
                key={rail.id}
                href={rail.href}
                aria-label={rail.label}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/40 ${
                  isActive
                    ? "bg-white text-[#FF5B2E] shadow-sm shadow-slate-200"
                    : "text-slate-400 hover:bg-white hover:text-slate-600"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute right-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 translate-x-full rounded-l-full bg-[#FF5B2E]"
                    aria-hidden="true"
                  />
                )}
                <Icon size={16} strokeWidth={isActive ? 2 : 1.75} />
                <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#14181F] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/20 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {rail.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logout at bottom */}
        <div className="group relative mb-2">
          <LogoutButton iconOnly />
          <span className="pointer-events-none absolute bottom-0 left-full z-30 ml-2.5 whitespace-nowrap rounded-lg bg-[#14181F] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-black/20 transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100">
            Log out
          </span>
        </div>
      </nav>

      {/* Context Panel (Layer 3) */}
      <section
        aria-label={`${title} actions`}
        className={`${
          isContextOpen ? "block" : "hidden"
        } fixed bottom-0 left-13 top-14 z-30 h-[calc(100dvh-3.5rem)] w-60 overflow-y-auto md:static md:z-auto md:h-full md:w-60 md:transition-[width] md:duration-200 ${
          isContextOpen ? "" : "md:w-0"
        }`}
        style={{
          background: "#ffffff",
          borderRight: "1px solid #eef0f3",
          boxShadow: isContextOpen ? "4px 0 20px rgba(0,0,0,0.04)" : "none",
        }}
      >
        {/* Panel Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid #eef0f3" }}
        >
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold text-slate-800">
              {activeRail?.label ?? title}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 capitalize">
              {section} modules
            </p>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-5 px-3 py-4">
          {currentGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400/80">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const isActive = href === activeSubItemHref;

                  return (
                    <Link
                      key={label}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.75 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/35 ${
                        isActive
                          ? "bg-[#FF5B2E]/8 font-medium text-[#c94b20]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        className={`h-3.75 w-3.75 shrink-0 transition-colors duration-150 ${
                          isActive
                            ? "text-[#FF5B2E]"
                            : "text-slate-400 group-hover:text-slate-500"
                        }`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      <span className="min-w-0 whitespace-normal wrap-break-word leading-snug">
                        {label}
                      </span>
                      {isActive && (
                        <span
                          className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5B2E]"
                          aria-hidden="true"
                        />
                      )}
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
