"use client";

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

export default function DashboardNavbar() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLLIElement>(null);
  const visibleNavItems = navItems.slice(0, 7);
  const moreNavItems = navItems.slice(7);

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
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="navbar flex h-14 w-full items-center justify-between border-b px-3.5">
      <div className="flex items-center gap-4">
        <Image
          src="/Icon/apple-touch-icon.png"
          alt="Logo"
          width={35}
          height={35}
        />
        <div className="flex items-center justify-center gap-2 border border-[#dbd8d8] py-1 px-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-gray-500">
            <Image
              src="/cafe_logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-sm font-medium">Munchy Krunchy</span>
          <div className="">
            <ChevronsUpDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <nav>
        <ul className="flex items-center justify-center">
          {visibleNavItems.map((item) => (
            <Link
              href={item.href}
              className="mr-1 inline-block border-b-2 border-transparent p-3 text-sm text-slate-600 transition-colors duration-200 hover:border-blue-300 hover:bg-slate-50 hover:text-slate-950 focus-within:border-slate-400 focus-within:bg-slate-50 focus-within:text-slate-950"
            >
              <li
                key={item.name}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              >
                {item.name}
              </li>
            </Link>
          ))}
          <li
            ref={moreMenuRef}
            className="relative mr-4 inline-block border-b-2 border-transparent p-3 text-sm text-slate-600 transition-colors duration-200 hover:border-blue-300 hover:bg-slate-50 hover:text-slate-950 focus-within:border-slate-400 focus-within:bg-slate-50 focus-within:text-slate-950"
          >
            <button
              type="button"
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
              onClick={() => setIsMoreOpen((open) => !open)}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              More
            </button>
            {isMoreOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-1 min-w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10"
              >
                {moreNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setIsMoreOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:bg-slate-50 focus-visible:outline-none"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-5">
        <div className="border border-[#dbd8d8] rounded-lg px-2 py-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <p>Ask AI</p>
          <ChefHat className="w-4 h-4" />
        </div>
        <Search className="w-5 text-[#3d3d3d]" />
        <Settings className="w-5 text-[#3d3d3d]" />
        <div className="relative mr-1.5">
          <BellRing className="w-5 text-[#3d3d3d]" />
          <span className="absolute text-xs -top-2 -right-3 w-6 h-5 text-white flex items-center justify-center rounded-full bg-[#FF5B2E]">
            10
          </span>
        </div>
        <div className="bg-[#CF68CD] text-white w-8 h-8 p-2 rounded-full flex items-center justify-center text-xs font-semibold">
          MK
        </div>
      </div>
    </div>
  );
}
