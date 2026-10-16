"use client";

import React, { useState } from "react";
import {
  WalletCards,
  TrendingUp,
  Percent,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Download,
  UtensilsCrossed,
  Coffee,
  Pizza,
} from "lucide-react";
import {
  DateRangeSelector,
  KpiCard,
} from "@/components/dashboard/ui/DashboardWidgets";

export default function ProfitSummaryPage() {
  const [timeRange, setTimeRange] = useState("today");

  const waterfallItems = [
    { label: "Gross Billed Revenue", amount: "₹48,250", type: "pos", pct: "100%" },
    { label: "Less: GST Taxes (5% Composite)", amount: "-₹2,298", type: "neg", pct: "4.8%" },
    { label: "Less: Raw Food Cost (COGS)", amount: "-₹15,055", type: "neg", pct: "31.2%" },
    { label: "Less: Kitchen & Floor Staff Payroll", amount: "-₹6,800", type: "neg", pct: "14.1%" },
    { label: "Less: Kitchen LPG & Store Utilities", amount: "-₹2,607", type: "neg", pct: "5.4%" },
    { label: "Net Operating Profit (EBITDA)", amount: "₹21,490", type: "net", pct: "44.5%" },
  ];

  const categoryMargins = [
    {
      name: "Cold Brews, Shakes & Coffee",
      icon: Coffee,
      grossMargin: "84.2%",
      revenueShare: "18.3%",
      avgCost: "₹28",
      avgPrice: "₹180",
      rating: "Prime Profit Engine",
      color: "#10b981",
    },
    {
      name: "Artisan Woodfired Pizzas",
      icon: Pizza,
      grossMargin: "72.4%",
      revenueShare: "29.6%",
      avgCost: "₹95",
      avgPrice: "₹345",
      rating: "High Volume & Margin",
      color: "#FF5B2E",
    },
    {
      name: "Signature Gourmet Burgers",
      icon: UtensilsCrossed,
      grossMargin: "68.5%",
      revenueShare: "44.1%",
      avgCost: "₹72",
      avgPrice: "₹229",
      rating: "Top Revenue Driver",
      color: "#3b82f6",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                EBITDA Margin: 44.5%
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Top Decile Cafe Performance
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Profit Summary & Unit Economics
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Comprehensive margin cascade, category profitability, and bottom-line earnings
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <DateRangeSelector value={timeRange} onChange={setTimeRange} />
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              Download P&amp;L Report
            </button>
          </div>
        </div>

        {/* 4 KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Net Operating Profit"
            value="₹21,490.00"
            comparison="+22.4%"
            subtext="vs yesterday"
            isPositive={true}
            icon={WalletCards}
            accentColor="#10b981"
            sparklineData={[12, 14, 16, 15, 18, 19, 21.49]}
          />
          <KpiCard
            title="Net Profit Margin"
            value="44.5%"
            comparison="+3.1%"
            subtext="after all operating costs"
            isPositive={true}
            icon={Percent}
            accentColor="#FF5B2E"
            sparklineData={[39, 40, 41, 42, 43, 44.5]}
          />
          <KpiCard
            title="Blended Gross Margin"
            value="68.8%"
            comparison="+1.5%"
            subtext="before labor & rent"
            isPositive={true}
            icon={TrendingUp}
            accentColor="#3b82f6"
            sparklineData={[65, 66, 67, 66.5, 68, 68.8]}
          />
          <KpiCard
            title="Estimated Monthly Net"
            value="₹6.44 Lakhs"
            comparison="On Target"
            subtext="based on 30-day run rate"
            isPositive={true}
            icon={ShieldCheck}
            accentColor="#f59e0b"
            sparklineData={[5.2, 5.5, 5.8, 6.1, 6.44]}
          />
        </div>

        {/* Waterfall Breakdown Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                P&amp;L Margin Cascade
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Step-by-step reconciliation from gross register collections to real net profit
              </p>
            </div>
            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              Profitable Daily Cycle
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {waterfallItems.map((step) => (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-xl p-3.5 text-xs transition-colors ${
                  step.type === "net"
                    ? "bg-[#14181F] text-white"
                    : "bg-slate-50/70 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      step.type === "pos"
                        ? "bg-blue-500"
                        : step.type === "neg"
                        ? "bg-rose-500"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span className={`font-semibold ${step.type === "net" ? "text-white" : "text-slate-800"}`}>
                    {step.label}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono text-sm font-bold ${
                      step.type === "net"
                        ? "text-emerald-400 text-base"
                        : step.type === "neg"
                        ? "text-rose-600"
                        : "text-slate-900"
                    }`}
                  >
                    {step.amount}
                  </span>
                  <span
                    className={`w-12 text-right ${
                      step.type === "net" ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {step.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Unit Economics */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Category Unit Economics & Profit Drivers
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Menu item margin profiles to identify high-margin upsell opportunities
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categoryMargins.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-xs transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                      {cat.grossMargin} Margin
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    {cat.rating}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <span className="text-slate-400">Avg Cost:</span>
                      <p className="font-bold text-slate-800">{cat.avgCost}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Avg Price:</span>
                      <p className="font-bold text-slate-900">{cat.avgPrice}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}