"use client";

import React, { useState } from "react";
import {
  Store,
  Globe,
  ShoppingBag,
  Percent,
  TrendingUp,
  CreditCard,
  DollarSign,
  Download,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import {
  DateRangeSelector,
  KpiCard,
} from "@/components/dashboard/ui/DashboardWidgets";

export default function OnlineOfflinePage() {
  const [timeRange, setTimeRange] = useState("today");

  const channelComparison = [
    {
      channel: "Offline: Dine-in & Counter POS",
      type: "Direct Store",
      orders: 86,
      grossRevenue: "₹34,860",
      commissions: "₹0 (0%)",
      netRealized: "₹34,860",
      margin: "96.5%",
      icon: Store,
      color: "#FF5B2E",
    },
    {
      channel: "Online: Direct Web QR Menu",
      type: "Urban Kitchen Link",
      orders: 16,
      grossRevenue: "₹6,240",
      commissions: "₹124 (2% Gateway)",
      netRealized: "₹6,116",
      margin: "94.2%",
      icon: Globe,
      color: "#10b981",
    },
    {
      channel: "Swiggy Delivery Partner",
      type: "Aggregator",
      orders: 14,
      grossRevenue: "₹5,180",
      commissions: "₹1,140 (22%)",
      netRealized: "₹4,040",
      margin: "74.8%",
      icon: ShoppingBag,
      color: "#f59e0b",
    },
    {
      channel: "Zomato Delivery Partner",
      type: "Aggregator",
      orders: 9,
      grossRevenue: "₹3,970",
      commissions: "₹913 (23%)",
      netRealized: "₹3,057",
      margin: "73.5%",
      icon: ShoppingBag,
      color: "#e11d48",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#FF5B2E] ring-1 ring-[#FF5B2E]/20">
                Direct Store Revenue: 81.6%
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Low Aggregator Dependency
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Online vs Offline Channel Split
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Evaluate real net margins after platform commissions, gateway charges, and packaging
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <DateRangeSelector value={timeRange} onChange={setTimeRange} />
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              Export Channel Audit
            </button>
          </div>
        </div>

        {/* 4 KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="In-Store Direct Sales"
            value="₹34,860.00"
            comparison="72.2%"
            subtext="of total volume"
            isPositive={true}
            icon={Store}
            accentColor="#FF5B2E"
            sparklineData={[24, 26, 28, 30, 32, 34.8]}
          />
          <KpiCard
            title="Aggregator Orders"
            value="₹9,150.00"
            comparison="18.9%"
            subtext="Swiggy + Zomato"
            isPositive={false}
            icon={ShoppingBag}
            accentColor="#f59e0b"
            sparklineData={[11, 10, 10.5, 9.8, 9.15]}
          />
          <KpiCard
            title="Total Commissions Paid"
            value="₹2,053.00"
            comparison="4.2% overall"
            subtext="blended platform fee"
            isPositive={true}
            icon={Percent}
            accentColor="#8b5cf6"
            sparklineData={[2.6, 2.4, 2.3, 2.1, 2.05]}
          />
          <KpiCard
            title="Direct Customer Retention"
            value="68.4%"
            comparison="+4.2%"
            subtext="ordered direct next time"
            isPositive={true}
            icon={CheckCircle2}
            accentColor="#10b981"
            sparklineData={[58, 60, 62, 65, 68.4]}
          />
        </div>

        {/* Channel Profitability Matrix */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Channel Margin Audit
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Net realized cash flow per channel after deducting third-party aggregator take-rates
              </p>
            </div>
            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              Blended Net Margin: 91.8%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Order Channel</th>
                  <th className="px-4 py-3">Channel Type</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Gross Billed</th>
                  <th className="px-4 py-3">Commissions & Fees</th>
                  <th className="px-4 py-3">Net Realized</th>
                  <th className="px-5 py-3 text-right">Net Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {channelComparison.map((row) => {
                  const Icon = row.icon;
                  return (
                    <tr key={row.channel} className="transition-colors hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${row.color}15`,
                              color: row.color,
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-slate-900">{row.channel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{row.type}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{row.orders}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{row.grossRevenue}</td>
                      <td className="px-4 py-3.5 text-rose-600 font-semibold">{row.commissions}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{row.netRealized}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-600">
                        {row.margin}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}