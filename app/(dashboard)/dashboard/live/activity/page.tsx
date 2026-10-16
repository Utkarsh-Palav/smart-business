"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Flame,
  ChefHat,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Timer,
  ShoppingBag,
} from "lucide-react";

type LiveTicket = {
  id: string;
  table: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  timeElapsed: string;
  status: "QUEUED" | "COOKING" | "READY";
  items: { name: string; qty: number; notes?: string }[];
  server: string;
};

export default function DashboardLiveActivityPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const [tickets, setTickets] = useState<LiveTicket[]>([
    {
      id: "KOT-104",
      table: "Table 04",
      orderType: "DINE_IN",
      timeElapsed: "4m 12s",
      status: "COOKING",
      items: [
        { name: "Truffle Crunch Gourmet Burger", qty: 2, notes: "Well done, extra pickles" },
        { name: "Cheesy Sriracha Loaded Fries", qty: 1 },
        { name: "Hazelnut Cold Brew", qty: 2 },
      ],
      server: "Rohan K.",
    },
    {
      id: "KOT-105",
      table: "Takeaway Counter",
      orderType: "TAKEAWAY",
      timeElapsed: "8m 45s",
      status: "COOKING",
      items: [
        { name: "Woodfired Peri-Peri Pizza", qty: 1, notes: "Thin crust, extra oregano" },
        { name: "Garlic Herb Breadsticks", qty: 1 },
      ],
      server: "Pooja S.",
    },
    {
      id: "KOT-106",
      table: "Table 09",
      orderType: "DINE_IN",
      timeElapsed: "1m 30s",
      status: "QUEUED",
      items: [
        { name: "Crispy Chicken Tenders", qty: 2 },
        { name: "Classic Iced Latte", qty: 2, notes: "Oat milk substitution" },
      ],
      server: "Rohan K.",
    },
    {
      id: "KOT-103",
      table: "Table 02",
      orderType: "DINE_IN",
      timeElapsed: "14m 20s",
      status: "READY",
      items: [
        { name: "Double Smash Cheese Burger", qty: 1 },
        { name: "Salted Caramel Milkshake", qty: 1 },
      ],
      server: "Amit V.",
    },
  ]);

  function advanceTicket(id: string) {
    setTickets((prev) =>
      prev
        .map((t): LiveTicket => {
          if (t.id === id) {
            if (t.status === "QUEUED") return { ...t, status: "COOKING" as const };
            if (t.status === "COOKING") return { ...t, status: "READY" as const };
          }
          return t;
        })
        .filter((t) => !(t.id === id && t.status === "READY"))
    );
  }

  const queued = tickets.filter((t) => t.status === "QUEUED");
  const cooking = tickets.filter((t) => t.status === "COOKING");
  const ready = tickets.filter((t) => t.status === "READY");

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
                Live KOT Stream Active
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600">
                Kitchen Display System (KDS)
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Live Kitchen Radar &amp; Orders
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Real-time ticket progression, preparation timers, and expediter controls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 text-[#FF5B2E]" /> Audio Chime On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 text-slate-400" /> Chime Muted
                </>
              )}
            </button>
            <span className="rounded-xl bg-[#14181F] px-3 py-1.5 text-xs font-semibold text-white">
              {tickets.length} Active Tickets
            </span>
          </div>
        </div>

        {/* 3-Column KDS Board */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Column 1: Queued */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <h2 className="text-sm font-bold text-slate-800">
                  1. Queued &amp; Punched
                </h2>
              </div>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                {queued.length}
              </span>
            </div>

            <div className="mt-3.5 space-y-3">
              {queued.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  No tickets waiting
                </p>
              ) : (
                queued.map((t) => (
                  <TicketCard key={t.id} ticket={t} onAdvance={() => advanceTicket(t.id)} />
                ))
              )}
            </div>
          </div>

          {/* Column 2: On Grill / Cooking */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-[#FF5B2E]" />
                <h2 className="text-sm font-bold text-slate-800">
                  2. In Preparation
                </h2>
              </div>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-[#FF5B2E]">
                {cooking.length}
              </span>
            </div>

            <div className="mt-3.5 space-y-3">
              {cooking.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  Kitchen grill idle
                </p>
              ) : (
                cooking.map((t) => (
                  <TicketCard key={t.id} ticket={t} onAdvance={() => advanceTicket(t.id)} />
                ))
              )}
            </div>
          </div>

          {/* Column 3: Ready for Pickup / Served */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-800">
                  3. Plated &amp; Ready
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                {ready.length}
              </span>
            </div>

            <div className="mt-3.5 space-y-3">
              {ready.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  No plates on pass
                </p>
              ) : (
                ready.map((t) => (
                  <TicketCard key={t.id} ticket={t} onAdvance={() => advanceTicket(t.id)} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  onAdvance,
}: {
  ticket: LiveTicket;
  onAdvance: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-slate-300">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-slate-900">
          {ticket.id}
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#FF5B2E]">
          <Timer className="h-3 w-3" />
          {ticket.timeElapsed}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800">{ticket.table}</span>
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
          {ticket.orderType}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5">
        {ticket.items.map((item, idx) => (
          <div key={idx} className="text-xs">
            <div className="flex items-start justify-between font-medium text-slate-800">
              <span>{item.name}</span>
              <span className="font-bold font-mono">x{item.qty}</span>
            </div>
            {item.notes && (
              <p className="text-[10px] italic text-[#FF5B2E]">↳ {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
        <span>Server: {ticket.server}</span>
        <button
          type="button"
          onClick={onAdvance}
          className="inline-flex items-center gap-1 rounded-md bg-[#14181F] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#FF5B2E] transition-colors"
        >
          {ticket.status === "QUEUED"
            ? "Fire to Grill →"
            : ticket.status === "COOKING"
            ? "Mark Plated ✓"
            : "Dispatch ✓"}
        </button>
      </div>
    </div>
  );
}