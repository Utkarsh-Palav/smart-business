"use client";

import React from "react";
import { 
  Wifi, 
  Smartphone, 
  Layers, 
  ChefHat, 
  Package, 
  MessageSquare, 
  Building2, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function OperatingFlywheel() {
  const steps = [
    {
      num: "01",
      title: "Physical Review Card",
      desc: "Tap-to-review NFC card placed at dining tables or billing counters.",
      icon: <Wifi className="w-5 h-5 text-[#FF5B2E]" />,
    },
    {
      num: "02",
      title: "Digital QR Menu",
      desc: "High-resolution photo menus with dietary tags and dynamic pricing.",
      icon: <Smartphone className="w-5 h-5 text-amber-400" />,
    },
    {
      num: "03",
      title: "Table & Waiter Ordering",
      desc: "Guests or waiters place orders directly into the central stream.",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "04",
      title: "Unified Cloud POS",
      desc: "Swiggy, Zomato, counter, and dine-in orders merged onto one screen.",
      icon: <Layers className="w-5 h-5 text-blue-400" />,
    },
    {
      num: "05",
      title: "Kitchen Display (KDS)",
      desc: "Station routing (Grill, Barista, Fryer) with prep countdown timers.",
      icon: <ChefHat className="w-5 h-5 text-purple-400" />,
    },
    {
      num: "06",
      title: "Recipe Live Inventory",
      desc: "Sub-gram ingredient deductions and automated vendor purchase orders.",
      icon: <Package className="w-5 h-5 text-teal-400" />,
    },
    {
      num: "07",
      title: "WhatsApp CRM",
      desc: "Digital receipts, automated win-backs, and direct delivery orders.",
      icon: <MessageSquare className="w-5 h-5 text-[#00A884]" />,
    },
    {
      num: "08",
      title: "Multi-Outlet Franchising",
      desc: "Centralized brand menus, outlet price overrides, and royalty splits.",
      icon: <Building2 className="w-5 h-5 text-rose-400" />,
    },
  ];

  return (
    <section id="flywheel" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#090C12] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            The Land-and-Expand Strategy
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            How Smart Businesses Scale with Urban Kitchen
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Start with low-friction physical assets and expand progressively into a full restaurant operating system.
          </p>
        </div>

        {/* Step Flow Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0E121B] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-500">{step.num}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-3">{step.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block pt-3 text-right">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 inline-block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
