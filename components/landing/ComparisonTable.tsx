"use client";

import React from "react";
import { Check, X, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function ComparisonTable() {
  const rows = [
    {
      feature: "Unified Swiggy & Zomato Aggregator Order Hub",
      urbanKitchen: "Included (One unified order queue)",
      legacy: "Requires separate noisy tablets",
    },
    {
      feature: "Global 1-Click Item 86 Kill-Switch",
      desc: "Instantly disables sold-out items across Swiggy, Zomato, QR, and POS",
      urbanKitchen: "Yes (Sub-second sync)",
      legacy: "Manual toggle on each portal",
    },
    {
      feature: "Smart QR & NFC Table Ordering with UPI Split",
      desc: "Zero-wait dining without app downloads",
      urbanKitchen: "Yes (Dynamic TableRoute tokens)",
      legacy: "No / Basic PDF menu viewer",
    },
    {
      feature: "Kitchen Display System (KDS) Station Routing",
      desc: "Real-time ticket routing across Grill, Barista, and Fryer",
      urbanKitchen: "Yes (Works on any tablet/display)",
      legacy: "Handwritten paper slips or expensive terminals",
    },
    {
      feature: "Recipe-Level Live Ingredient Stock Ledger",
      desc: "Sub-gram raw material decrementing on dish completion",
      urbanKitchen: "Yes (Automated PO generation)",
      legacy: "Weekly manual spreadsheets",
    },
    {
      feature: "Database-per-Business Isolation",
      desc: "Physical PostgreSQL database isolation via Neon",
      urbanKitchen: "Yes (Bank-grade privacy)",
      legacy: "Shared multi-tenant tables",
    },
    {
      feature: "Hardware Agnostic & Zero Lock-In",
      desc: "Runs on iPads, Android, Windows, and standard ESC/POS printers",
      urbanKitchen: "Yes (Bring your own devices)",
      legacy: "Forced expensive hardware bundles",
    },
  ];

  return (
    <section id="comparison" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-100 dark:bg-[#07090E] border-t border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div>
          <span className="font-mono text-xs text-[#FF5B2E] font-bold uppercase tracking-widest block mb-2">
            Detailed Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
            Urban Kitchen vs. Traditional Legacy POS
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            See how our unified architecture compares against legacy billing software and fragmented multi-vendor setups.
          </p>
        </div>

        {/* Main Comparison Table Container matching Aceternity Reference */}
        <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0A0D14] text-xs font-mono">
                  <th className="p-4 sm:p-5 text-neutral-500 font-bold uppercase tracking-wider w-2/5">
                    Platform Capability
                  </th>
                  <th className="p-4 sm:p-5 text-neutral-900 dark:text-white font-bold uppercase tracking-wider w-3/10 bg-[#FF5B2E]/5">
                    <span className="text-[#FF5B2E] flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Urban Kitchen
                    </span>
                  </th>
                  <th className="p-4 sm:p-5 text-neutral-500 font-bold uppercase tracking-wider w-3/10">
                    Legacy Fragmented POS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs sm:text-sm">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-medium text-neutral-900 dark:text-neutral-200">
                      <div>{row.feature}</div>
                      {row.desc && (
                        <div className="text-xs text-neutral-500 font-normal mt-0.5">
                          {row.desc}
                        </div>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-emerald-600 dark:text-emerald-400 bg-[#FF5B2E]/5">
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="size-3 text-emerald-500" />
                        </div>
                        <span>{row.urbanKitchen}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-neutral-500">
                      <div className="flex items-center gap-2">
                        <div className="size-4 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                          <X className="size-3 text-red-500" />
                        </div>
                        <span>{row.legacy}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Highlight Cards Below Table matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
            <span className="font-mono text-xs text-[#FF5B2E] font-bold">01. UNIFIED STREAM</span>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Zero Missed Orders</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Consolidate every channel into one centralized order queue with sub-second kitchen ticket printing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
            <span className="font-mono text-xs text-emerald-500 font-bold">02. FOOD COST CONTROL</span>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Eliminate Shrinkage</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Sub-gram recipe auto-deductions provide accurate stock variance reporting and vendor purchase orders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
            <span className="font-mono text-xs text-blue-500 font-bold">03. DATA OWNERSHIP</span>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Direct Guest Hub</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Capture verified guest phone numbers at the table for automated receipts and 5-star Google review triggers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
