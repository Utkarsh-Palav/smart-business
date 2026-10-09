"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X, ChevronRight } from "lucide-react";

interface AceternityHeroProps {
  onOpenDemo?: () => void;
}

export default function AceternityHero({ onOpenDemo }: AceternityHeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full p-2 sm:p-4 md:p-6 bg-white dark:bg-black">
      {/* Framed Dark Container matching Aceternity Reference */}
      <div className="relative w-full rounded-[28px] sm:rounded-[36px] bg-black border border-neutral-800 overflow-hidden flex flex-col justify-between min-h-[85vh] lg:min-h-[90vh]">
        
        {/* Background Ambient SVG Arcs and Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Top Warm Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-[#FF5B2E]/10 rounded-full blur-[140px]" />

          {/* Curved Golden/Orange Arcs at the Bottom (Aceternity Signature Arc) */}
          <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[1600px] h-200 flex items-center justify-center opacity-60">
            <svg viewBox="0 0 1600 800" fill="none" className="w-full h-full">
              {/* Outer Dashed Orbit */}
              <ellipse cx="800" cy="800" rx="750" ry="360" stroke="#FF5B2E" strokeWidth="1.5" strokeDasharray="8 8" strokeOpacity="0.3" />
              {/* Main Glowing Solid Arc */}
              <ellipse cx="800" cy="800" rx="640" ry="280" stroke="url(#goldArcGrad)" strokeWidth="3" />
              {/* Soft Inner Arc */}
              <ellipse cx="800" cy="800" rx="500" ry="200" stroke="#F6B253" strokeWidth="1" strokeOpacity="0.5" />
              <defs>
                <linearGradient id="goldArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FA9A63" stopOpacity="0" />
                  <stop offset="30%" stopColor="#FA9A63" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#F6B253" stopOpacity="1" />
                  <stop offset="70%" stopColor="#FA9A63" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FA9A63" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Micro Grid Dot Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-size-[24px_24px] opacity-40" />
        </div>

        {/* Top Navbar Inside Hero */}
        <nav className="relative z-30 w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/10">
          {/* Brand Logo */}
          <Link href="/" className="flex">
            <div className="relative h-8 w-36 sm:h-9 sm:w-44">
              <Image
                src="/Icon/apple-touch-icon.png"
                alt="Urban Kitchen"
                fill
                className="object-contain object-left"
                priority
              />
              <Image
                src="/logo/urban-kitchen-wordmark-dark.svg"
                alt="Urban Kitchen"
                fill
                className="object-contain object-right"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Operations</a>
            <a href="#comparison" className="hover:text-white transition-colors">Comparison</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          {/* Aceternity Style Action Button with Slide/Avatar Icon */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenDemo}
              className="group relative flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-neutral-900/80 px-4 py-2 text-xs font-semibold tracking-tight text-white hover:border-[#FF5B2E] transition-all"
            >
              <span className="inline-block size-2 rounded-full bg-[#FF5B2E] animate-pulse" />
              <span>Book Demo</span>
            </button>

            <a
              href="#pricing"
              className="flex items-center gap-2 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] px-4 py-2 text-xs font-semibold text-white transition-all shadow-md shadow-[#FF5B2E]/20"
            >
              <span>Get Early Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden relative z-40 bg-neutral-950 border-b border-neutral-800 px-6 py-4 space-y-3 text-sm">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white">Features</a>
            <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white">Operations</a>
            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white">Comparison</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300 hover:text-white">FAQ</a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo?.();
                }}
                className="w-full py-2.5 rounded-lg bg-neutral-800 text-white text-xs font-semibold"
              >
                Book Demo
              </button>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#FF5B2E] text-white text-xs font-semibold text-center"
              >
                Get Early Access
              </a>
            </div>
          </div>
        )}

        {/* Hero Body Content */}
        <div className="relative z-20 max-w-6xl mx-auto w-full px-6 sm:px-10 pt-16 sm:pt-24 pb-20 flex flex-col items-start justify-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-xs text-neutral-300 mb-8 backdrop-blur-md">
            <span className="rounded-full bg-[#FF5B2E] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              Urban Kitchen
            </span>
            <span className="text-[11px] text-neutral-300 font-medium">
              The all-in-one restaurant operating system
            </span>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          </div>

          {/* Master 2-Column Hero Structure matching reference */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Headline */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-5xl lg:text-[64px] font-semibold text-white tracking-tight leading-[1.1]">
                The best restaurant operating system in the world.
              </h1>
            </div>

            {/* Right Subtitle & CTA button */}
            <div className="lg:col-span-5 space-y-6 lg:pt-2">
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                Consolidate Swiggy, Zomato, QR table ordering, Cloud POS, live KDS, recipe inventory, and WhatsApp CRM into one platform. No Chaos. No Tablet Juggling. Just Results.
              </p>

              <div>
                <a
                  href="#pricing"
                  className="group relative inline-flex items-center gap-3 rounded-lg border border-white/20 bg-neutral-950 px-5 py-3 text-sm font-semibold tracking-tight text-white hover:border-[#FF5B2E] transition-all"
                >
                  <div className="size-6 rounded bg-[#FF5B2E] flex items-center justify-center text-white text-xs font-bold">
                    →
                  </div>
                  <span>Start 14-Day Free Access</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Aceternity Giant Watermark Typography at Bottom */}
        <div className="relative w-full h-16 sm:h-24 lg:h-32 overflow-hidden pointer-events-none select-none flex items-center justify-center border-t border-white/5">
          <p className="absolute -bottom-4 sm:-bottom-8 lg:-bottom-10 text-center text-[48px] sm:text-[90px] lg:text-[130px] font-extrabold uppercase tracking-tight text-white/4 whitespace-nowrap">
            URBAN KITCHEN
          </p>
        </div>
      </div>
    </div>
  );
}
