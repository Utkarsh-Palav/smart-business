"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  QrCode,
  Smartphone,
  ChevronRight,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Layers,
  Users,
  Percent,
} from "lucide-react";

// --- Date Range Selector ---
export function DateRangeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const options = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "This Month" },
  ];

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200/80 bg-white p-1 shadow-xs">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              active
                ? "bg-[#14181F] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// --- KPI Metric Card ---
export interface KpiCardProps {
  title: string;
  value: string;
  comparison: string;
  isPositive?: boolean;
  subtext?: string;
  icon: React.ElementType;
  accentColor?: string;
  sparklineData?: number[];
}

export function KpiCard({
  title,
  value,
  comparison,
  isPositive = true,
  subtext,
  icon: Icon,
  accentColor = "#FF5B2E",
  sparklineData = [12, 18, 14, 25, 20, 28, 35],
}: KpiCardProps) {
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const points = sparklineData
    .map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * 90;
      const y = 30 - ((v - min) / range) * 24;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-950/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {value}
            </span>
          </div>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {comparison}
          </span>
          {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
        </div>

        {/* Micro Sparkline */}
        <div className="h-7 w-20 shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
          <svg viewBox="0 0 90 32" className="h-full w-full overflow-visible">
            <polyline
              fill="none"
              stroke={isPositive ? "#10b981" : "#f43f5e"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// --- Interactive Revenue Velocity Chart ---
export function RevenueVelocityChart({ timeRange }: { timeRange: string }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const hourlyData = [
    { label: "10 AM", revenue: 2400, orders: 8, isPeak: false },
    { label: "11 AM", revenue: 4100, orders: 14, isPeak: false },
    { label: "12 PM", revenue: 8650, orders: 28, isPeak: true },
    { label: "1 PM", revenue: 11400, orders: 36, isPeak: true },
    { label: "2 PM", revenue: 9800, orders: 31, isPeak: true },
    { label: "3 PM", revenue: 4600, orders: 15, isPeak: false },
    { label: "4 PM", revenue: 3800, orders: 12, isPeak: false },
    { label: "5 PM", revenue: 5200, orders: 18, isPeak: false },
    { label: "6 PM", revenue: 8900, orders: 29, isPeak: false },
    { label: "7 PM", revenue: 12850, orders: 42, isPeak: true },
    { label: "8 PM", revenue: 14600, orders: 49, isPeak: true },
    { label: "9 PM", revenue: 11200, orders: 37, isPeak: true },
    { label: "10 PM", revenue: 6500, orders: 21, isPeak: false },
  ];

  const maxRev = Math.max(...hourlyData.map((d) => d.revenue));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Sales Velocity & Peak Hours
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF5B2E]/10 px-2 py-0.5 text-[11px] font-medium text-[#FF5B2E]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF5B2E]" />
              Live Kitchen Flow
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time hourly billing volume with peak lunch & dinner rush detection
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#14181F]" />
            <span className="text-slate-600">Regular</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#FF5B2E]" />
            <span className="text-slate-600 font-medium">Rush Hour</span>
          </div>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="mt-8 flex h-56 items-end gap-2 border-b border-slate-100 pb-2 sm:gap-3">
        {hourlyData.map((slot, idx) => {
          const heightPercent = Math.round((slot.revenue / maxRev) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={slot.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-14 z-20 whitespace-nowrap rounded-lg bg-[#14181F] px-3 py-1.5 text-xs text-white shadow-xl shadow-black/25">
                  <p className="font-semibold text-white">₹{slot.revenue.toLocaleString()}</p>
                  <p className="text-[10px] text-white/70">{slot.orders} orders • {slot.label}</p>
                  <div className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#14181F]" />
                </div>
              )}

              {/* Bar */}
              <div
                className={`w-full max-w-8.5 rounded-t-lg transition-all duration-200 ${
                  slot.isPeak
                    ? isHovered
                      ? "bg-[#e5491e]"
                      : "bg-[#FF5B2E]"
                    : isHovered
                    ? "bg-slate-700"
                    : "bg-[#14181F]"
                }`}
                style={{ height: `${heightPercent}%` }}
              />

              {/* Label */}
              <span className="mt-2 text-[10px] font-medium text-slate-400 group-hover:text-slate-900">
                {slot.label.replace(" ", "")}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#FF5B2E]" />
          <span>
            Lunch Rush: <strong>12:30 PM - 2:30 PM</strong> (42% volume)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#FF5B2E]" />
          <span>
            Dinner Rush: <strong>7:30 PM - 9:30 PM</strong> (58% volume)
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Payment Channels & Modes Breakdown ---
export function PaymentChannelsBreakdown() {
  const channels = [
    {
      name: "UPI / QR Payments",
      icon: QrCode,
      amount: "₹30,880",
      share: 64,
      color: "#10b981",
      badge: "Fastest Settlement",
    },
    {
      name: "Card & POS Swipes",
      icon: CreditCard,
      amount: "₹8,685",
      share: 18,
      color: "#3b82f6",
      badge: "Razorpay POS",
    },
    {
      name: "Cash Counter",
      icon: Smartphone,
      amount: "₹6,755",
      share: 14,
      color: "#f59e0b",
      badge: "Cash Box Verified",
    },
    {
      name: "Online Aggregators",
      icon: ShoppingBag,
      amount: "₹1,930",
      share: 4,
      color: "#8b5cf6",
      badge: "Swiggy / Zomato Direct",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Payment & Settlement Split
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Collection channels reconciled with bank transfers
          </p>
        </div>
        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
          100% Reconciled
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div key={channel.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${channel.color}15`, color: channel.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">{channel.name}</span>
                    <span className="ml-2 text-[10px] text-slate-400 font-normal">
                      {channel.badge}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{channel.amount}</span>
                  <span className="ml-1.5 text-slate-400">({channel.share}%)</span>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
    </div>
  );
}

// --- Top Selling Categories & Items ---
export function TopSellingCategories() {
  const items = [
    {
      name: "Truffle Crunch Gourmet Burger",
      category: "Signature Burgers",
      orders: 142,
      revenue: "₹21,300",
      change: "+24%",
    },
    {
      name: "Woodfired Peri-Peri Pizza",
      category: "Artisan Pizzas",
      orders: 84,
      revenue: "₹14,280",
      change: "+12%",
    },
    {
      name: "Hazelnut Cold Brew & Shakes",
      category: "Beverages",
      orders: 118,
      revenue: "₹8,850",
      change: "+31%",
    },
    {
      name: "Cheesy Loaded Sriracha Fries",
      category: "Starters & Sides",
      orders: 92,
      revenue: "₹5,520",
      change: "+8%",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Top Performing Menu Items
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Ranked by total revenue contribution today
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-[#FF5B2E] hover:underline"
        >
          View Full Menu Report →
        </button>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                {idx + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <p className="text-[11px] text-slate-400">
                  {item.category} • {item.orders} orders sold
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{item.revenue}</p>
              <p className="text-[11px] font-semibold text-emerald-600">{item.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Live Sales / Recent Invoices Table ---
export function RecentTransactionsTable() {
  const transactions = [
    {
      id: "ORD-8942",
      table: "Table 4 (Dine-in)",
      items: "2x Truffle Burger, 1x Hazelnut Cold Brew",
      amount: "₹780.00",
      time: "2 mins ago",
      status: "COMPLETED",
      payment: "UPI",
    },
    {
      id: "ORD-8941",
      table: "Takeaway Counter",
      items: "1x Woodfired Peri-Peri Pizza, 1x Loaded Fries",
      amount: "₹540.00",
      time: "8 mins ago",
      status: "PREPARING",
      payment: "CARD",
    },
    {
      id: "ORD-8940",
      table: "Table 11 (Dine-in)",
      items: "3x Cold Brew, 2x Garlic Bread",
      amount: "₹620.00",
      time: "14 mins ago",
      status: "COMPLETED",
      payment: "UPI",
    },
    {
      id: "ORD-8939",
      table: "Delivery (Zomato)",
      items: "2x Munchy Crunch Chicken Burger",
      amount: "₹450.00",
      time: "21 mins ago",
      status: "COMPLETED",
      payment: "ONLINE",
    },
    {
      id: "ORD-8938",
      table: "Table 2 (Dine-in)",
      items: "4x Classic Cappuccino, 2x Brownie",
      amount: "₹890.00",
      time: "32 mins ago",
      status: "COMPLETED",
      payment: "CASH",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Real-Time Punch Stream
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Recent dine-in tickets and online order punches
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14181F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-3">Order ID</th>
              <th className="px-4 py-3">Service Type / Source</th>
              <th className="px-4 py-3">Items Ordered</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {transactions.map((t) => (
              <tr key={t.id} className="transition-colors hover:bg-slate-50/60">
                <td className="px-5 py-3.5 font-bold text-slate-900">
                  <span className="font-mono">{t.id}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-700">{t.table}</td>
                <td className="max-w-xs truncate px-4 py-3.5 text-slate-500">
                  {t.items}
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-900">{t.amount}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {t.payment}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {t.status === "COMPLETED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-600/20">
                      <Clock className="h-3 w-3" />
                      In Kitchen
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right text-slate-400">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
