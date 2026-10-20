"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Layers, 
  Smartphone, 
  ChefHat, 
  Package, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Calculator,
  Calendar,
  Sparkles
} from "lucide-react";

interface LandingNavbarProps {
  onOpenDemo?: () => void;
}

export default function LandingNavbar({ onOpenDemo }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featureItems = [
    {
      title: "Omnichannel POS Terminal",
      desc: "Unified Swiggy, Zomato, counter & table order queue with 1-click item 86 switch.",
      icon: <Layers className="w-4 h-4 text-[#FF5B2E]" />,
      href: "#modules",
    },
    {
      title: "Smart QR & NFC Table Ordering",
      desc: "Table-side visual ordering, modifiers, and instant guest UPI split billing.",
      icon: <Smartphone className="w-4 h-4 text-[#FF5B2E]" />,
      href: "#modules",
    },
    {
      title: "Live Kitchen Display (KDS)",
      desc: "Station routing (Grill, Barista, Fryer), color-coded timers, and waiter dispatch.",
      icon: <ChefHat className="w-4 h-4 text-[#FF5B2E]" />,
      href: "#modules",
    },
    {
      title: "Recipe-Level Live Inventory",
      desc: "Sub-gram ingredient auto-deduction, wastage logging, and supplier PO generation.",
      icon: <Package className="w-4 h-4 text-[#FF5B2E]" />,
      href: "#modules",
    },
    {
      title: "WhatsApp CRM & Communications",
      desc: "Digital receipts, automated 5★ review collection, and private customer retention.",
      icon: <MessageSquare className="w-4 h-4 text-[#FF5B2E]" />,
      href: "#modules",
    },
    {
      title: "Multi-Outlet & Franchise Hub",
      desc: "Central menu distribution, branch price overrides, and automated royalty splits.",
      icon: <Building2 className="w-4 h-4 text-[#FF5B2E]" />,
      href: "#modules",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200">
      {/* Top Banner */}
      <div className="w-full bg-[#0D1016] border-b border-white/5 py-1.5 px-4 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-gray-300 font-medium">Urban Kitchen Operating System</span>
            <span className="hidden sm:inline text-gray-500">— Early Access Program Now Open</span>
          </div>
          <a
            href="#pricing"
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 font-medium text-[11px]"
          >
            <span>View Founder Plans</span>
            <ArrowRight className="w-3 h-3 text-[#FF5B2E]" />
          </a>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className={`w-full transition-all duration-200 ${
        isScrolled 
          ? "bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40 py-3" 
          : "bg-[#0A0D14]/80 backdrop-blur-sm border-b border-white/5 py-3.5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-8 w-36 sm:h-9 sm:w-44">
              <Image
                src="/logo/urban-kitchen-lockup-dark.svg"
                alt="Urban Kitchen"
                fill
                sizes="(min-width: 640px) 176px, 144px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-300">
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("features")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
              >
                <span>Modules</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "features" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "features" && (
                <div className="absolute top-full left-0 pt-2 w-[520px] animate-in fade-in duration-150">
                  <div className="bg-[#10141E] border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-1.5">
                    {featureItems.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#FF5B2E]/40 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#FF5B2E] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-gray-400 leading-snug mt-0.5 line-clamp-2">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="#hardware" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              Smart Hardware
            </a>
            <a href="#flywheel" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              Operating Workflow
            </a>
            <a href="#calculator" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              ROI Calculator
            </a>
            <a href="#architecture" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenDemo}
              className="text-xs font-semibold text-gray-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FF5B2E]" />
              <span>Request Private Demo</span>
            </button>

            <a
              href="#pricing"
              className="px-4 py-2 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] text-white text-xs font-semibold transition-all duration-150 shadow-sm shadow-[#FF5B2E]/20"
            >
              Get Early Access
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1017] border-b border-white/10 px-4 py-4 space-y-2">
          <a
            href="#modules"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Platform Modules
          </a>
          <a
            href="#hardware"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Smart Hardware
          </a>
          <a
            href="#flywheel"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Operating Workflow
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            ROI Calculator
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Neon Architecture
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Pricing & Early Access
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            FAQ
          </a>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo?.();
              }}
              className="w-full py-2.5 rounded-lg bg-white/5 text-center text-xs font-semibold text-white"
            >
              Request Private Demo
            </button>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#FF5B2E] text-center text-xs font-semibold text-white"
            >
              Get Early Access
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
