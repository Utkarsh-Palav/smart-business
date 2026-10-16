"use client";

import React, { useState } from "react";
import {
  Receipt,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Building2,
  Calendar,
  CreditCard,
  Download,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  DateRangeSelector,
  KpiCard,
} from "@/components/dashboard/ui/DashboardWidgets";

export default function ExpenseBillingPage() {
  const [timeRange, setTimeRange] = useState("today");

  const expenseBreakdown = [
    {
      category: "Raw Ingredients & Perishables",
      amount: "₹12,450",
      share: 58,
      budget: "₹14,000",
      status: "Within Budget",
      color: "#FF5B2E",
    },
    {
      category: "Dairy & Bakery Provisions",
      amount: "₹4,200",
      share: 20,
      budget: "₹4,500",
      status: "Within Budget",
      color: "#3b82f6",
    },
    {
      category: "Eco-Packaging & Disposables",
      amount: "₹2,600",
      share: 12,
      budget: "₹3,000",
      status: "Within Budget",
      color: "#10b981",
    },
    {
      category: "Kitchen Fuel & Utilities (LPG)",
      amount: "₹2,200",
      share: 10,
      budget: "₹2,000",
      status: "10% Over Budget",
      color: "#f59e0b",
    },
  ];

  const vendorBills = [
    {
      id: "INV-9412",
      vendor: "Vimal Dairy & Cold Storage",
      item: "Cheese, Paneer & Butter stock (40kg)",
      dueDate: "Tomorrow",
      amount: "₹5,400",
      status: "PENDING",
    },
    {
      id: "INV-9408",
      vendor: "Royal Bakery Bhayandar",
      item: "Brioche Burger Buns & Pizza Dough (200 pcs)",
      dueDate: "Today",
      amount: "₹3,200",
      status: "DUE_TODAY",
    },
    {
      id: "INV-9399",
      vendor: "Fresh Farms Green Grocers",
      item: "Lettuce, Jalapeños, Tomatoes & Avocados",
      dueDate: "Paid Yesterday",
      amount: "₹2,850",
      status: "PAID",
    },
    {
      id: "INV-9385",
      vendor: "City Gas LPG Agency",
      item: "Commercial Gas Cylinder (19kg x 2)",
      dueDate: "Paid 3 days ago",
      amount: "₹3,600",
      status: "PAID",
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
                COGS: 31.2% (Target: &lt;32%)
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Healthy Gross Margins
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Expenses & Vendor Bills
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Procurement expenditures, cost of goods sold, and payables schedule
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <DateRangeSelector value={timeRange} onChange={setTimeRange} />
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Expense
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Expenses"
            value="₹21,450.00"
            comparison="-4.8%"
            subtext="lower than budget"
            isPositive={true}
            icon={Receipt}
            accentColor="#FF5B2E"
            sparklineData={[28, 26, 25, 24, 23, 22, 21.4]}
          />
          <KpiCard
            title="Food Cost (COGS)"
            value="31.2%"
            comparison="-1.5%"
            subtext="optimal kitchen ratio"
            isPositive={true}
            icon={CheckCircle2}
            accentColor="#10b981"
            sparklineData={[34, 33.5, 33, 32.2, 31.8, 31.2]}
          />
          <KpiCard
            title="Bills Payable"
            value="₹8,600.00"
            comparison="2 invoices"
            subtext="due this week"
            isPositive={false}
            icon={Clock}
            accentColor="#f59e0b"
            sparklineData={[12, 10, 11, 9, 8.6]}
          />
          <KpiCard
            title="Daily Operating Margin"
            value="55.5%"
            comparison="+3.8%"
            subtext="after variable costs"
            isPositive={true}
            icon={TrendingUp}
            accentColor="#3b82f6"
            sparklineData={[48, 50, 52, 51, 53, 55.5]}
          />
        </div>

        {/* Expense Category Cards */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Cost Breakdown by Category
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Daily procurement expenditure tracked against budgeted thresholds
              </p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              Budget Allocated: ₹23,500
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {expenseBreakdown.map((item) => (
              <div
                key={item.category}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <span className="font-bold text-slate-900">{item.amount}</span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.share}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Budget: {item.budget}</span>
                  <span
                    className={
                      item.status.includes("Over")
                        ? "font-semibold text-rose-600"
                        : "font-medium text-emerald-600"
                    }
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Payables Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Vendor Invoices & Scheduled Settlements
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Raw material suppliers and recurring kitchen vendor dues
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              Download Expense Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Invoice #</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Supply Description</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendorBills.map((bill) => (
                  <tr key={bill.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {bill.id}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {bill.vendor}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{bill.item}</td>
                    <td className="px-4 py-3.5 text-slate-600">{bill.dueDate}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {bill.amount}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {bill.status === "PAID" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Paid
                        </span>
                      )}
                      {bill.status === "DUE_TODAY" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-600/20">
                          <AlertTriangle className="h-3 w-3" />
                          Due Today
                        </span>
                      )}
                      {bill.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-600/20">
                          <Clock className="h-3 w-3" />
                          Pending
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