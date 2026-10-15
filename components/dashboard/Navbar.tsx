"use client";

import {
  BellRing,
  ChefHat,
  ChevronsUpDown,
  Menu,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Menu", href: "/menu" },
  { name: "Inventory", href: "/inventory" },
  { name: "Customers", href: "/customers" },
  { name: "Marketing", href: "/marketing" },
  { name: "Finance", href: "/finance" },
  { name: "Reports", href: "/reports" },
  { name: "Staff", href: "/staff" },
  { name: "Settings", href: "/settings" },
  { name: "Help", href: "/help" },
];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function UtilityActions({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "grid grid-cols-2 gap-2" : "flex items-center gap-4"}>
      <button
        type="button"
        className={`flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
          mobile ? "h-11 px-3" : "px-2 py-1"
        }`}
      >
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span>Ask AI</span>
        <ChefHat className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Search"
        className={`flex items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
          mobile ? "h-11 gap-2 border border-slate-200 px-3" : "h-9 w-9"
        }`}
      >
        <Search className="h-5 w-5" />
        {mobile ? <span>Search</span> : null}
      </button>
      <button
        type="button"
        aria-label="Settings"
        className={`flex items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
          mobile ? "h-11 gap-2 border border-slate-200 px-3" : "h-9 w-9"
        }`}
      >
        <Settings className="h-5 w-5" />
        {mobile ? <span>Settings</span> : null}
      </button>
      <button
        type="button"
        aria-label="Notifications, 10 unread"
        className={`relative flex items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
          mobile ? "h-11 gap-2 border border-slate-200 px-3" : "h-9 w-9"
        }`}
      >
        <BellRing className="h-5 w-5" />
        {mobile ? <span>Notifications</span> : null}
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-1 text-[10px] font-semibold text-white">
          10
        </span>
      </button>
    </div>
  );
}

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const moreMenuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  function closeMobileMenu() {
    setIsMobileOpen(false);
  }

  return (
    <header className="relative z-40 w-full border-b border-slate-200 bg-white">
      <div className="flex min-h-14 items-center justify-between gap-3 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link href="/dashboard" aria-label="Go to dashboard">
            <Image
              src="/Icon/apple-touch-icon.png"
              alt="Urban Kitchen"
              width={35}
              height={35}
            />
          </Link>
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-slate-500">
              <Image
                src="/cafe_logo.png"
                alt=""
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="max-w-32 truncate text-sm font-medium text-slate-800 sm:max-w-none">
              Munchy Krunchy
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-500" />
          </button>
        </div>

        <nav className="hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center">
            {navItems.slice(0, 7).map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`mx-0.5 block border-b-2 px-3 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                    isActiveRoute(pathname, item.href)
                      ? "border-slate-800 bg-slate-50 font-medium text-slate-950"
                      : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li ref={moreMenuRef} className="relative">
              <button
                type="button"
                aria-expanded={isMoreOpen}
                aria-haspopup="menu"
                onClick={() => setIsMoreOpen((open) => !open)}
                className="mx-0.5 border-b-2 border-transparent px-3 py-3 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                More
              </button>
              {isMoreOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 min-w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10"
                >
                  {navItems.slice(7).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setIsMoreOpen(false)}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none ${
                        isActiveRoute(pathname, item.href)
                          ? "bg-slate-100 font-medium text-slate-950"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <UtilityActions />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CF68CD] text-xs font-semibold text-white">
            MK
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CF68CD] text-xs font-semibold text-white">
            MK
          </div>
          <button
            type="button"
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/20 transition-opacity duration-200 lg:hidden ${
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMobileOpen}
        onClick={closeMobileMenu}
      />
      <div
        className={`fixed bottom-0 right-0 top-14 z-50 w-[min(22rem,calc(100vw-3rem))] overflow-y-auto overscroll-contain rounded-l-2xl border-l border-slate-200 bg-white px-3 pb-6 pt-3 shadow-2xl shadow-slate-950/15 transition-transform duration-300 ease-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div className="flex min-h-full flex-col">
          <nav aria-label="Mobile navigation">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-2 pb-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Workspace</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Manage your restaurant
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Menu
              </span>
            </div>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Navigate
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex min-h-10 items-center rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                    isActiveRoute(pathname, item.href)
                      ? "border-slate-200 bg-slate-100 font-semibold text-slate-950"
                      : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Tools
            </p>
            <UtilityActions mobile />
          </div>
          <p className="mt-auto px-2 pt-8 text-center text-[11px] text-slate-400">
            Urban Kitchen
          </p>
        </div>
      </div>
    </header>
  );
}
