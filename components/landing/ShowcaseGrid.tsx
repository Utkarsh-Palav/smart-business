"use client";

import React from "react";
import Image from "next/image";
import { 
  Smartphone, 
  Layers, 
  ChefHat, 
  QrCode, 
  Wifi, 
  Database,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function ShowcaseGrid() {
  return (
    <section id="showcase" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-neutral-100 dark:bg-[#07090E] overflow-hidden">
      {/* Giant Watermark Typography in Background matching reference */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
        <span className="text-[90px] sm:text-[160px] lg:text-[220px] font-bold text-neutral-300/40 dark:text-white/[0.03] tracking-tighter uppercase whitespace-nowrap">
          Operations
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        {/* Section Header */}
        <div>
          <span className="font-mono text-xs text-[#FF5B2E] font-bold uppercase tracking-widest block mb-2">
            Physical-to-Digital Interface
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-white tracking-tight">
            Designed for High-Velocity Service
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            From handcrafted table QR stands to rugged kitchen displays — inspect every operational touchpoint.
          </p>
        </div>

        {/* 6-Card Visual Grid matching Aceternity reference layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: iPad POS & Table Ordering (Hero Image 1) */}
          <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
              <Image
                src="/hero.jpg"
                alt="Table Ordering Interface"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white">
                Tablet POS & Menu
              </div>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Cloud POS & Waiter Ordering
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Take table orders on iPad or Android tablets with live menu synchronization and allergen filters.
              </p>
            </div>
          </div>

          {/* Card 2: Smartphone QR Menu Experience (Hero Image 2) */}
          <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
              <Image
                src="/hero2.jpg"
                alt="Specialty Coffee & Cafe POS"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-[#FF5B2E]">
                Smart QR Menu
              </div>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Zero-Wait Mobile Dining
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Guests scan table QR codes to view high-res visual menus, customize items, and pay table-side.
              </p>
            </div>
          </div>

          {/* Card 3: Kitchen Display System (Hero Image 3) */}
          <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
              <Image
                src="/hero3.jpg"
                alt="Kitchen Display System Station"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400">
                Kitchen KDS Display
              </div>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Live Kitchen Station Routing
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Multi-station ticket management with audio alerts and color-coded preparation countdown timers.
              </p>
            </div>
          </div>

          {/* Card 4: Google Review NFC Smart Card */}
          <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 w-fit text-[#FF5B2E]">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Google Review NFC Tap Card
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                1-Tap phone scan takes guests straight to your 5★ Google Review page via dynamic cloud token `/r/[token]`.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
              Certified NTAG213 Encrypted PVC
            </div>
          </div>

          {/* Card 5: Weatherproof QR Table Stand */}
          <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 w-fit text-amber-500">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Weatherproof QR Table Stand
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Laser-engraved teakwood and crystal acrylic stands that route table tokens (`/t/[token]`) with zero mixups.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
              Anti-Glare Optical Lens
            </div>
          </div>

          {/* Card 6: Neon DB-per-Business Isolation */}
          <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all group p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 w-fit text-blue-500">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Neon DB-per-Business Isolation
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Every business receives a dedicated PostgreSQL instance on Neon with Infisical secret vault protection.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
              Zero Multi-Tenant Data Leakage
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
