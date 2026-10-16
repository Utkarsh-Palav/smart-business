"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UtensilsCrossed,
  Boxes,
  Users,
  WalletCards,
  Megaphone,
  BarChart3,
  CircleHelp,
  Plus,
  Filter,
  Download,
  Search,
  Check,
  Tag,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Heart,
  TrendingUp,
  CreditCard,
  QrCode,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

// ==========================================
// 1. ORDERS SECTION VIEW
// ==========================================
export function OrdersSectionView({ subsection }: { subsection: string }) {
  const [filter, setFilter] = useState("all");

  const orders = [
    {
      id: "ORD-9021",
      customer: "Aarav Sharma",
      type: "Dine-in (Table 4)",
      items: ["2x Truffle Crunch Burger", "1x Loaded Sriracha Fries", "2x Hazelnut Cold Brew"],
      total: "₹890.00",
      status: "PREPARING",
      time: "4 mins ago",
      payment: "PAID (UPI)",
    },
    {
      id: "ORD-9020",
      customer: "Sneha Patel",
      type: "Takeaway",
      items: ["1x Woodfired Peri-Peri Pizza", "1x Garlic Breadsticks"],
      total: "₹540.00",
      status: "READY",
      time: "9 mins ago",
      payment: "PAID (CARD)",
    },
    {
      id: "ORD-9019",
      customer: "Karan Johar",
      type: "Delivery (Zomato)",
      items: ["3x Double Cheese Burger", "2x Coke Zero"],
      total: "₹720.00",
      status: "COMPLETED",
      time: "18 mins ago",
      payment: "ONLINE",
    },
    {
      id: "ORD-9018",
      customer: "Priya Nair",
      type: "Dine-in (Table 1)",
      items: ["1x Farmhouse Pizza", "1x Iced Americano"],
      total: "₹480.00",
      status: "COMPLETED",
      time: "25 mins ago",
      payment: "PAID (CASH)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Queue</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">8 Orders</p>
          <p className="mt-1 text-xs text-[#FF5B2E] font-medium">3 currently on grill</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Prep Speed</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">14.5 min</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">2.1 min faster than target</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today&apos;s Tickets</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">125 Orders</p>
          <p className="mt-1 text-xs text-slate-400">₹48,250 gross billed</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fulfillment Rate</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">98.4%</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Zero kitchen voids</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Live Order Dispatch Queue</h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              Live POS Stream
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Filter className="h-3.5 w-3.5" /> All Sources
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#14181F] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" /> New POS Ticket
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Order #</th>
                <th className="px-4 py-3">Customer &amp; Table</th>
                <th className="px-4 py-3">Items Summary</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-5 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    {o.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-800">{o.customer}</p>
                    <p className="text-[11px] text-slate-400">{o.type}</p>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3.5 text-slate-600">
                    {o.items.join(", ")}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {o.total}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {o.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {o.status === "PREPARING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-600/20">
                        <Clock className="h-3 w-3" /> In Kitchen
                      </span>
                    )}
                    {o.status === "READY" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-600/20">
                        Ready to Serve
                      </span>
                    )}
                    {o.status === "COMPLETED" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                        <CheckCircle2 className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-400">
                    {o.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. MENU SECTION VIEW
// ==========================================
export function MenuSectionView({ subsection }: { subsection: string }) {
  const [items, setItems] = useState([
    {
      id: "m-1",
      name: "Truffle Crunch Gourmet Burger",
      category: "Signature Burgers",
      price: "₹229",
      foodCost: "₹72 (31%)",
      inStock: true,
      orders: 142,
    },
    {
      id: "m-2",
      name: "Woodfired Peri-Peri Pizza",
      category: "Artisan Pizzas",
      price: "₹345",
      foodCost: "₹95 (27%)",
      inStock: true,
      orders: 84,
    },
    {
      id: "m-3",
      name: "Hazelnut Cold Brew & Shakes",
      category: "Beverages",
      price: "₹180",
      foodCost: "₹28 (15%)",
      inStock: true,
      orders: 118,
    },
    {
      id: "m-4",
      name: "Cheesy Loaded Sriracha Fries",
      category: "Starters & Sides",
      price: "₹160",
      foodCost: "₹48 (30%)",
      inStock: true,
      orders: 92,
    },
    {
      id: "m-5",
      name: "Classic Tiramisu Cup",
      category: "Desserts",
      price: "₹190",
      foodCost: "₹55 (28%)",
      inStock: false,
      orders: 45,
    },
  ]);

  function toggleStock(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, inStock: !i.inStock } : i))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              42 Active Menu Items
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Synced with QR Digital Menu &amp; POS</span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" /> + Add New Dish
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900">Menu Engineering &amp; Availability</h2>
          <span className="text-xs text-slate-400">Toggle switch to 86 / mark out-of-stock</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">Food Cost (COGS)</th>
                <th className="px-4 py-3">Orders (30D)</th>
                <th className="px-5 py-3 text-right">Availability (Live)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-4 py-3.5 text-slate-500">{item.category}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{item.price}</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-semibold">{item.foodCost}</td>
                  <td className="px-4 py-3.5 text-slate-700">{item.orders} sold</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStock(item.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                        item.inStock
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100"
                          : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 hover:bg-rose-100"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${item.inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {item.inStock ? "In Stock" : "86'd (Sold Out)"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. INVENTORY SECTION VIEW
// ==========================================
export function InventorySectionView({ subsection }: { subsection: string }) {
  const stock = [
    { name: "Mozzarella Cheese (Block)", current: "1.8 kg", min: "5.0 kg", status: "CRITICAL", supplier: "Vimal Dairy" },
    { name: "Brioche Burger Buns", current: "24 pcs", min: "60 pcs", status: "LOW", supplier: "Royal Bakery" },
    { name: "Cold Brew Arabica Beans", current: "8.5 kg", min: "4.0 kg", status: "GOOD", supplier: "Blue Tokai Roasters" },
    { name: "Truffle Infused Oil (1L)", current: "3 bottles", min: "2 bottles", status: "GOOD", supplier: "Gourmet Direct" },
    { name: "Commercial Cooking LPG (19kg)", current: "2 cylinders", min: "1 cylinder", status: "GOOD", supplier: "City Gas Agency" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Raw SKUs</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">48 Items</p>
          <p className="mt-1 text-xs text-slate-400">Tracked in live kitchen inventory</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 shadow-xs">
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Needs Immediate Order</p>
          <p className="mt-2 text-3xl font-bold text-rose-900">2 Items</p>
          <p className="mt-1 text-xs text-rose-600 font-medium">Mozzarella &amp; Burger Buns</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory Value</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">₹68,450</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Wastage under 1.8%</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900">Raw Ingredients &amp; Stock Levels</h2>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14181F] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            + Create Purchase Order
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Ingredient</th>
                <th className="px-4 py-3">In Stock</th>
                <th className="px-4 py-3">Min Safe Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stock.map((s) => (
                <tr key={s.name} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{s.name}</td>
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{s.current}</td>
                  <td className="px-4 py-3.5 text-slate-500">{s.min}</td>
                  <td className="px-4 py-3.5">
                    {s.status === "CRITICAL" && (
                      <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-600/20">
                        Critical Shortage
                      </span>
                    )}
                    {s.status === "LOW" && (
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-600/20">
                        Low Stock
                      </span>
                    )}
                    {s.status === "GOOD" && (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                        Sufficient
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-slate-600">{s.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. CUSTOMERS SECTION VIEW
// ==========================================
export function CustomersSectionView({ subsection }: { subsection: string }) {
  const customers = [
    { name: "Rahul Deshmukh", tier: "VIP Regular", visits: 24, totalSpent: "₹12,480", favItem: "Truffle Burger", lastVisit: "Yesterday" },
    { name: "Ananya Roy", tier: "Gold Member", visits: 18, totalSpent: "₹8,920", favItem: "Cold Brew", lastVisit: "3 days ago" },
    { name: "Devendra Verma", tier: "Silver", visits: 8, totalSpent: "₹3,450", favItem: "Peri-Peri Pizza", lastVisit: "1 week ago" },
    { name: "Simran Kaur", tier: "New Guest", visits: 1, totalSpent: "₹650", favItem: "Loaded Fries", lastVisit: "Today" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Guests</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">1,480 Guests</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">+38 new this week</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Repeat Customer Rate</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">64.2%</p>
          <p className="mt-1 text-xs text-slate-400">High loyalty retention</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Satisfaction</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">4.8 ★</p>
          <p className="mt-1 text-xs text-slate-400">Based on 184 reviews</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900">Guest CRM &amp; Loyalty Directory</h2>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" /> Export Guests
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-4 py-3">Membership Tier</th>
                <th className="px-4 py-3">Total Visits</th>
                <th className="px-4 py-3">Lifetime Value (LTV)</th>
                <th className="px-4 py-3">Favorite Item</th>
                <th className="px-5 py-3 text-right">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {customers.map((c) => (
                <tr key={c.name} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-600/20">
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{c.visits} visits</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{c.totalSpent}</td>
                  <td className="px-4 py-3.5 text-slate-600">{c.favItem}</td>
                  <td className="px-5 py-3.5 text-right text-slate-400">{c.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. FINANCE SECTION VIEW
// ==========================================
export function FinanceSectionView({ subsection }: { subsection: string }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today&apos;s Settled Funds</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">₹39,565.00</p>
          <p className="mt-1 text-xs text-slate-400">Transferred to HDFC Bank A/c ending 8812</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unsettled Cash in Register</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">₹6,755.00</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Physical cash in till box</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated GST Liability</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">₹2,298.00</p>
          <p className="mt-1 text-xs text-slate-400">5% composite food service rate</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daily Cash Drawer Closing &amp; Reconciliation</h2>
            <p className="text-xs text-slate-500">Compare physical drawer counts against digital POS receipts</p>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#14181F] px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Close Day &amp; Print Z-Report
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <span className="text-xs font-semibold text-slate-500">Opening Float</span>
            <p className="mt-1 text-xl font-bold text-slate-900">₹2,000.00</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <span className="text-xs font-semibold text-slate-500">Cash Collected</span>
            <p className="mt-1 text-xl font-bold text-slate-900">₹6,755.00</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <span className="text-xs font-semibold text-emerald-800">Expected Total in Drawer</span>
            <p className="mt-1 text-xl font-bold text-emerald-700">₹8,755.00 (Balanced)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. DEFAULT / FALLBACK SECTION VIEW
// ==========================================
export function GenericSectionView({
  section,
  subsection,
}: {
  section: string;
  subsection: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5B2E]/10 text-[#FF5B2E]">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 capitalize">
            {section} Operations Hub
          </h2>
          <p className="text-xs text-slate-500">
            Managed under Munchy Krunchy Bhayandar workspace
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <span className="text-xs font-semibold text-slate-400">Current Module</span>
          <p className="mt-1 font-bold text-slate-800 capitalize">{subsection.replaceAll("-", " ")}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <span className="text-xs font-semibold text-slate-400">Status</span>
          <p className="mt-1 font-bold text-emerald-600">Operational &amp; Active</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <span className="text-xs font-semibold text-slate-400">Sync Mode</span>
          <p className="mt-1 font-bold text-slate-800">Real-time Neon DB</p>
        </div>
      </div>
    </div>
  );
}
