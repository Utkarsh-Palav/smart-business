"use client";

import React, { useState } from "react";
import { 
  Layers, 
  ChefHat, 
  Smartphone, 
  Package, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Minus, 
  Printer, 
  AlertTriangle, 
  Sparkles, 
  QrCode, 
  Check, 
  CreditCard,
  Send,
  Sliders,
  Utensils
} from "lucide-react";

export default function InteractiveSandbox() {
  const [activeTab, setActiveTab] = useState<"pos" | "kds" | "qr" | "inventory" | "crm">("pos");

  // POS State
  const [orders, setOrders] = useState([
    {
      id: "ORD-104",
      channel: "SWIGGY",
      channelBadge: "bg-[#FC8019]/15 text-[#FC8019] border-[#FC8019]/30",
      customer: "Aarav S. • Swiggy Delivery",
      items: [
        { name: "Truffle Smash Burger", qty: 2, price: 560 },
        { name: "Parmesan Truffle Fries", qty: 1, price: 180 },
        { name: "Berry Iced Tea", qty: 2, price: 190 },
      ],
      total: 930,
      time: "1m ago",
      status: "NEW",
    },
    {
      id: "ORD-105",
      channel: "TABLE 04",
      channelBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      customer: "Dine-In • Table 04 (4 Guests)",
      items: [
        { name: "Wood-Fired Margherita Pizza", qty: 1, price: 420 },
        { name: "Peri Peri Loaded Fries", qty: 1, price: 210 },
        { name: "Cold Brew Tonic", qty: 2, price: 340 },
      ],
      total: 970,
      time: "Just now",
      status: "NEW",
    },
    {
      id: "ORD-102",
      channel: "ZOMATO",
      channelBadge: "bg-[#E23744]/15 text-[#E23744] border-[#E23744]/30",
      customer: "Priya N. • Zomato Pro",
      items: [
        { name: "Artisanal Burrata Bowl", qty: 1, price: 390 },
        { name: "Avocado Toast", qty: 1, price: 280 },
      ],
      total: 670,
      time: "6m ago",
      status: "PREPARING",
    },
  ]);

  const acceptOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "PREPARING" } : o))
    );
  };

  // KDS State
  const [kdsTickets, setKdsTickets] = useState([
    {
      id: "KDS-301",
      source: "Table 04",
      station: "GRILL & PIZZA",
      items: [
        { name: "Wood-Fired Margherita", qty: 1, note: "Well done crust" },
        { name: "Peri Peri Loaded Fries", qty: 1, note: "Dip on side" },
      ],
      elapsed: "03:45",
      status: "COOKING",
    },
    {
      id: "KDS-302",
      source: "Swiggy #104",
      station: "BURGER STATION",
      items: [
        { name: "Truffle Smash Burger", qty: 2, note: "Brioche bun" },
        { name: "Parmesan Truffle Fries", qty: 1, note: "" },
      ],
      elapsed: "07:12",
      status: "COOKING",
    },
    {
      id: "KDS-303",
      source: "Table 02",
      station: "BEVERAGE BAR",
      items: [
        { name: "Cold Brew Tonic", qty: 2, note: "Less ice" },
        { name: "Berry Iced Tea", qty: 1, note: "" },
      ],
      elapsed: "01:20",
      status: "READY",
    },
  ]);

  const bumpTicket = (id: string) => {
    setKdsTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "COOKING" ? "READY" : "SERVED" } : t))
    );
  };

  // QR Ordering State
  const [qrItems, setQrItems] = useState([
    { name: "Signature Truffle Fettuccine", price: 420, qty: 1 },
    { name: "Crispy Avocado Sourdough", price: 290, qty: 1 },
  ]);
  const [qrOrderSent, setQrOrderSent] = useState(false);

  const qrTotal = qrItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  // Inventory State
  const inventoryData = [
    { name: "Brioche Burger Buns", current: 42, max: 100, unit: "pcs", unitCost: "₹18.00", status: "NORMAL" },
    { name: "Imported Mozzarella", current: 3.4, max: 20, unit: "kg", unitCost: "₹480/kg", status: "LOW" },
    { name: "Grass-Fed Beef Patty Prep", current: 14.5, max: 30, unit: "kg", unitCost: "₹620/kg", status: "NORMAL" },
    { name: "Truffle Oil Dressing", current: 2, max: 12, unit: "bottles", unitCost: "₹1,200", status: "LOW" },
  ];

  return (
    <div className="w-full bg-[#0D1017] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Application Bar */}
      <div className="bg-[#090C12] border-b border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 inline-block" />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs font-mono text-gray-400">
            Urban Kitchen POS Hub • Store: Andheri Flagship (Active)
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#141824] p-1 rounded-lg border border-white/5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("pos")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === "pos" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>01. Unified POS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("kds")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === "kds" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>02. Kitchen KDS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === "qr" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>03. Smart QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === "inventory" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>04. Recipe Stock</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("crm")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === "crm" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>05. WhatsApp CRM</span>
          </button>
        </div>
      </div>

      {/* Main Terminal View Container */}
      <div className="p-4 sm:p-6 lg:p-7">
        {/* Tab 1: Unified POS */}
        {activeTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Orders Feed */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Live Order Queue (3 Active Channels)
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5 text-emerald-400" /> Auto-Print KOT Online
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-[#131722] border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ord.channelBadge}`}>
                            {ord.channel}
                          </span>
                          <span className="text-xs font-mono text-white font-medium">{ord.id}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">{ord.time}</span>
                      </div>

                      <div className="pt-2">
                        <div className="text-xs font-semibold text-gray-200">{ord.customer}</div>
                        <div className="mt-2 space-y-1">
                          {ord.items.map((it, i) => (
                            <div key={i} className="flex justify-between text-xs text-gray-300">
                              <span>{it.qty}x {it.name}</span>
                              <span className="font-mono text-gray-400">₹{it.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Total</span>
                        <span className="text-sm font-bold text-white font-mono">₹{ord.total}</span>
                      </div>

                      {ord.status === "NEW" ? (
                        <button
                          type="button"
                          onClick={() => acceptOrder(ord.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept Order
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Preparing in KDS
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* POS Sidebar: Controls */}
            <div className="lg:col-span-4 bg-[#111520] border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block pb-2 border-b border-white/5">
                  Real-time Operational Controls
                </span>

                {/* Kill Switch */}
                <div className="mt-3 p-3 rounded-lg bg-red-950/20 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-xs font-bold text-red-200">Global Item 86 Kill-Switch</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Instantly marks an item sold out across Swiggy, Zomato, QR menus, and POS simultaneously.
                  </p>
                  <div className="mt-2 flex items-center justify-between p-2 rounded bg-black/40 text-xs">
                    <span className="text-gray-300">Truffle Burrata</span>
                    <span className="text-[10px] font-mono text-red-400 font-semibold uppercase">Disabled</span>
                  </div>
                </div>

                {/* Session Settlement */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Active Cash Drawer:</span>
                    <span className="font-mono text-white">₹8,420.00</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>UPI & Online Settled:</span>
                    <span className="font-mono text-emerald-400 font-semibold">₹34,890.00</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated GST (5%):</span>
                    <span className="font-mono text-gray-300">₹2,165.50</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
                <span>Database Sync: Neon Serverless</span>
                <span className="text-emerald-400 font-mono">0.04s latency</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Kitchen KDS */}
        {activeTab === "kds" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Kitchen Display System (KDS Station Split)
              </span>
              <span className="text-xs text-gray-400">3 Tickets in Prep</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kdsTickets.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    t.status === "READY"
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : "bg-[#131722] border-white/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                      <div>
                        <div className="text-sm font-bold text-white">{t.source}</div>
                        <div className="text-[10px] font-mono text-gray-400">{t.station}</div>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        <span>{t.elapsed}</span>
                      </div>
                    </div>

                    <div className="pt-2.5 space-y-2">
                      {t.items.map((it, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="font-semibold text-gray-200">{it.qty}x {it.name}</div>
                          {it.note && (
                            <div className="text-[10px] text-amber-300/80 italic pl-1 border-l border-amber-500/40 mt-0.5">
                              {it.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => bumpTicket(t.id)}
                      className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        t.status === "READY"
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.status === "READY" ? "Served & Clear" : "Bump Ticket (Mark Ready)"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Smart QR Menu */}
        {activeTab === "qr" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-[#090C12] border border-white/15 p-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                  <div>
                    <span className="font-bold text-white block">Table 12 • Urban Kitchen</span>
                    <span className="text-[10px] text-emerald-400">⚡ Live Menu</span>
                  </div>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">Token: /t/8b2a</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Signature Truffle Fettuccine</span>
                      <span className="text-[10px] text-gray-400">Fresh egg pasta, shaved winter truffles.</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">₹420</span>
                    </div>
                    <span className="text-xs font-mono bg-[#FF5B2E]/20 text-[#FF5B2E] px-2 py-1 rounded">1x</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Crispy Avocado Sourdough</span>
                      <span className="text-[10px] text-gray-400">Hass avocado, chili flakes, microgreens.</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">₹290</span>
                    </div>
                    <span className="text-xs font-mono bg-[#FF5B2E]/20 text-[#FF5B2E] px-2 py-1 rounded">1x</span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Subtotal (2 Items):</span>
                    <span className="font-mono font-bold text-white">₹{qrTotal}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setQrOrderSent(true)}
                    className="w-full py-2 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] text-white text-xs font-semibold transition-colors"
                  >
                    {qrOrderSent ? "✓ Order Sent Directly to KDS!" : "Confirm Table Order →"}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Direct Table-Side Ordering & Payment</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Diners scan the table QR code with standard phone cameras. No application download required. 
                Orders bypass waiter manual punch-in, reducing order latency from 8 minutes to 15 seconds.
              </p>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Individual & split table bill payment with instant UPI generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dietary filters (Pure Veg, Vegan, Gluten-Free, Allergens)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Automated beverage & side pairing recommendations</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Recipe Inventory */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Recipe-Level Real-Time Inventory Ledger
              </span>
              <span className="text-[11px] text-gray-400">Idempotent Stock Decrementing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {inventoryData.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#131722] border border-white/10 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      item.status === "LOW" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {item.status === "LOW" ? "Low Stock" : "Sufficient"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-lg font-mono font-bold text-white">
                      {item.current} <span className="text-xs font-normal text-gray-400">{item.unit}</span>
                    </span>
                    <span className="text-[11px] text-gray-400">{item.unitCost}</span>
                  </div>

                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.status === "LOW" ? "bg-red-500" : "bg-emerald-400"}`}
                      style={{ width: `${(item.current / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
              <span>Selling 1 Gourmet Burger auto-deducts: 1 Bun (-1), 150g Patty (-150g), 20g Sauce (-20g).</span>
              <span className="text-emerald-400 font-mono font-semibold">100% Stock Ledger Integrity</span>
            </div>
          </div>
        )}

        {/* Tab 5: WhatsApp CRM */}
        {activeTab === "crm" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-xl bg-[#090C12] border border-white/10 max-w-md space-y-3">
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 pb-2 border-b border-white/5">
                  <MessageSquare className="w-3.5 h-3.5" /> Official WhatsApp Cloud API
                </div>

                <div className="p-3 rounded-lg bg-[#141E1C] text-white text-xs space-y-1.5 border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 font-semibold block">Automated Receipt & 5★ Review</span>
                  <p className="text-gray-200">
                    Hi Rahul! Thank you for dining at Urban Kitchen. Your bill for <strong>₹970</strong> is available here.
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    Loved your meal? Tap below to leave a 5-star Google review:
                  </p>
                  <div className="p-1.5 bg-emerald-600 rounded text-center text-white font-bold text-[11px]">
                    ⭐ Leave Google Review
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-lg font-bold text-white">Own Your Guest Relationships</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Third-party delivery platforms withhold customer phone numbers. Urban Kitchen captures direct customer contacts at the dining table, enabling automated WhatsApp receipts, 5-star review collection, and private repeat ordering.
              </p>
              <div className="pt-2 text-xs text-gray-400 font-mono">
                ✓ No third-party lock-in • 100% Data Exportable anytime
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
