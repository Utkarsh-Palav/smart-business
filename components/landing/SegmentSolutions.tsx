"use client";

import React, { useState } from "react";
import { Coffee, UtensilsCrossed, Zap, ChefHat, Building2, Check, ArrowRight } from "lucide-react";

export default function SegmentSolutions() {
  const [activeSegment, setActiveSegment] = useState<number>(0);

  const segments = [
    {
      id: 0,
      title: "Cafés & Bakeries",
      icon: <Coffee className="w-4 h-4" />,
      headline: "Rapid Counter POS & Perishable Batch Tracking",
      desc: "Engineered for high-turnover morning coffee rushes, pastry expiration tracking, and barista modifier routing (oat milk, syrups, roasts).",
      points: [
        "Barista display routing with customized milk/syrup modifiers",
        "Daily perishable pastry batch counts and auto-expiration alerts",
        "Google Review NFC cards at counter checkout for local discovery",
        "WhatsApp digital receipts and instant loyalty re-engagement",
      ],
    },
    {
      id: 1,
      title: "Fine & Casual Dining",
      icon: <UtensilsCrossed className="w-4 h-4" />,
      headline: "Table Floor Management & Multi-Course Kitchen Timing",
      desc: "Designed for full-service hospitality with waiter-assisted tablet ordering, interactive wine pairings, and table-side split UPI payments.",
      points: [
        "Floor map with live occupied/vacant table states",
        "Waiter iPad ordering with dietary allergen indicators",
        "Multi-course kitchen fire pacing (Hold Appetizers vs. Mains)",
        "Table-side instant bill splitting with zero cashier queues",
      ],
    },
    {
      id: 2,
      title: "QSR & Fast Food",
      icon: <Zap className="w-4 h-4" />,
      headline: "High-Speed Counter Billing & Station Routing",
      desc: "Process high-volume ticket queues in under 10 seconds with 1-click combo prompts, automated kitchen station routing, and bump-bar KDS.",
      points: [
        "0.05-second order punch and thermal KOT print speed",
        "Queue-busting QR counter ordering during peak rushes",
        "1-Click combos, size upgrades, and add-on modifier prompts",
        "Real-time kitchen countdown timers and audio ticket chimes",
      ],
    },
    {
      id: 3,
      title: "Cloud Kitchens",
      icon: <ChefHat className="w-4 h-4" />,
      headline: "Multi-Brand Aggregator Hub on One Display",
      desc: "Operate multiple virtual delivery brands from one kitchen without 6 different tablets. Consolidate Swiggy and Zomato into 1 unified queue.",
      points: [
        "Single-screen Swiggy and Zomato auto-acceptance across brands",
        "Packaging material and raw ingredient simultaneous stock deduction",
        "1-Click Global Item 86 Kill-Switch across all virtual brands",
        "Direct zero-commission WhatsApp delivery ordering channel",
      ],
    },
    {
      id: 4,
      title: "Franchises & Chains",
      icon: <Building2 className="w-4 h-4" />,
      headline: "Centralized Catalog Governance & Royalty Billing",
      desc: "For multi-outlet restaurant groups. Maintain master recipes centrally, set outlet-level price overrides, and compute franchise royalties automatically.",
      points: [
        "Centralized menu distribution with store-level price overrides",
        "Granular Role-Based Access Control (Owner, Manager, Cashier)",
        "Automated franchise sales audit and monthly royalty calculation",
        "Dedicated Neon PostgreSQL database isolation per brand/entity",
      ],
    },
  ];

  return (
    <section className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#07090E]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            Tailored Industry Solutions
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Configured for Your Specific Hospitality Model
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Select your operating format to see how Urban Kitchen adapts to your daily kitchen and front-of-house needs.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-10 flex items-center justify-center gap-2 p-1 bg-[#10141E] border border-white/10 rounded-xl max-w-3xl mx-auto overflow-x-auto">
          {segments.map((seg) => (
            <button
              key={seg.id}
              type="button"
              onClick={() => setActiveSegment(seg.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                activeSegment === seg.id ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {seg.icon}
              <span>{seg.title}</span>
            </button>
          ))}
        </div>

        {/* Segment Detail Box */}
        {(() => {
          const s = segments[activeSegment];
          return (
            <div className="mt-8 bg-[#0E121B] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10">
              <div className="max-w-3xl mx-auto space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {s.headline}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {s.desc}
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {s.points.map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5 border border-white/5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-200">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
