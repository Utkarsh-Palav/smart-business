"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import { useDashboardBusinessLocation } from "@/components/dashboard/BusinessLocationProvider";

type QueueOrder = {
  id: string;
  orderNumber: string;
  status: "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED";
  source: string;
  table: { name: string } | null;
  customerName: string | null;
  customerPhone: string | null;
  notes: string | null;
  subtotalMinor: number;
  taxMinor: number;
  discountMinor: number;
  totalMinor: number;
  currency: string;
  placedAt: string;
  items: { id: string; productName: string; quantity: number; unitPriceMinor: number; totalMinor: number; notes: string | null }[];
};

const statusLabels: Record<QueueOrder["status"], string> = {
  PENDING: "New", ACCEPTED: "Accepted", PREPARING: "Preparing", READY: "Ready", SERVED: "Served",
};
const nextStatus: Partial<Record<QueueOrder["status"], { value: string; label: string }>> = {
  PENDING: { value: "ACCEPTED", label: "Accept order" },
  ACCEPTED: { value: "PREPARING", label: "Start preparing" },
  PREPARING: { value: "READY", label: "Mark ready" },
  READY: { value: "SERVED", label: "Mark served" },
  SERVED: { value: "COMPLETED", label: "Complete order" },
};

function money(minor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(minor / 100);
}

export function OrdersQueueContent() {
  const { businessId, locationId, location, isLoading: workspaceLoading, isError: workspaceError } = useDashboardBusinessLocation();
  const [orders, setOrders] = useState<QueueOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadOrders = useCallback(async (quiet = false) => {
    if (!businessId || !locationId) return;
    if (quiet) setRefreshing(true);
    else setLoading(true);
    try {
      const query = new URLSearchParams({ businessId, locationId });
      const response = await fetch(`/api/orders?${query}`, { cache: "no-store" });
      const body = await response.json().catch(() => null) as { success?: boolean; data?: QueueOrder[]; error?: { message?: string } } | null;
      if (!response.ok || !body?.success || !body.data) throw new Error(body?.error?.message ?? "Unable to load orders.");
      setOrders(body.data);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [businessId, locationId]);

  useEffect(() => {
    if (workspaceLoading || !businessId || !locationId) return;
    const timer = window.setTimeout(() => void loadOrders(), 0);
    return () => window.clearTimeout(timer);
  }, [businessId, loadOrders, locationId, workspaceLoading]);

  useEffect(() => {
    if (!businessId || !locationId) return;
    const timer = window.setInterval(() => void loadOrders(true), 15_000);
    return () => window.clearInterval(timer);
  }, [businessId, loadOrders, locationId]);

  async function updateStatus(order: QueueOrder, status: string) {
    if (!businessId || !locationId) return;
    setUpdatingId(order.id);
    setError("");
    try {
      const query = new URLSearchParams({ businessId, locationId });
      const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}?${query}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await response.json().catch(() => null) as { success?: boolean; error?: { message?: string } } | null;
      if (!response.ok || !body?.success) throw new Error(body?.error?.message ?? "Unable to update this order.");
      await loadOrders(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update this order.");
    } finally {
      setUpdatingId("");
    }
  }

  async function advanceOrder(order: QueueOrder) {
    const next = nextStatus[order.status];
    if (next) await updateStatus(order, next.value);
  }

  return <div className="min-w-0 flex-1 bg-slate-50 px-5 py-7 sm:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Order operations</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Live order queue</h1><p className="mt-2 text-sm text-slate-600">Review incoming table orders and move them through service.</p></div>
        {location ? <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">Outlet <strong className="ml-1 text-slate-900">{location.name}</strong></span> : null}
      </header>

      {workspaceError ? <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Unable to load your business workspace.</p> : null}
      {error ? <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      <div className="mt-7 flex items-center justify-between"><p className="text-sm text-slate-600">{orders.length} active {orders.length === 1 ? "order" : "orders"}</p><button type="button" disabled={refreshing || loading} onClick={() => void loadOrders(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh</button></div>

      {loading || workspaceLoading ? <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading orders…</div> : orders.length ? <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {orders.map((order) => <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{order.orderNumber}</p><h2 className="mt-1 text-xl font-bold text-slate-950">{order.table?.name ?? "Table order"}</h2><p className="mt-1 text-sm text-slate-500">{new Date(order.placedAt).toLocaleString()} · {order.customerName || "Guest"}{order.customerPhone ? ` · ${order.customerPhone}` : ""}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${order.status === "PENDING" ? "bg-orange-50 text-orange-800" : order.status === "READY" ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>{statusLabels[order.status]}</span></div>
          <ul className="mt-5 space-y-2 border-y border-slate-100 py-4">{order.items.map((item) => <li key={item.id} className="flex justify-between gap-3 text-sm"><span className="min-w-0"><strong>{item.quantity}×</strong> {item.productName}{item.notes ? <small className="block pl-6 text-slate-500">{item.notes}</small> : null}</span><span className="shrink-0 font-medium">{money(item.totalMinor, order.currency)}</span></li>)}</ul>
          {order.notes ? <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Note: {order.notes}</p> : null}
          <div className="mt-4 flex items-center justify-between gap-3"><span className="font-bold text-slate-900">Total {money(order.totalMinor, order.currency)}</span><div className="flex gap-2">{order.status !== "SERVED" ? <button type="button" disabled={updatingId === order.id} onClick={() => { if (window.confirm(`Cancel order ${order.orderNumber}?`)) void updateStatus(order, "CANCELED"); }} className="rounded-lg border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">Cancel</button> : null}{nextStatus[order.status] ? <button type="button" disabled={updatingId === order.id} onClick={() => void advanceOrder(order)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60">{updatingId === order.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{updatingId === order.id ? "Updating…" : nextStatus[order.status]?.label}</button> : null}</div></div>
        </article>)}
      </div> : !error ? <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500"><Check className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-bold text-slate-900">No active orders</h2><p className="mt-1 text-sm text-slate-500">New customer orders from your table links will appear here.</p></section> : null}
    </div>
  </div>;
}
