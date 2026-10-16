"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  PackageCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  RotateCcw,
  Boxes,
  Bell,
  Utensils,
} from "lucide-react";
import Link from "next/link";

type AlertItem = {
  id: string;
  title: string;
  description: string;
  category: "STOCK" | "TASK" | "SYSTEM";
  severity: "CRITICAL" | "WARNING" | "INFO";
  time: string;
  actionText: string;
  actionHref?: string;
};

export default function DashboardAlertsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const initialAlerts: AlertItem[] = [
    {
      id: "alt-1",
      title: "Critical Low Stock: Mozzarella Cheese (Block)",
      description: "Remaining stock is 1.8 kg (Safety threshold: 5.0 kg). Runout expected in 45 mins during dinner rush.",
      category: "STOCK",
      severity: "CRITICAL",
      time: "8 mins ago",
      actionText: "Procure from Vimal Dairy",
      actionHref: "/inventory/alerts",
    },
    {
      id: "alt-2",
      title: "Low Stock: Brioche Burger Buns",
      description: "Only 24 buns remaining in bakery rack. 142 burgers were ordered yesterday.",
      category: "STOCK",
      severity: "WARNING",
      time: "22 mins ago",
      actionText: "Order 100 Buns",
      actionHref: "/inventory/alerts",
    },
    {
      id: "alt-3",
      title: "Kitchen Task: Cold Brew Concentration Batching",
      description: "Brewing container #2 needs filtration before 4:00 PM for peak evening coffee rush.",
      category: "TASK",
      severity: "WARNING",
      time: "35 mins ago",
      actionText: "Mark Task Complete",
    },
    {
      id: "alt-4",
      title: "Food Item Auto-Disabled (86'd): Hazelnut Gelato",
      description: "Auto-disabled across Dine-in QR Menu, Swiggy, and Zomato because stock hit zero.",
      category: "SYSTEM",
      severity: "INFO",
      time: "1 hour ago",
      actionText: "View Menu Status",
      actionHref: "/menu/availability",
    },
    {
      id: "alt-5",
      title: "Scheduled Maintenance: Espresso Machine Decalcification",
      description: "Recommended weekly clean cycle for Group Head 1 & Steam Wand.",
      category: "TASK",
      severity: "INFO",
      time: "2 hours ago",
      actionText: "Acknowledge",
    },
  ];

  function toggleResolve(id: string) {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredAlerts = initialAlerts.filter((a) => {
    if (filter === "RESOLVED") return resolvedIds.has(a.id);
    if (resolvedIds.has(a.id)) return false;
    if (filter === "ALL") return true;
    return a.category === filter;
  });

  const activeCount = initialAlerts.length - resolvedIds.size;

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                {activeCount} Actions Require Attention
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Kitchen &amp; Operations Sentinel
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Operations &amp; Stock Alerts
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Real-time warnings, low stock thresholds, and operational bottleneck mitigations
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white p-1 shadow-xs">
            {[
              { id: "ALL", label: "All Active" },
              { id: "STOCK", label: "Stock & Inventory" },
              { id: "TASK", label: "Kitchen Tasks" },
              { id: "RESOLVED", label: `Resolved (${resolvedIds.size})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === tab.id
                    ? "bg-[#14181F] text-white"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3.5">
          {filteredAlerts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <h3 className="mt-3 text-base font-bold text-slate-900">
                All clear! No pending alerts
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Your kitchen operations and inventory levels are running smoothly.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isResolved = resolvedIds.has(alert.id);
              return (
                <div
                  key={alert.id}
                  className={`group relative flex flex-col justify-between gap-4 rounded-2xl border p-5 transition-all sm:flex-row sm:items-center ${
                    isResolved
                      ? "border-slate-200 bg-slate-50/70 opacity-60"
                      : alert.severity === "CRITICAL"
                      ? "border-rose-200 bg-rose-50/30 shadow-xs hover:border-rose-300"
                      : alert.severity === "WARNING"
                      ? "border-amber-200 bg-amber-50/20 shadow-xs hover:border-amber-300"
                      : "border-slate-200/80 bg-white shadow-xs hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        alert.severity === "CRITICAL"
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-500/30"
                          : alert.severity === "WARNING"
                          ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                          : "bg-slate-800 text-white"
                      }`}
                    >
                      {alert.category === "STOCK" ? (
                        <Boxes className="h-5 w-5" />
                      ) : alert.category === "TASK" ? (
                        <Utensils className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            alert.severity === "CRITICAL"
                              ? "bg-rose-100 text-rose-800"
                              : alert.severity === "WARNING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {alert.time}
                        </span>
                      </div>
                      <h3
                        className={`mt-1 text-sm font-bold ${
                          isResolved ? "line-through text-slate-500" : "text-slate-900"
                        }`}
                      >
                        {alert.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 max-w-2xl">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleResolve(alert.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        isResolved
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5" /> Re-open
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" /> Resolve
                        </>
                      )}
                    </button>

                    {alert.actionHref ? (
                      <Link
                        href={alert.actionHref}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#14181F] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
                      >
                        <span>{alert.actionText}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleResolve(alert.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5B2E] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#e5491e]"
                      >
                        <span>{alert.actionText}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}