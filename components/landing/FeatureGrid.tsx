"use client";

import React from "react";
import { 
  Layers, 
  Smartphone, 
  ChefHat, 
  Package, 
  MessageSquare, 
  Building2, 
  Receipt, 
  ShieldCheck, 
  Check, 
  ArrowUpRight 
} from "lucide-react";

export default function FeatureGrid() {
  const modules = [
    {
      num: "01",
      icon: <Layers className="w-5 h-5 text-[#FF5B2E]" />,
      title: "Omnichannel Cloud POS",
      desc: "Integrates Swiggy, Zomato, counter billing, and table orders into one responsive terminal with immutable server-side financial snapshots.",
      points: [
        "1-Click Global Item 86 Kill-Switch across all channels",
        "ESC/POS Thermal KOT and bill printer support",
        "Multi-tender payment settlement (Cash, Card, UPI)",
      ],
    },
    {
      num: "02",
      icon: <Smartphone className="w-5 h-5 text-amber-400" />,
      title: "Smart QR & NFC Table Ordering",
      desc: "Guests scan the table token to view live photo menus, apply dietary filters (Veg/Non-Veg), customize modifiers, and split table bills.",
      points: [
        "Zero app installation required via mobile web",
        "Instant table-side UPI QR payment generation",
        "TableRoute token resolution via Control Plane",
      ],
    },
    {
      num: "03",
      icon: <ChefHat className="w-5 h-5 text-emerald-400" />,
      title: "Kitchen Display System (KDS)",
      desc: "Real-time ticket routing across stations (Grill, Fryer, Coffee Bar, Dessert) with preparation countdown timers and audible chimes.",
      points: [
        "Station-specific dish splitting from single bills",
        "Urgency countdown timers with visual color alerts",
        "Hardware agnostic — runs on any tablet or display",
      ],
    },
    {
      num: "04",
      icon: <Package className="w-5 h-5 text-purple-400" />,
      title: "Recipe-Level Live Inventory",
      desc: "Maps menu items directly to ingredients. Every completed order decrements raw stock to give an accurate, real-time stock ledger.",
      points: [
        "Sub-gram ingredient auto-decrementing",
        "Wastage and spoilage variance tracking",
        "Automated low-stock supplier purchase orders",
      ],
    },
    {
      num: "05",
      icon: <MessageSquare className="w-5 h-5 text-[#00A884]" />,
      title: "WhatsApp CRM & Communications",
      desc: "Official WhatsApp Cloud API integration to send digital invoices, capture 5★ Google reviews, and re-engage inactive diners.",
      points: [
        "100% direct customer contact data ownership",
        "Automated post-dine Google Review triggers",
        "Zero-commission direct delivery ordering links",
      ],
    },
    {
      num: "06",
      icon: <Building2 className="w-5 h-5 text-blue-400" />,
      title: "Multi-Brand & Franchise Hub",
      desc: "Centralized business hierarchy (Owner → Brand → Outlet → Station) with master catalog governance and store price overrides.",
      points: [
        "Granular Role-Based Access Control (RBAC)",
        "Automated franchise royalty billing calculations",
        "Cross-outlet sales and gross margin reporting",
      ],
    },
    {
      num: "07",
      icon: <Receipt className="w-5 h-5 text-teal-400" />,
      title: "Reconciliation & Tax Compliance",
      desc: "Automated aggregator payout reconciliation, daily cash drawer balance tracking, and GST-compliant B2B & B2C tax invoicing.",
      points: [
        "Spot hidden aggregator commission deductions",
        "Daily EOD summary reports sent to owner's WhatsApp",
        "Automated GST calculation and breakdown",
      ],
    },
    {
      num: "08",
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      title: "Neon DB-per-Business Isolation",
      desc: "Physical database isolation on Neon PostgreSQL for every registered business. Zero cross-tenant data leakage risk.",
      points: [
        "Infisical encrypted secret management",
        "Prisma 7 modern driver adapters with sub-50ms queries",
        "Zero credentials exposed to client browsers",
      ],
    },
  ];

  return (
    <section id="modules" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#07090E]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Comprehensive Modular Architecture
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Eight foundational modules engineered to cover every physical and digital operational touchpoint.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {modules.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0E121A] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-150"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    {m.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-500">{m.num}</span>
                </div>

                <h3 className="text-sm font-bold text-white mt-3.5">{m.title}</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{m.desc}</p>

                <ul className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                  {m.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[11px] text-gray-400">
                Module #{m.num} • Enterprise Standard
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
