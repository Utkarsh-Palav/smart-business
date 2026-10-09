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

export default function BentoFeatures({ onOpenDemo }: BentoFeaturesProps) {
  return (
    <section id="features" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header matching Aceternity reference */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-white tracking-tight">
            Replace your Fragmented Restaurant Stack
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Everything your kitchen, dining room, and back-office needs — unified into a single real-time operating model.
          </p>
        </div>

        {/* Bento Grid matching the exact layout of the screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left Tall Card (Col-Span 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-neutral-950 text-white border border-neutral-800 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#FF5B2E] font-bold uppercase tracking-wider">
                  01. Omnichannel Hub
                </span>
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white">
                One Screen for All Orders
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Swiggy, Zomato, QR Table Orders, Counter POS, and Direct WhatsApp takeaway flow into a single live stream.
              </p>

              {/* Simulated POS terminal inside card */}
              <div className="mt-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
                  <span className="text-[#FC8019] font-bold">#104 SWIGGY</span>
                  <span className="text-neutral-400 font-mono">1m ago</span>
                </div>
                <div className="text-xs text-neutral-200">2x Truffle Burger, 1x Fries</div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-mono font-bold text-emerald-400">₹740 • Auto-Routed KDS</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-mono">Printed KOT</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-800">
              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full py-2.5 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Book Live POS Walkthrough</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Bento Grid Container (Col-Span 7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Top Card 1: Channel Breakdown & Speed */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                  <span>02. SPEED & SYNC</span>
                  <span className="text-emerald-500 font-bold">0.05s</span>
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-3">
                  Instant KDS Dispatch
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Station routing across Grill, Barista, Fryer with prep countdown timers and audio ticket chimes.
                </p>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex justify-between items-center font-mono">
                <span className="text-neutral-700 dark:text-neutral-300">Active Prep Station:</span>
                <span className="text-amber-500 font-bold">Grill (03:45)</span>
              </div>
            </div>

            {/* Top Card 2: Architecture Node Graph */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                  <span>03. DATA ISOLATION</span>
                  <span className="text-blue-500 font-bold">PostgreSQL</span>
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-3">
                  Neon DB-per-Business
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Physical database partition for every registered brand. Zero shared multi-tenant table risk.
                </p>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex justify-between items-center font-mono">
                <span className="text-neutral-700 dark:text-neutral-300">Secret Vault:</span>
                <span className="text-purple-500 font-bold">Infisical AES-256</span>
              </div>
            </div>

            {/* Bottom Card 1: 1-Click Global Item 86 Killswitch */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                  <span>04. GLOBAL KILL-SWITCH</span>
                  <span className="text-red-500 font-bold">Item 86</span>
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-3">
                  Universal Out-of-Stock
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  One toggle marks sold-out dishes unavailable on Swiggy, Zomato, QR menus, and POS simultaneously.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Sync Latency:</span>
                <span className="text-emerald-500 font-bold">Sub-Second</span>
              </div>
            </div>

            {/* Bottom Card 2: Recipe-Level Stock Deductions */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-500">
                  <span>05. INVENTORY ENGINE</span>
                  <span className="text-purple-500 font-bold">Sub-Gram</span>
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mt-3">
                  Recipe-Level Stock Ledger
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Every burger sold auto-deducts 150g patty, 1 bun, and 20g sauce to eliminate unexplained kitchen shrinkage.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>Stock Movements:</span>
                <span className="text-emerald-500 font-bold">100% Immutable</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
