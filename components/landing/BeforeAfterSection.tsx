"use client";

import React from "react";
import { XCircle, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function BeforeAfterSection() {
  const problems = [
    {
      title: "Fragmented Hardware & Order Rings",
      desc: "Swiggy tablet, Zomato tablet, separate POS terminal, and handwritten KOT paper tickets causing kitchen mistakes during rush hours.",
    },
    {
      title: "Manual Multi-Portal Menu Updates",
      desc: "Running out of an ingredient requires manually marking it unavailable across 4 different vendor tablets. Missed updates cause cancellations.",
    },
    {
      title: "Unrecorded Ingredient Spoilage & Theft",
      desc: "Weekly inventory spreadsheets that fail to reconcile actual raw material consumption against dishes sold.",
    },
    {
      title: "Zero Direct Customer Ownership",
      desc: "Food delivery aggregators mask customer phone numbers, preventing direct remarketing or loyalty incentives.",
    },
  ];

  const solutions = [
    {
      title: "Unified Single-Screen Command Center",
      desc: "Swiggy, Zomato, QR Table Orders, Counter POS, and Takeaway arrive in one centralized order queue with automatic KDS routing.",
    },
    {
      title: "Global 1-Click Item 86 Kill-Switch",
      desc: "Mark an item out of stock once; Urban Kitchen automatically updates Swiggy, Zomato, QR digital menus, and the POS terminal.",
    },
    {
      title: "Sub-Gram Recipe-Level Auto-Deductions",
      desc: "Every dish sold decrements raw materials according to your master recipe, providing an accurate, immutable stock ledger.",
    },
    {
      title: "100% Owned Customer CRM & WhatsApp Hub",
      desc: "Guests scan QR menus and tap NFC cards, building your private guest database for automated receipts and review prompts.",
    },
  ];

  return (
    <section className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#090C12] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            Operational Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            The Fragmented Architecture vs. Urban Kitchen
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            A comparison of traditional multi-vendor restaurant setups versus our unified operating system.
          </p>
        </div>

        {/* Comparison Side-by-Side */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Legacy Problem Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#120F12] border border-red-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-red-500/10">
                <span className="text-sm font-bold text-red-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  Fragmented Multi-Vendor Stack
                </span>
                <span className="text-[11px] font-mono text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-500/20">
                  Legacy Reality
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {problems.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-red-400/80 mt-0.5">0{idx + 1}.</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-200">{p.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-red-500/10 text-xs text-red-300">
              High operational overhead, duplicated work, and manual reconciliation.
            </div>
          </div>

          {/* Urban Kitchen Solution Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D1614] border border-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/10">
                <span className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Urban Kitchen Unified Architecture
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
                  Unified Standard
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {solutions.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">0{idx + 1}.</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{s.title}</h4>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-emerald-500/10 text-xs text-emerald-300">
              Single operational data model with sub-second synchronization.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
