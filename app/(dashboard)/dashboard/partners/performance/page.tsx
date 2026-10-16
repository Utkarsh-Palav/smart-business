"use client";

import React, { useState } from "react";
import {
  Handshake,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  Power,
  Store,
  Star,
  Download,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
} from "lucide-react";

type PartnerChannel = {
  id: string;
  name: string;
  type: string;
  status: "ONLINE" | "PAUSED" | "DEGRADED";
  rating: string;
  ordersToday: number;
  revenueToday: string;
  commissionRate: string;
  payoutStatus: string;
  accent: string;
};

export default function DashboardPartnersPerformancePage() {
  const [channels, setChannels] = useState<PartnerChannel[]>([
    {
      id: "swiggy",
      name: "Swiggy Food Delivery",
      type: "Online Delivery Aggregator",
      status: "ONLINE",
      rating: "4.4 ★",
      ordersToday: 28,
      revenueToday: "₹10,360",
      commissionRate: "22%",
      payoutStatus: "Daily T+1 Direct Bank",
      accent: "#f59e0b",
    },
    {
      id: "zomato",
      name: "Zomato Restaurant Partner",
      type: "Online Delivery Aggregator",
      status: "ONLINE",
      rating: "4.3 ★",
      ordersToday: 19,
      revenueToday: "₹7,410",
      commissionRate: "23%",
      payoutStatus: "Daily T+1 Direct Bank",
      accent: "#e11d48",
    },
    {
      id: "ondc",
      name: "ONDC Open Network (Magicpin/Paytm)",
      type: "Govt-Backed Open Commerce",
      status: "ONLINE",
      rating: "4.6 ★",
      ordersToday: 8,
      revenueToday: "₹3,120",
      commissionRate: "3%",
      payoutStatus: "Instant Settlement",
      accent: "#10b981",
    },
    {
      id: "razorpay",
      name: "Razorpay Smart POS & Dynamic QR",
      type: "Payment Gateway & Dine-in Billing",
      status: "ONLINE",
      rating: "99.9% Uptime",
      ordersToday: 84,
      revenueToday: "₹32,180",
      commissionRate: "1.8%",
      payoutStatus: "Same Day 6:00 PM Batch",
      accent: "#3b82f6",
    },
    {
      id: "google",
      name: "Google Business & Maps Profile",
      type: "Discovery & Review Cards",
      status: "ONLINE",
      rating: "4.8 ★ (184 reviews)",
      ordersToday: 42,
      revenueToday: "NFC Review Taps",
      commissionRate: "0%",
      payoutStatus: "Organic Footfall",
      accent: "#FF5B2E",
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  function handleSyncAll() {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 900);
  }

  function toggleChannelStatus(id: string) {
    setChannels((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: c.status === "ONLINE" ? "PAUSED" : "ONLINE",
          };
        }
        return c;
      })
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                <CheckCircle2 className="h-3.5 w-3.5" /> All 5 Integrations Healthy
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Menu &amp; Webhooks Synced
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Connected Channels &amp; Partners
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Live status, automated menu broadcasting, and aggregator take-rate performance
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSyncAll}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-[#FF5B2E]" : ""}`} />
              Push Menu Changes
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              + Add Partner Channel
            </button>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((c) => (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {c.type}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    {c.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => toggleChannelStatus(c.id)}
                  aria-label={`Toggle status for ${c.name}`}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                    c.status === "ONLINE"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Power className="h-3 w-3" />
                  {c.status}
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Orders / Taps:</span>
                  <p className="mt-0.5 text-base font-bold text-slate-900">
                    {c.ordersToday}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Volume Today:</span>
                  <p className="mt-0.5 text-base font-bold text-slate-900">
                    {c.revenueToday}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Platform Take-rate:</span>
                  <p className="mt-0.5 font-bold text-slate-700">
                    {c.commissionRate}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Rating / Trust:</span>
                  <p className="mt-0.5 font-bold text-amber-600">
                    {c.rating}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                <span className="truncate">{c.payoutStatus}</span>
                <span className="text-[#FF5B2E] font-semibold flex items-center gap-0.5 group-hover:underline">
                  Configure <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}