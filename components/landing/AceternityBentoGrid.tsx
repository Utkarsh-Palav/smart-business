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
  ShieldCheck,
  AlertTriangle,
  Clock,
  Printer,
  Sparkles
} from "lucide-react";

export default function AceternityBentoGrid() {
  return (
    <section id="bento" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF5B2E] block mb-2">
            Pillars of the Operating System
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
            Replace 5 Fragmented Tools with 1 Engine
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
            Every module is purpose-built to connect directly to our central operational data model — eliminating duplicate order entry, inventory blind spots, and customer communication lag.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Card 1: Large Span - Omnichannel POS Terminal */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#FF5B2E]">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                  Module 01 • Command Hub
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Omnichannel POS & Aggregator Terminal
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed max-w-xl">
                  Consolidate Swiggy, Zomato, QR Table Orders, Counter POS, and Takeaway into a single order queue. One-click global item 86 switch updates availability across all platforms in under 0.05 seconds.
                </p>
              </div>

              {/* UI Snapshot Graphic inside Bento Card */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#111622] border border-white/5 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-gray-400 text-[11px]">
                    <span className="text-[#FC8019] font-bold">#104 SWIGGY</span>
                    <span>1m ago</span>
                  </div>
                  <div className="text-white font-semibold">2x Truffle Burger, 1x Fries</div>
                  <div className="text-emerald-400 font-mono font-bold">₹740 • Auto-Routed KDS</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111622] border border-white/5 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-gray-400 text-[11px]">
                    <span className="text-emerald-400 font-bold">TABLE 04 DINE-IN</span>
                    <span>Just now</span>
                  </div>
                  <div className="text-white font-semibold">1x Margherita Pizza, 2x Tonic</div>
                  <div className="text-emerald-400 font-mono font-bold">₹760 • Table Split Pay</div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 text-xs text-gray-400 flex items-center justify-between">
              <span>ESC/POS Thermal Auto-Print Ready</span>
              <span className="text-[#FF5B2E] font-medium flex items-center gap-1">
                Zero Tablet Clutter <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Kitchen Display System (KDS) */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-emerald-400">
                  <ChefHat className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-gray-400">
                  Module 02
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Live Kitchen Display (KDS)
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Color-coded station routing (Grill, Barista, Fryer, Dessert) with preparation countdown timers and audible ticket chimes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111622] border border-white/5 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Station: Grill & Pizza</span>
                  <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">03:45</span>
                </div>
                <div className="text-gray-300">1x Wood-Fired Margherita</div>
                <div className="text-[10px] text-gray-500 font-mono">Status: In Preparation</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-gray-400">
              Works on iPad, Android & Windows displays
            </div>
          </div>

          {/* Card 3: Recipe-Level Live Inventory */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-purple-400">
                  <Package className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-gray-400">
                  Module 03
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Recipe-Level Stock Ledger
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Sub-gram ingredient auto-deduction on every completed dish. Stop mystery food wastage and generate vendor POs before stock runs dry.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111622] border border-white/5 text-xs space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Brioche Buns:</span>
                  <span className="font-mono font-bold text-white">42 / 100 pcs</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Mozzarella:</span>
                  <span className="font-mono font-bold text-red-400">3.4 kg (Low)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-gray-400">
              Idempotent stock movement tracking
            </div>
          </div>

          {/* Card 4: WhatsApp AI CRM & Customer Ownership */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#00A884]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-gray-400">
                  Module 04
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  100% Owned WhatsApp CRM
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Capture verified guest contacts at tables. Send automated digital invoices, 5-star Google review triggers, and win-back promotions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D1815] border border-emerald-500/20 text-xs space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold block">WhatsApp Cloud API</span>
                <p className="text-gray-200">"Hi Rahul! Here is your bill for ₹970. Tap to leave a 5★ review."</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-gray-400">
              Direct guest relationship without middleman
            </div>
          </div>

          {/* Card 5: Multi-Outlet & Neon Database Isolation */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-blue-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-gray-400">
                  Module 05
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Neon DB-per-Business Isolation
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Multi-brand governance with dedicated Neon PostgreSQL database isolation for each legal entity. Zero cross-tenant data leak risk.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111622] border border-white/5 text-xs space-y-1 font-mono text-gray-300">
                <div className="flex justify-between">
                  <span>Architecture:</span>
                  <span className="text-emerald-400">Control + Tenant DB</span>
                </div>
                <div className="flex justify-between">
                  <span>Secret Vault:</span>
                  <span className="text-purple-400">Infisical AES-256</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-gray-400">
              Franchise royalty calculation engine
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
