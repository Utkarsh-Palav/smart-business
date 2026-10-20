"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

type PublicProduct = {
  id: string;
  displayName: string | null;
  displayDescription: string | null;
  priceOverrideMinor: number | null;
  product: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    basePriceMinor: number;
    currency: string;
    categoryId: string;
    availability: { isAvailable: boolean; priceOverrideMinor: number | null }[];
  };
};

type OrderReceipt = {
  productName: string;
  quantity: number;
  unitPriceMinor: number;
  totalMinor: number;
  notes: string | null;
};

type CreatedOrder = {
  orderNumber: string;
  status: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency: string;
  placedAt: string;
  table: { name: string } | null;
  location: { name: string };
  items: OrderReceipt[];
};

type SavedOrderAccess = { orderNumber: string; accessKey: string };

type PublicTableMenu = {
  businessName: string;
  tableName: string;
  locationName: string;
  menu: {
    name: string;
    categories: { category: { id: string; name: string; description: string | null }; sortOrder: number }[];
    products: PublicProduct[];
  } | null;
};

type CartLine = { productId: string; quantity: number };

function formatPrice(minor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(minor / 100);
}

function itemPrice(item: PublicProduct) {
  return item.priceOverrideMinor ?? item.product.availability[0]?.priceOverrideMinor ?? item.product.basePriceMinor;
}

function initials(value: string) {
  return value.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "R";
}

function orderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Awaiting confirmation",
    ACCEPTED: "Order accepted",
    PREPARING: "Being prepared",
    READY: "Ready to serve",
    SERVED: "Served",
    COMPLETED: "Completed",
    CANCELED: "Canceled",
  };
  return labels[status] ?? "Status updated";
}

export function PublicTableMenuClient({ data, token }: { data: PublicTableMenu; token: string }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderLookupMessage, setOrderLookupMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [showingOrder, setShowingOrder] = useState(false);
  const [orderAccessKey, setOrderAccessKey] = useState<string | null>(null);
  const [isRestoringOrder, setIsRestoringOrder] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const attemptRef = useRef<{ fingerprint: string; key: string } | null>(null);

  const productById = useMemo(
    () => new Map((data.menu?.products ?? []).map((item) => [item.product.id, item])),
    [data.menu?.products],
  );
  const cartItems = cart.flatMap((line) => {
    const item = productById.get(line.productId);
    return item ? [{ item, quantity: line.quantity }] : [];
  });
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const currency = cartItems[0]?.item.product.currency ?? "INR";
  const totalMinor = cartItems.reduce((sum, line) => sum + itemPrice(line.item) * line.quantity, 0);
  const restaurantInitials = initials(data.businessName);
  const savedOrderKey = `smart-business:table-order:${token}`;
  const currentOrderNumber = createdOrder?.orderNumber;
  const currentOrderStatus = createdOrder?.status;

  const restoreOrder = useCallback(async (showUnavailableMessage = false) => {
    try {
      let access: SavedOrderAccess | null = null;
      try {
        const saved = localStorage.getItem(savedOrderKey);
        if (saved) access = JSON.parse(saved) as SavedOrderAccess;
      } catch {
        access = null;
      }

      const response = access?.orderNumber && access.accessKey
        ? await fetch(
          `/api/public/tables/${encodeURIComponent(token)}/orders/${encodeURIComponent(access.orderNumber)}`,
          { headers: { "x-order-access-key": access.accessKey }, cache: "no-store" },
        )
        : await fetch(`/api/public/tables/${encodeURIComponent(token)}/orders/current`, { cache: "no-store" });
      const body = await response.json().catch(() => null) as { success?: boolean; data?: CreatedOrder } | null;
      if (response.ok && body?.success && body.data) {
        setCreatedOrder(body.data);
        setOrderAccessKey(access?.accessKey ?? null);
        setShowingOrder(true);
      } else if (response.status === 404 && showUnavailableMessage) {
        setOrderLookupMessage("No saved order was found on this device. Orders placed here in the future will be available from this button.");
      }
    } catch {
      if (showUnavailableMessage) setOrderLookupMessage("We couldn't load your order just now. Please try again.");
    } finally {
      setIsRestoringOrder(false);
    }
  }, [savedOrderKey, token]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => void restoreOrder(), 0);
    return () => window.clearTimeout(restoreTimer);
  }, [restoreOrder]);

  useEffect(() => {
    if (!currentOrderNumber || !currentOrderStatus || !orderAccessKey || ["SERVED", "COMPLETED", "CANCELED"].includes(currentOrderStatus)) return;
    let active = true;
    const refreshStatus = async () => {
      try {
        const response = orderAccessKey
          ? await fetch(
            `/api/public/tables/${encodeURIComponent(token)}/orders/${encodeURIComponent(currentOrderNumber)}`,
            { headers: { "x-order-access-key": orderAccessKey }, cache: "no-store" },
          )
          : await fetch(`/api/public/tables/${encodeURIComponent(token)}/orders/current`, { cache: "no-store" });
        const body = await response.json().catch(() => null) as { success?: boolean; data?: CreatedOrder } | null;
        if (active && response.ok && body?.success && body.data) setCreatedOrder(body.data);
      } catch {
        // Preserve the last known status during brief network interruptions.
      }
    };
    const interval = window.setInterval(() => void refreshStatus(), 20_000);
    return () => { active = false; window.clearInterval(interval); };
  }, [currentOrderNumber, currentOrderStatus, orderAccessKey, token]);

  useEffect(() => {
    if (!detailsOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setDetailsOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [detailsOpen]);

  function changeQuantity(productId: string, delta: number) {
    setError("");
    attemptRef.current = null;
    setCart((current) => {
      const line = current.find((item) => item.productId === productId);
      if (!line && delta > 0) return [...current, { productId, quantity: 1 }];
      return current
        .map((item) => item.productId === productId
          ? { ...item, quantity: Math.min(99, item.quantity + delta) }
          : item)
        .filter((item) => item.quantity > 0);
    });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    const payload = {
      items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    const fingerprint = JSON.stringify(payload);
    if (!attemptRef.current || attemptRef.current.fingerprint !== fingerprint) {
      attemptRef.current = { fingerprint, key: crypto.randomUUID() };
    }
    const accessKey = attemptRef.current.key;
    try {
      const response = await fetch(`/api/public/tables/${encodeURIComponent(token)}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, idempotencyKey: attemptRef.current.key }),
      });
      const body = await response.json().catch(() => null) as {
        success?: boolean;
        data?: CreatedOrder;
        error?: { message?: string };
      } | null;
      if (!response.ok || !body?.success || !body.data) {
        throw new Error(body?.error?.message ?? "We could not place your order. Please try again.");
      }
      setOrderAccessKey(accessKey);
      setCreatedOrder(body.data);
      setShowingOrder(true);
      setCart([]);
      setCartOpen(false);
      setCustomerName("");
      setCustomerPhone("");
      setNotes("");
      attemptRef.current = null;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const productsByCategory = new Map<string, PublicProduct[]>();
  for (const item of data.menu?.products ?? []) {
    const items = productsByCategory.get(item.product.categoryId) ?? [];
    items.push(item);
    productsByCategory.set(item.product.categoryId, items);
  }

  if (isRestoringOrder) {
    return <main className="table-menu-shell min-h-screen px-4 py-8 text-stone-900 sm:px-6"><div className="mx-auto max-w-lg"><BrandHeader businessName={data.businessName} locationName={data.locationName} initials={restaurantInitials} /><section role="status" className="mt-6 rounded-3xl border border-white bg-white p-7 text-center shadow-sm"><div className="mx-auto h-8 w-8 animate-spin motion-reduce:animate-none rounded-full border-2 border-stone-200 border-t-emerald-700" /><p className="mt-4 text-sm font-medium text-stone-700">Checking for your latest order...</p></section></div></main>;
  }

  if (createdOrder && showingOrder) {
    return (
      <main className="table-menu-shell min-h-screen px-4 py-8 text-stone-900 sm:px-6">
        <div className="mx-auto max-w-lg">
          <BrandHeader businessName={data.businessName} locationName={data.locationName} initials={restaurantInitials} />
          <section className="order-confirmation-enter relative mt-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white p-6 text-center shadow-[0_24px_70px_-35px_rgba(28,35,29,0.35)] sm:p-9">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-300 via-emerald-500 to-lime-300" />
            <div className="confirmation-check mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/70">
              <Check className="h-9 w-9" strokeWidth={2.5} />
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.19em] text-emerald-700">Order received</p>
            <h1 className="mt-2 text-[2rem] font-bold tracking-tight text-[#1d2721] sm:text-4xl">You’re all set.</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">
              Your order has been sent to <strong className="font-semibold text-stone-800">{data.businessName}</strong>. The team has everything noted and will confirm it shortly.
            </p>

            <div className="mt-7 rounded-2xl bg-[#f7f8f5] px-4 py-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone-500">Your reference</p>
                  <p className="mt-1 font-mono text-lg font-bold tracking-wide text-stone-900">{createdOrder.orderNumber}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-900">
                    <Clock3 className="h-3.5 w-3.5" /> {orderStatusLabel(createdOrder.status)}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-stone-200/80 pt-3">
                <div><p className="text-xs text-stone-500">{createdOrder.items.reduce((sum, item) => sum + item.quantity, 0)} items · {createdOrder.table?.name ?? data.tableName}</p><p className="mt-1 text-xs text-stone-500">{new Date(createdOrder.placedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div>
                <div className="text-right"><p className="text-xs text-stone-500">Order total</p><p className="mt-0.5 text-xl font-bold text-stone-900">{formatPrice(createdOrder.totalMinor, createdOrder.currency)}</p></div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#202b24] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2b3b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                <ShoppingBag className="h-4 w-4" /> View order details
              </button>
              <div>
                <button type="button" disabled aria-describedby="payment-coming-soon" className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-500">
                  <CreditCard className="h-4 w-4" /> Pay now <span aria-hidden="true" className="rounded-full bg-white px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-stone-500">Soon</span>
                </button>
                <p id="payment-coming-soon" className="mt-1.5 text-center text-[0.7rem] text-stone-500">Online payment will be available soon.</p>
              </div>
            </div>
            <p className="mt-5 inline-flex items-center justify-center gap-1.5 text-xs text-stone-500"><ShieldCheck className="h-4 w-4 text-emerald-700" /> Saved securely with the restaurant. Keep your reference handy.</p>
          </section>
          <button type="button" onClick={() => setShowingOrder(false)} className="mx-auto mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#202b24] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2b3b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" /> Place another order</button>
          {detailsOpen ? <OrderDetailsDialog order={createdOrder} onClose={() => setDetailsOpen(false)} onPlaceAnotherOrder={() => { setDetailsOpen(false); setShowingOrder(false); }} /> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="table-menu-shell min-h-screen px-4 pb-32 pt-5 text-stone-900 sm:px-6 sm:pb-12 sm:pt-8">
      <div className="mx-auto max-w-5xl">
        <BrandHeader businessName={data.businessName} locationName={data.locationName} initials={restaurantInitials} onViewOrder={() => {
          if (createdOrder) setShowingOrder(true);
          else {
            setIsRestoringOrder(true);
            setOrderLookupMessage("");
            void restoreOrder(true);
          }
        }} />

        {orderLookupMessage ? <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{orderLookupMessage}</p> : null}
        {!data.menu ? <section className="mt-6 rounded-3xl border border-white bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-bold">This menu is being prepared</h1><p className="mt-2 text-sm text-stone-500">Please check back soon or ask a staff member.</p></section> : <>

        <section className="menu-hero-enter relative mt-5 overflow-hidden rounded-[2rem] bg-[#202b24] px-6 py-7 text-white shadow-[0_22px_60px_-35px_rgba(23,34,27,0.7)] sm:px-9 sm:py-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-12 h-40 w-40 rounded-full border border-white/10" />
          <div className="relative flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-emerald-100"><Sparkles className="h-3.5 w-3.5" /> Made for this table</div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{data.menu.name}</h1>
              <p className="mt-2 text-sm text-white/70">Explore the menu and order at your own pace.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-sm">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.17em] text-white/55">You’re dining at</p>
              <p className="mt-1 font-semibold">{data.tableName}</p>
            </div>
          </div>
          <div className="relative mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/65"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Prices and availability are confirmed when you place your order.</div>
        </section>

        <nav aria-label="Menu categories" className="menu-nav-scroll sticky top-0 z-10 -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 py-2 sm:static sm:mx-0 sm:px-0">
          {data.menu.categories.map(({ category }, index) => <a key={category.id} href={`#category-${category.id}`} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur transition hover:-translate-y-0.5 ${index === 0 ? "border-[#26352a] bg-[#26352a] text-white" : "border-white/80 bg-white/85 text-stone-700 hover:border-emerald-200 hover:text-emerald-800"}`}>{category.name}</a>)}
        </nav>

        {error ? <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p> : null}
        {data.menu.categories.length ? <div className="mt-3 space-y-5 sm:mt-5 sm:grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          {data.menu.categories.map(({ category }, sectionIndex) => {
            const products = productsByCategory.get(category.id) ?? [];
            if (!products.length) return null;
            return <section id={`category-${category.id}`} key={category.id} style={{ animationDelay: `${Math.min(sectionIndex * 55, 220)}ms` }} className="menu-category-enter scroll-mt-24 rounded-[1.6rem] border border-white/80 bg-white/90 p-5 shadow-[0_10px_30px_-24px_rgba(28,35,29,0.5)] backdrop-blur sm:p-6">
              <div className="mb-2 flex items-end justify-between border-b border-stone-100 pb-4"><div><p className="text-[0.62rem] font-bold uppercase tracking-[0.17em] text-emerald-800">Section {String(sectionIndex + 1).padStart(2, "0")}</p><h2 className="mt-1 text-xl font-bold tracking-tight">{category.name}</h2></div><span className="text-xs text-stone-400">{products.length} {products.length === 1 ? "item" : "items"}</span></div>
              {category.description ? <p className="mb-4 pt-1 text-sm text-stone-500">{category.description}</p> : null}
              <div className="divide-y divide-stone-100">
                {products.map((item) => {
                  const available = item.product.availability[0]?.isAvailable ?? true;
                  const quantity = cart.find((line) => line.productId === item.product.id)?.quantity ?? 0;
                  return <article key={item.id} className={`flex gap-3 py-4 first:pt-3 last:pb-1 ${available ? "" : "opacity-55"}`}>
                    {item.product.imageUrl ? <Image src={item.product.imageUrl} alt="" loading="lazy" unoptimized width={88} height={88} className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-2xl bg-stone-100 object-cover" /> : <div aria-hidden="true" className="grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#f6f2e9] to-[#e9efe7] text-lg font-bold text-emerald-900">{initials(item.displayName || item.product.name)}</div>}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold leading-5 text-stone-900">{item.displayName || item.product.name}</h3>{item.displayDescription || item.product.description ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{item.displayDescription || item.product.description}</p> : null}</div><span className="shrink-0 pt-0.5 text-sm font-bold text-stone-900">{formatPrice(itemPrice(item), item.product.currency)}</span></div>
                      <div className="mt-2.5 flex items-center justify-between">
                        {!available ? <p className="text-xs font-semibold text-rose-700">Currently unavailable</p> : <span />}
                        {available ? <div className="flex items-center gap-2">
                          {quantity > 0 ? <><button type="button" className="grid h-8 w-8 place-items-center rounded-full border border-stone-200 text-stone-700 transition hover:bg-stone-50" aria-label={`Remove one ${item.product.name}`} onClick={() => changeQuantity(item.product.id, -1)}><Minus className="h-3.5 w-3.5" /></button><span className="min-w-4 text-center text-sm font-semibold tabular-nums">{quantity}</span></> : null}
                          <button type="button" className="grid h-8 w-8 place-items-center rounded-full bg-[#d94a16] text-white shadow-sm transition hover:scale-105 hover:bg-[#c43e0f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700" aria-label={`Add ${item.product.name}`} onClick={() => changeQuantity(item.product.id, 1)}><Plus className="h-4 w-4" /></button>
                        </div> : null}
                      </div>
                    </div>
                  </article>;
                })}
              </div>
            </section>;
          })}
        </div> : <section className="mt-5 rounded-3xl border border-white bg-white p-8 text-center shadow-sm"><h2 className="font-semibold">This menu is being prepared</h2><p className="mt-2 text-sm text-stone-500">Please check back soon or ask a staff member.</p></section>}

        <footer className="py-8 text-center text-xs text-stone-500">A little something made with care by {data.businessName}.</footer>
      </>}
      </div>

      {cartCount > 0 ? <div className="cart-dock-enter fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#202b24] p-3 text-white shadow-[0_-12px_40px_-18px_rgba(20,30,23,0.6)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[min(28rem,calc(100vw-2.5rem))] sm:rounded-2xl sm:border sm:border-white/15 sm:p-4">
        {!cartOpen ? <button type="button" onClick={() => setCartOpen(true)} className="flex min-h-12 w-full items-center justify-between gap-4 rounded-xl bg-[#d94a16] px-4 py-3 font-semibold text-white transition hover:bg-[#c43e0f]"><span className="inline-flex items-center gap-2"><ShoppingBag className="h-5 w-5" /><span>Review order <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{cartCount}</span></span></span><span>{formatPrice(totalMinor, currency)} <ArrowRight className="ml-1 inline h-4 w-4" /></span></button> : <section>
          <div className="flex items-center justify-between"><div><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-emerald-200">Your selection</p><h2 className="mt-0.5 text-lg font-bold">Review your order</h2></div><button type="button" className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close cart" onClick={() => setCartOpen(false)}><X className="h-5 w-5" /></button></div>
          <div className="mt-3 max-h-36 space-y-2 overflow-auto pr-1">{cartItems.map(({ item, quantity }) => <div key={item.product.id} className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 flex-1 truncate text-white/85">{quantity} × {item.displayName || item.product.name}</span><span className="shrink-0 font-medium">{formatPrice(itemPrice(item) * quantity, item.product.currency)}</span></div>)}</div>
          <div className="mt-3 flex justify-between border-t border-white/15 pt-3 font-bold"><span>Total</span><span>{formatPrice(totalMinor, currency)}</span></div>
          {error ? <p role="alert" className="mt-3 rounded-lg bg-rose-950/70 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          <form onSubmit={submitOrder} className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2"><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} maxLength={120} placeholder="Name (optional)" className="min-w-0 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-emerald-300" /><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} maxLength={40} placeholder="Phone (optional)" className="min-w-0 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-emerald-300" /></div>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={500} placeholder="Anything we should know? (optional)" rows={2} className="w-full resize-none rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-emerald-300" />
            <button disabled={isSubmitting} type="submit" className="w-full rounded-xl bg-white px-4 py-3 font-bold text-[#202b24] transition hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70">{isSubmitting ? "Sending securely…" : "Send order to restaurant"}</button>
            <p className="text-center text-[0.68rem] text-white/55"><ShieldCheck className="mr-1 inline h-3.5 w-3.5" />You’ll see a confirmation as soon as it’s received.</p>
          </form>
        </section>}
      </div> : null}
    </main>
  );
}

function BrandHeader({ businessName, locationName, initials: brandInitials, onViewOrder }: { businessName: string; locationName: string; initials: string; onViewOrder?: () => void }) {
  return <header className="flex items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-[0_8px_30px_-25px_rgba(20,30,23,0.6)] backdrop-blur sm:px-5">
    <div className="flex min-w-0 items-center gap-3">
      <div aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#202b24] text-sm font-bold tracking-wide text-emerald-100 shadow-inner">{brandInitials}</div>
      <div className="min-w-0"><p className="truncate text-sm font-bold text-stone-900 sm:text-base">{businessName}</p><p className="mt-0.5 truncate text-xs text-stone-500">{locationName}</p></div>
    </div>
    <div className="flex shrink-0 items-center gap-2"><div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-emerald-800">Dine in</div>{onViewOrder ? <button type="button" onClick={onViewOrder} className="rounded-full bg-[#202b24] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2b3b31]">My order</button> : null}</div>
  </header>;
}

function OrderDetailsDialog({ order, onClose, onPlaceAnotherOrder }: { order: CreatedOrder; onClose: () => void; onPlaceAnotherOrder: () => void }) {
  return <div className="order-dialog-enter fixed inset-0 z-50 flex items-end justify-center bg-[#111a14]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="order-details-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-[#fbfaf7] p-5 shadow-2xl sm:max-w-lg sm:rounded-[1.75rem] sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-emerald-800">Order receipt</p><h2 id="order-details-title" className="mt-1 text-2xl font-bold text-stone-900">Order details</h2></div><button type="button" aria-label="Close order details" onClick={onClose} className="rounded-full p-2 text-stone-500 transition hover:bg-stone-200/70"><X className="h-5 w-5" /></button></div>
      <div className="mt-5 rounded-2xl bg-[#202b24] p-4 text-white"><p className="text-xs text-white/60">Reference number</p><p className="mt-1 font-mono text-lg font-bold tracking-wide">{order.orderNumber}</p><p className="mt-2 text-xs text-white/65">{order.location.name} · {order.table?.name ?? "Table"} · {new Date(order.placedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div>
      <div className="mt-5 space-y-3">{order.items.map((item, index) => <div key={`${item.productName}-${index}`} className="flex justify-between gap-4 text-sm"><div className="min-w-0"><p className="font-semibold text-stone-800">{item.quantity} × {item.productName}</p>{item.notes ? <p className="mt-1 text-xs text-stone-500">{item.notes}</p> : null}<p className="mt-1 text-xs text-stone-500">{formatPrice(item.unitPriceMinor, order.currency)} each</p></div><span className="shrink-0 font-semibold text-stone-800">{formatPrice(item.totalMinor, order.currency)}</span></div>)}</div>
      <div className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm"><div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatPrice(order.subtotalMinor, order.currency)}</span></div>{order.discountMinor > 0 ? <div className="flex justify-between text-stone-600"><span>Discount</span><span>-{formatPrice(order.discountMinor, order.currency)}</span></div> : null}{order.taxMinor > 0 ? <div className="flex justify-between text-stone-600"><span>Tax</span><span>{formatPrice(order.taxMinor, order.currency)}</span></div> : null}<div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-stone-900"><span>Amount due</span><span>{formatPrice(order.totalMinor, order.currency)}</span></div></div>
      <div className="mt-5 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950"><Clock3 className="mt-0.5 h-4 w-4 shrink-0" /><p>Current status: <strong>{orderStatusLabel(order.status)}</strong>. Status refreshes automatically while this page is open. Payment is not included in this receipt.</p></div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2"><button type="button" onClick={onPlaceAnotherOrder} className="rounded-xl bg-[#202b24] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b3b31]">Place another order</button><button type="button" onClick={onClose} className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">Done</button></div>
    </section>
  </div>;
}
