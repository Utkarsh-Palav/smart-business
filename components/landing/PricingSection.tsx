"use client";

import React, { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Wifi } from "lucide-react";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      badge: "Single Outlet / Café",
      desc: "For independent specialty cafés, bakery counters, and single-location dining spots.",
      monthlyPrice: 1999,
      annualPrice: 1599,
      hardwareBonus: "Includes 1 Configured NFC Google Review Card",
      features: [
        "Cloud POS Terminal (1 Active Station)",
        "Smart QR Digital Menu with Photo Catalog",
        "Table & Counter Order Management",
        "WhatsApp Digital Receipts & Bill Link",
        "Dynamic NFC Review Card Token (/r/[token])",
        "Daily EOD Sales & Cash Settlement Summary",
        "Standard Onboarding & Email Support",
      ],
      ctaText: "Start 14-Day Free Trial",
    },
    {
      name: "Growth Pro",
      badge: "Busy Restaurants & Cloud Kitchens",
      desc: "Complete operational suite for high-volume dining, multi-station kitchens, and delivery brands.",
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
      ctaText: "Start 14-Day Free Trial",
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
      ctaText: "Contact for Enterprise Access",
    },
  ];

  return (
    <section id="pricing" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#090C12] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            Early Access Plans
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Transparent, Predictable Pricing
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Every plan includes our 14-day free trial, zero setup fees, and white-glove menu digitization.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center gap-2 p-1 bg-[#10141E] border border-white/10 rounded-lg">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                !isAnnual ? "bg-white text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isAnnual ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, idx) => {
            const price = isAnnual ? p.annualPrice : p.monthlyPrice;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-all ${
                  p.popular
                    ? "bg-[#111624] border-2 border-[#FF5B2E] shadow-xl"
                    : "bg-[#0E121B] border border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div>
                      <h3 className="text-lg font-bold text-white">{p.name}</h3>
                      <span className="text-xs text-gray-400">{p.badge}</span>
                    </div>
                    {p.popular && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FF5B2E] text-white rounded">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 mt-3">{p.desc}</p>

                  <div className="mt-5 pt-4 border-t border-white/5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-mono font-bold text-white">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-400">/ outlet / month</span>
                    </div>
                    {isAnnual && (
                      <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                        Billed annually (₹{(price * 12).toLocaleString("en-IN")}/yr)
                      </span>
                    )}
                  </div>

                  {/* Hardware Perk */}
                  <div className="mt-4 p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs text-amber-300 flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-[#FF5B2E] shrink-0" />
                    <span className="text-[11px]">{p.hardwareBonus}</span>
                  </div>

                  {/* Feature Points */}
                  <ul className="mt-5 pt-4 border-t border-white/5 space-y-2 text-xs">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <a
                    href="#calculator"
                    className={`w-full py-2.5 rounded-lg text-center text-xs font-semibold block transition-colors ${
                      p.popular
                        ? "bg-[#FF5B2E] hover:bg-[#E24A1F] text-white"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    {p.ctaText}
                  </a>
                  <span className="text-[10px] text-gray-500 text-center block mt-2">
                    14-Day Free Access • No Credit Card Required
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
