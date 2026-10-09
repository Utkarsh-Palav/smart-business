"use client";

import React from "react";
import { ArrowRight, MessageSquareQuote, CheckCircle2 } from "lucide-react";

interface UserInsightsProps {
  onOpenDemo?: () => void;
}

export default function UserInsights({ onOpenDemo }: UserInsightsProps) {
  const insights = [
    {
      company: "SPECIALTY CAFE & ROASTERY",
      headline: "Morning rush table turns are now 35% faster with zero cashier bottlenecks.",
      details: "Guests scan the table QR code and pay directly via UPI. Orders route to the barista screen in 0.05 seconds.",
      metric: "35% Faster Turns",
    },
    {
      company: "HIGH-VOLUME CASUAL DINING",
      headline: "Recipe-level inventory eliminated unaccounted ingredient wastage.",
      details: "Every dish sold decrements exact grams of meat, cheese, and sauces, keeping our food cost percentage under tight control.",
      metric: "3.2% Margin Lift",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-100 dark:bg-[#07090E] border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header matching Aceternity Reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              Raw insights straight from kitchen operations
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenDemo}
            className="group relative flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#FF5B2E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E24A1F] transition-all"
          >
            <span>Book a Demo Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Horizontal Insight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="font-mono text-xs font-bold text-[#FF5B2E] tracking-wider">
                    {item.company}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                    {item.metric}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                  "{item.headline}"
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.details}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-xs text-neutral-500 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Operational Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
