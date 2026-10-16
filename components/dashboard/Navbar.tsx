"use client";

import {
  BellRing,
  BarChart3,
  CircleHelp,
  ChevronDown,
  ArrowRight,
  ChevronsUpDown,
  Menu,
  Settings2,
  Search,
  Settings,
  Sparkles,
  UsersRound,
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

const moreIcons = {
  Reports: BarChart3,
  Staff: UsersRound,
  Settings: Settings2,
  Help: CircleHelp,
};

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function UtilityActions({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "grid grid-cols-2 gap-2" : "flex items-center gap-1.5"}>
      <button
        type="button"
        aria-label="Ask AI to get smart insights"
        className={`group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] text-sm font-medium text-white/90 shadow-sm transition-all duration-200 hover:border-[#FF5B2E]/35 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/50 ${
          mobile ? "h-11 px-3.5" : "h-8 px-2.5"
        }`}
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FF5B2E]/0 via-[#FF5B2E]/6 to-orange-400/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="relative flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#FF5B2E] to-orange-500 text-white shadow-sm shadow-[#FF5B2E]/40 transition-transform duration-200 group-hover:scale-105">
          <Sparkles className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
        </span>
        <span className="relative flex flex-col items-start leading-none">
          <span className="whitespace-nowrap text-[13px]">Ask AI</span>
          <span className="mt-0.5 hidden text-[9px] font-normal tracking-wide text-[#FF5B2E]/75 sm:block">
            Smart insights
          </span>
        </span>
        <span className="relative ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white/35 transition-all duration-200 group-hover:text-[#FF5B2E]">
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </button>
      <button
        type="button"
        aria-label="Search"
        className={`flex cursor-pointer items-center justify-center rounded-lg text-white/45 transition-colors duration-150 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
          mobile ? "h-11 gap-2 border border-white/10 px-3" : "h-8 w-8"
        }`}
      >
        <Search className="h-4 w-4" />
        {mobile ? <span className="text-sm">Search</span> : null}
      </button>
      <button
        type="button"
        aria-label="Settings"
        className={`flex cursor-pointer items-center justify-center rounded-lg text-white/45 transition-colors duration-150 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
          mobile ? "h-11 gap-2 border border-white/10 px-3" : "h-8 w-8"
        }`}
      >
        <Settings className="h-4 w-4" />
        {mobile ? <span className="text-sm">Settings</span> : null}
      </button>
      <button
        type="button"
        aria-label="Notifications, 10 unread"
        className={`relative flex cursor-pointer items-center justify-center rounded-lg text-white/45 transition-colors duration-150 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
          mobile ? "h-11 gap-2 border border-white/10 px-3" : "h-8 w-8"
        }`}
      >
        <BellRing className="h-4 w-4" />
        {mobile ? <span className="text-sm">Notifications</span> : null}
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF5B2E] px-1 text-[9px] font-bold text-white shadow-sm shadow-[#FF5B2E]/50">
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
    <header className="sticky top-0 z-40 w-full bg-[#14181F]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex min-h-14 items-center justify-between gap-3 px-3 sm:px-4">
        {/* Left: Logo + Store Switcher */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
          <Link href="/dashboard" aria-label="Go to dashboard" className="shrink-0">
            <Image
              src="/Icon/apple-touch-icon.png"
              alt="Urban Kitchen"
              width={32}
              height={32}
              className="rounded-xl"
            />
          </Link>

          {/* Vertical divider */}
          <span className="hidden h-5 w-px bg-white/10 sm:block" aria-hidden="true" />

          <button
            type="button"
            className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.05] px-2.5 py-1.5 text-left transition-all duration-200 hover:border-white/15 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/40"
          >
            <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
              <Image
                src="/cafe_logo.png"
                alt=""
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="max-w-28 truncate text-sm font-medium text-white/80 sm:max-w-none">
              Munchy Krunchy
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-white/30" />
          </button>
        </div>

        {/* Center: Main nav */}
        <nav className="hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center">
            {navItems.slice(0, 7).map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`relative mx-0.5 block px-3 py-[14px] text-[13.5px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/40 ${
                      active
                        ? "text-white"
                        : "text-white/48 hover:text-white/82"
                    }`}
                  >
                    {item.name}
                    {active && (
                      <span
                        className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#FF5B2E]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
            <li ref={moreMenuRef} className="relative">
              <button
                type="button"
                aria-expanded={isMoreOpen}
                aria-haspopup="menu"
                onClick={() => setIsMoreOpen((open) => !open)}
                className={`relative mx-0.5 flex cursor-pointer items-center justify-center gap-1 px-3 py-[14px] text-[13.5px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/40 ${
                  isMoreOpen
                    ? "text-white"
                    : "text-white/48 hover:text-white/82"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                />
                {isMoreOpen && (
                  <span
                    className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#FF5B2E]"
                    aria-hidden="true"
                  />
                )}
              </button>
              {isMoreOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 min-w-44 rounded-xl border border-white/[0.09] bg-[#1C2229] p-1.5 shadow-2xl shadow-black/50"
                >
                  {navItems.slice(7).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-none ${
                        isActiveRoute(pathname, item.href)
                          ? "bg-[#FF5B2E]/12 font-medium text-white"
                          : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {(() => {
                        const Icon = moreIcons[item.name as keyof typeof moreIcons];
                        return (
                          <Icon
                            className={`h-4 w-4 ${
                              isActiveRoute(pathname, item.href)
                                ? "text-[#FF5B2E]"
                                : "text-white/35"
                            }`}
                          />
                        );
                      })()}
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          </ul>
        </nav>

        {/* Right: Utility actions + Avatar */}
        <div className="hidden items-center gap-3 lg:flex">
          <UtilityActions />
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#FF5B2E] to-[#e04520] text-[11px] font-bold text-white shadow-sm shadow-[#FF5B2E]/30 ring-[1.5px] ring-[#FF5B2E]/25 transition-all duration-200 hover:ring-[#FF5B2E]/45">
            MK
          </div>
        </div>

        {/* Mobile: Avatar + Hamburger */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5B2E] to-[#e04520] text-[11px] font-bold text-white shadow-sm shadow-[#FF5B2E]/30">
            MK
          </div>
          <button
            type="button"
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((open) => !open)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/55 transition-colors duration-150 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMobileOpen}
        onClick={closeMobileMenu}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed bottom-0 right-0 top-14 z-50 w-[min(22rem,calc(100vw-3rem))] overflow-y-auto overscroll-contain rounded-l-2xl border-l border-white/[0.08] bg-[#14181F] px-3 pb-6 pt-3 shadow-2xl shadow-black/60 transition-transform duration-300 ease-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div className="flex min-h-full flex-col">
          <nav aria-label="Mobile navigation">
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.07] px-2 pb-3">
              <div>
                <p className="text-sm font-semibold text-white/85">Workspace</p>
                <p className="mt-0.5 text-xs text-white/35">
                  Manage your restaurant
                </p>
              </div>
              <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/35">
                Menu
              </span>
            </div>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">
              Navigate
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex min-h-10 cursor-pointer items-center rounded-lg border px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/35 ${
                    isActiveRoute(pathname, item.href)
                      ? "border-[#FF5B2E]/25 bg-[#FF5B2E]/10 font-semibold text-white"
                      : "border-transparent text-white/50 hover:border-white/[0.09] hover:bg-white/[0.05] hover:text-white/85"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="mt-5 border-t border-white/[0.07] pt-4">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">
              Tools
            </p>
            <UtilityActions mobile />
          </div>
          <p className="mt-auto px-2 pt-8 text-center text-[11px] text-white/22">
            Urban Kitchen
          </p>
        </div>
      </div>
    </header>
  );
}
