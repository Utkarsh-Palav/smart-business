"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  Utensils,
  Truck,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Sparkles,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import {
  DateRangeSelector,
  KpiCard,
} from "@/components/dashboard/ui/DashboardWidgets";

export default function OrdersSalesPage() {
  const [timeRange, setTimeRange] = useState("today");

  const orderTypes = [
    {
      name: "Dine-in Service",
      icon: Utensils,
      count: 68,
      revenue: "₹26,180",
      share: 54,
      avgTicket: "₹385",
      color: "#FF5B2E",
    },
    {
      name: "Takeaway Counter",
      icon: ShoppingBag,
      count: 34,
      revenue: "₹12,240",
      share: 28,
      avgTicket: "₹360",
      color: "#3b82f6",
    },
    {
      name: "Delivery Fleet (Zomato/Swiggy)",
      icon: Truck,
      count: 23,
      revenue: "₹9,830",
      share: 18,
      avgTicket: "₹427",
      color: "#10b981",
    },
  ];

  const tablePerformance = [
    { table: "Table 04", section: "Main Hall", orders: 12, revenue: "₹4,620", avgTime: "42 min", status: "Occupied" },
    { table: "Table 02", section: "Main Hall", orders: 10, revenue: "₹3,940", avgTime: "36 min", status: "Available" },
    { table: "Table 07", section: "Outdoor Patio", orders: 9, revenue: "₹3,780", avgTime: "48 min", status: "Occupied" },
    { table: "Table 11", section: "Upper Deck", orders: 8, revenue: "₹3,150", avgTime: "38 min", status: "Billing" },
    { table: "Table 01", section: "Window Booth", orders: 8, revenue: "₹2,980", avgTime: "34 min", status: "Available" },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20">
                125 Orders Processed Today
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Kitchen Pace: Optimal (16 min avg)
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Orders & Kitchen Velocity
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Ticket distribution, dine-in table turnover, and preparation throughput
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <DateRangeSelector value={timeRange} onChange={setTimeRange} />
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              Export Orders
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Orders"
            value="125"
            comparison="+16 orders"
            subtext="vs yesterday"
            isPositive={true}
            icon={ShoppingBag}
            accentColor="#FF5B2E"
            sparklineData={[75, 88, 92, 105, 112, 120, 125]}
          />
          <KpiCard
            title="Fulfillment Rate"
            value="98.4%"
            comparison="+1.2%"
            subtext="only 2 voids"
            isPositive={true}
            icon={CheckCircle2}
            accentColor="#10b981"
            sparklineData={[94, 95, 96, 97, 98, 98.4]}
          />
          <KpiCard
            title="Avg Kitchen Prep Time"
            value="16.2 mins"
            comparison="-2.4 mins"
            subtext="faster turnaround"
            isPositive={true}
            icon={Clock}
            accentColor="#3b82f6"
            sparklineData={[22, 20, 19, 18, 17, 16.2]}
          />
          <KpiCard
            title="Dine-in Table Turns"
            value="3.8x"
            comparison="+0.6 turns"
            subtext="per table average"
            isPositive={true}
            icon={Utensils}
            accentColor="#f59e0b"
            sparklineData={[2.8, 3.0, 3.2, 3.4, 3.6, 3.8]}
          />
        </div>

        {/* Order Channel Cards (Dine-in vs Takeaway vs Delivery) */}
        <div className="grid gap-4 md:grid-cols-3">
          {orderTypes.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.name}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${channel.color}15`,
                      color: channel.color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {channel.share}% of orders
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {channel.name}
                  </h3>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900">
                      {channel.count} orders
                    </span>
                    <span className="text-sm font-semibold text-slate-600">
                      {channel.revenue}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>Avg Ticket Size:</span>
                  <span className="font-semibold text-slate-900">{channel.avgTicket}</span>
                </div>

                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${channel.share}%`,
                      backgroundColor: channel.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Table & Seating Velocity Analysis */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Table Turnover & Seating Performance
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Track top-grossing tables and seating duration to optimize seating layout
              </p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              14 Active Dine-in Tables
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Table</th>
                  <th className="px-4 py-3">Floor Section</th>
                  <th className="px-4 py-3">Orders Served</th>
                  <th className="px-4 py-3">Gross Sales</th>
                  <th className="px-4 py-3">Avg Seating Duration</th>
                  <th className="px-5 py-3 text-right">Current State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {tablePerformance.map((row) => (
                  <tr key={row.table} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {row.table}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{row.section}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {row.orders} turns
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {row.revenue}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{row.avgTime}</td>
                    <td className="px-5 py-3.5 text-right">
                      {row.status === "Occupied" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Occupied
                        </span>
                      )}
                      {row.status === "Available" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          Available
                        </span>
                      )}
                      {row.status === "Billing" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-600/20">
                          Billing
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}