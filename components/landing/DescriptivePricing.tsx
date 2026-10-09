"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Sparkles, Wifi } from "lucide-react";

export default function DescriptivePricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      badge: "Single Outlet & Coffee Shops",
      desc: "For independent specialty cafés, bakery counters, and single-location food trucks.",
      monthlyPrice: 1999,
      annualPrice: 1599,
      hardwareBonus: "Includes 1 Configured NFC Review Card",
      features: [
        "Cloud POS Terminal (1 Active Station)",
        "Smart QR Digital Menu with Photo Catalog",
        "Table & Counter Order Management",
        "WhatsApp Digital Receipts & Bill Link",
        "Dynamic NFC Review Card Token (/r/[token])",
        "Daily EOD Sales & Cash Settlement Summary",
        "Standard Onboarding & Email Support",
      ],
      dark: false,
      ctaText: "Start 14-Day Free Access",
    },
    {
      name: "Growth Pro",
      badge: "Most Popular for Busy Kitchens",
      desc: "Complete operational suite for high-volume dining, multi-station kitchens, and cloud brands.",
      monthlyPrice: 4499,
      annualPrice: 3599,
      popular: true,
      hardwareBonus: "Includes 2 NFC Review Cards + 10 QR Table Stands",
      features: [
        "Everything in Starter, plus:",
        "Omnichannel Swiggy & Zomato Unified Sync",
        "1-Click Global Item 86 Kill-Switch",
        "Multi-Station Live Kitchen Display System (KDS)",
        "Recipe-Level Stock & Sub-Gram Spoilage Ledger",
        "Guest Table Split-Pay with Dynamic UPI QR",
        "WhatsApp Automated Customer Communications",
        "Aggregator Commission Audit & GST Invoicing",
        "Priority WhatsApp & Phone Engineering Support",
      ],
      dark: true,
      ctaText: "Start 14-Day Free Access",
    },
    {
      name: "Enterprise",
      badge: "Multi-Brand & Franchise Chains",
      desc: "For restaurant groups, multi-brand cloud kitchens, and master franchise operators.",
      monthlyPrice: 8999,
      annualPrice: 7199,
      hardwareBonus: "Custom Branded NFC Hardware & Hardware Setup",
      features: [
        "Everything in Growth Pro, plus:",
        "Multi-Brand & Multi-Outlet Central Dashboard",
        "Master Menu Repository with Outlet Price Overrides",
        "Automated Franchise Royalty Billing Calculations",
        "Dedicated Neon PostgreSQL Database Isolation",
        "Custom ERP, Accounting & POS Migration Webhooks",
        "Dedicated Implementation Engineer & Custom SLA",
      ],
      dark: false,
      ctaText: "Contact Enterprise Sales",
    },
  ];

  return (
    <section id="pricing" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header with Monthly/Annual Toggle on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#FF5B2E] font-bold uppercase tracking-widest block mb-2">
              Early Access Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              Descriptive Pricing Plans
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Every plan includes our 14-day free access, zero setup fees, and white-glove menu digitization.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                !isAnnual
                  ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-[#FF5B2E] text-white shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Cards Grid matching Aceternity Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, idx) => {
            const price = isAnnual ? p.annualPrice : p.monthlyPrice;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all ${
                  p.dark
                    ? "bg-black text-white border-2 border-[#FF5B2E] shadow-2xl relative lg:-translate-y-2"
                    : "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <h3 className="text-lg font-bold">{p.name}</h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{p.badge}</span>
                    </div>
                    {p.popular && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FF5B2E] text-white rounded">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 min-h-[36px]">
                    {p.desc}
                  </p>

                  <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-mono font-bold">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-500">/ outlet / mo</span>
                    </div>
                    {isAnnual && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block mt-1">
                        Billed annually (₹{(price * 12).toLocaleString("en-IN")}/yr)
                      </span>
                    )}
                  </div>

                  {/* Hardware Bonus Box */}
                  <div className={`mt-4 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    p.dark ? "bg-neutral-900 text-amber-300" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-amber-300"
                  }`}>
                    <Wifi className="w-3.5 h-3.5 text-[#FF5B2E] shrink-0" />
                    <span className="text-[11px]">{p.hardwareBonus}</span>
                  </div>

                  {/* Features List */}
                  <ul className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <a
                    href="#faq"
                    className={`w-full py-2.5 rounded-lg text-center text-xs font-semibold block transition-colors ${
                      p.dark
                        ? "bg-[#FF5B2E] hover:bg-[#E24A1F] text-white"
                        : "bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white"
                    }`}
                  >
                    {p.ctaText}
                  </a>
                  <span className="text-[10px] text-neutral-500 text-center block mt-2 font-mono">
                    14-Day Free Access • No Credit Card
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
