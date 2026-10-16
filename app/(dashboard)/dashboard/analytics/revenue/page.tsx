"use client";

import React, { useState } from "react";
import {
  Banknote,
  Receipt,
  TrendingUp,
  Percent,
  Clock,
  Download,
  Calendar,
  Share2,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Store,
} from "lucide-react";
import {
  DateRangeSelector,
  KpiCard,
  RevenueVelocityChart,
  PaymentChannelsBreakdown,
  TopSellingCategories,
  RecentTransactionsTable,
} from "@/components/dashboard/ui/DashboardWidgets";

export default function AnalyticsRevenuePage() {
  const [timeRange, setTimeRange] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header & Operational Status */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                Live Service Active
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <Store className="h-3.5 w-3.5 text-[#FF5B2E]" />
                Munchy Krunchy Bhayandar
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Revenue & Financial Pulse
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Real-time gross collections, average ticket size, and payment reconciliations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <DateRangeSelector value={timeRange} onChange={setTimeRange} />
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh live data"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-xs transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B2E]/40"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#FF5B2E]" : ""}`}
              />
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              Download Statement
            </button>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Gross Revenue"
            value="₹48,250.00"
            comparison="+18.4%"
            subtext="vs yesterday"
            isPositive={true}
            icon={Banknote}
            accentColor="#FF5B2E"
            sparklineData={[18, 22, 28, 25, 34, 40, 48]}
          />
          <KpiCard
            title="Net Realized Sales"
            value="₹42,940.00"
            comparison="+14.2%"
            subtext="after GST & disc"
            isPositive={true}
            icon={Receipt}
            accentColor="#10b981"
            sparklineData={[16, 20, 24, 22, 30, 36, 42]}
          />
          <KpiCard
            title="Avg Order Value (AOV)"
            value="₹386.00"
            comparison="+₹42"
            subtext="higher ticket size"
            isPositive={true}
            icon={Percent}
            accentColor="#3b82f6"
            sparklineData={[310, 325, 340, 335, 360, 370, 386]}
          />
          <KpiCard
            title="Avg Ticket Turnaround"
            value="18.5 mins"
            comparison="-3.2 min"
            subtext="faster kitchen prep"
            isPositive={true}
            icon={Clock}
            accentColor="#f59e0b"
            sparklineData={[24, 22, 21, 23, 20, 19, 18.5]}
          />
        </div>

        {/* Chart: Sales Velocity & Peak Hours */}
        <RevenueVelocityChart timeRange={timeRange} />

        {/* 2-Column Split: Payment Breakdown & Top Selling Menu */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PaymentChannelsBreakdown />
          <TopSellingCategories />
        </div>

        {/* Real-time Order Stream */}
        <RecentTransactionsTable />
      </div>
    </div>
  );
}