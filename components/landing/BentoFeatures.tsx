"use client";

import React from "react";
import Image from "next/image";
import { 
  Layers, 
  ChefHat, 
  Package, 
  Smartphone, 
  MessageSquare, 
  Building2, 
  Check, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  Printer,
  Sparkles,
  Database,
  Activity
} from "lucide-react";

interface BentoFeaturesProps {
  onOpenDemo?: () => void;
}

export default function BentoFeatures() {
  return (
    <section
        id="features"
        className="w-full px-2.5 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto w-full max-w-310">
          {/* Heading */}
          <h2 className="max-w-250 text-balance text-4xl font-semibold -tracking-xl text-neutral-950 sm:text-5xl lg:text-7xl dark:text-white">
            Replace your Fragmented Restaurant Stack
          </h2>
          <p className="mt-5 max-w-xl text-base text-neutral-600 sm:text-lg lg:text-xl dark:text-neutral-400">
            Everything your kitchen, dining room, and back-office needs —
            unified into a single real-time operating model.
          </p>

          {/* Bento grid */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:mt-14 lg:grid-cols-12">
            {/* 01. Omnichannel Hub (full-width banner) */}
            <article className="flex flex-col gap-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl shadow-black/10 sm:p-10 lg:col-span-12 lg:flex-row lg:rounded-[32px]">
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  <span className="font-mono text-[13px] font-semibold tracking-widest text-[#FF5B2E]">
                    01. OMNICHANNEL HUB
                  </span>
                </div>
                <h3 className="mt-6 text-3xl font-semibold -tracking-xl sm:text-4xl lg:text-5xl">
                  One Screen for All Orders
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
                  Swiggy, Zomato, QR Table Orders, Counter POS, and Direct
                  WhatsApp takeaway flow into a single live stream.
                </p>
                <div className="min-h-8 flex-1" />
                <a
                  href="#book"
                  className="mt-8 inline-flex h-13 w-fit items-center gap-2.5 rounded-[14px] bg-[#FF5B2E] px-7 text-[15px] font-semibold text-white transition-[filter] hover:brightness-110 lg:mt-0"
                >
                  Book Live POS Walkthrough
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                {/* Live order ticket */}
                <div className="rounded-[20px] border border-white/10 bg-neutral-900 p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <span className="font-mono text-sm font-semibold text-orange-400">
                      #104 SWIGGY
                    </span>
                    <span className="font-mono text-[13px] text-neutral-500">
                      1m ago
                    </span>
                  </div>
                  <p className="pt-3.5 text-[15px] text-neutral-200">
                    2x Truffle Burger, 1x Fries
                  </p>
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[13px] font-semibold text-emerald-400">
                      ₹740 · Auto-Routed KDS
                    </span>
                    <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs">
                      Printed KOT
                    </span>
                  </div>
                </div>

                {/* Channel chips */}
                <div className="flex flex-wrap gap-3">
                  {[
                    "Swiggy",
                    "Zomato",
                    "QR Tables",
                    "Counter POS",
                    "WhatsApp",
                  ].map((channel) => (
                    <span
                      key={channel}
                      className="rounded-full border border-white/15 px-3.5 py-2 font-mono text-xs text-neutral-300"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* 02. Speed & Sync (wide) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">02. SPEED &amp; SYNC</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Real-time
                </span>
              </div>
              <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0 flex-1 basis-70">
                  <h3 className="text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                    Instant KDS Dispatch
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Station routing across Grill, Barista, Fryer with prep
                    countdown timers and audio ticket chimes.
                  </p>
                </div>
                <div className="text-6xl font-semibold leading-none -tracking-xl text-emerald-700 dark:text-emerald-400">
                  0.05s
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 font-mono text-[13px] text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
                Active Prep Station:{" "}
                <span className="font-semibold text-orange-700 dark:text-orange-400">
                  Grill (03:45)
                </span>
              </div>
            </article>

            {/* 03. Data Isolation (narrow) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">03. DATA ISOLATION</span>
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  Isolated
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                Database-per-Business
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                Physical database partition for every registered brand. Zero
                shared multi-tenant table risk.
              </p>
              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 font-mono text-[13px] text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
                  <span>Secret Vault:</span>
                  <span className="font-semibold text-violet-700 dark:text-violet-400">
                    AES-256 Encrypted
                  </span>
                </div>
              </div>
            </article>

            {/* 04. Global Kill-Switch (narrow) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">04. GLOBAL KILL-SWITCH</span>
                <span className="font-semibold text-red-700 dark:text-red-400">
                  Item 86
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                Universal Out-of-Stock
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                One toggle marks sold-out dishes unavailable on Swiggy, Zomato,
                QR menus, and POS simultaneously.
              </p>
              <div className="mt-auto flex items-baseline justify-between pt-6 font-mono text-[13px]">
                <span className="text-neutral-500">Sync Latency:</span>
                <span className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                  Sub-Second
                </span>
              </div>
            </article>

            {/* 05. Inventory Engine (wide) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">05. INVENTORY ENGINE</span>
                <span className="font-semibold text-violet-700 dark:text-violet-400">
                  Sub-Gram
                </span>
              </div>
              <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0 flex-1 basis-70">
                  <h3 className="text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                    Recipe-Level Stock Ledger
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Every burger sold auto-deducts 150g patty, 1 bun, and 20g
                    sauce to eliminate unexplained kitchen shrinkage.
                  </p>
                </div>
                <div className="text-6xl font-semibold leading-none -tracking-xl text-violet-700 dark:text-violet-400">
                  100%
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3.5 font-mono text-[13px] text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
                <span>Stock Movements:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  100% Immutable
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>
  );
}
