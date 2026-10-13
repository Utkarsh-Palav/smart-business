import { Hamburger, HamIcon, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_STARS = [
  { x: 8, y: 18, delay: 0.2 },
  { x: 14, y: 34, delay: 2.8 },
  { x: 19, y: 12, delay: 1.4 },
  { x: 24, y: 47, delay: 4.1 },
  { x: 30, y: 25, delay: 0.8 },
  { x: 34, y: 14, delay: 3.5 },
  { x: 39, y: 38, delay: 1.9 },
  { x: 43, y: 20, delay: 5.2 },
  { x: 48, y: 30, delay: 2.1 },
  { x: 52, y: 13, delay: 4.7 },
  { x: 57, y: 42, delay: 0.5 },
  { x: 61, y: 23, delay: 3.1 },
  { x: 66, y: 35, delay: 1.1 },
  { x: 71, y: 15, delay: 4.4 },
  { x: 75, y: 44, delay: 2.5 },
  { x: 80, y: 26, delay: 5.5 },
  { x: 85, y: 11, delay: 1.7 },
  { x: 89, y: 37, delay: 3.8 },
  { x: 94, y: 20, delay: 0.9 },
  { x: 97, y: 48, delay: 4.9 },
  { x: 28, y: 59, delay: 2.3 },
  { x: 63, y: 55, delay: 5.1 },
];

const OPS_IMAGES = {
  pos: "/hero1.jpg",
  qr: "/hero2.jpg",
  kds: "/hero3.jpg",
};

export default function LandingPage() {
  return (
    <main className="w-full bg-white p-2 dark:bg-black sm:p-3">
      <section className="relative flex min-h-[91vh] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-neutral-800 bg-black sm:rounded-[36px] lg:min-h-[97vh]">
        {/* BACKGROUND LAYERS */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Subtle top warm glow */}
          <div className="absolute left-1/2 top-0 h-75 w-150 -translate-x-1/2 rounded-full bg-[#FF5B2E]/10 blur-[140px]" />

          {/* Eclipse horizon and its narrow atmospheric glow */}

          {/* Eclipse horizon: thin center, softly fading edges */}
          <svg
            viewBox="0 0 1600 800"
            preserveAspectRatio="xMidYMin meet"
            fill="none"
            className="absolute left-1/2 top-[10%] sm:top-[16%] h-200 w-[1600px] max-w-none -translate-x-1/2"
            aria-hidden="true"
          >
            <defs>
              {/* Soft, restrained atmospheric glow */}
              <filter
                id="eclipse-soft-glow"
                x="-10%"
                y="-20%"
                width="120%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="12" />
              </filter>

              {/* Fade the line at both ends */}
              <linearGradient
                id="eclipse-gold-gradient"
                x1="160"
                y1="0"
                x2="1440"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FA9A63" stopOpacity="0" />
                <stop offset="20%" stopColor="#FA9A63" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#F6B253" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#FA9A63" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FA9A63" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Glow behind the horizon */}
            <path
              d="M 160 800 A 640 280 0 0 1 1440 800"
              stroke="#FA9A63"
              strokeWidth="10"
              strokeOpacity="0.35"
              filter="url(#eclipse-soft-glow)"
            />

            {/* Fine, consistent horizon line */}
            <path
              d="M 160 800 A 640 280 0 0 1 1440 800"
              stroke="url(#eclipse-gold-gradient)"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>

          {/* Square grid */}
          <div className="hero-grid absolute inset-0" />

          {/* Fixed stars with staggered blinking */}
          <div className="absolute inset-0">
            {HERO_STARS.map((star, index) => (
              <span
                key={index}
                className="hero-star absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* FOREGROUND CONTENT */}
        <div className="relative z-30 w-full px-2.5 py-5 sm:px-6 lg:px-8">
          {/* NAVIGATION */}
          <nav className="relative z-30 flex w-full items-center justify-between px-2.5 sm:px-6 lg:px-8">
            <Link href="/" aria-label="Urban Kitchen home">
              <Image
                src="/logo/urban-kitchen-lockup-dark-transparent.svg"
                alt="Urban Kitchen Logo"
                width={200}
                height={50}
                priority
              />
            </Link>

            <div className="hidden items-center gap-8 text-sm font-medium text-neutral-300 md:flex">
              <a
                href="#features"
                className="transition-colors hover:text-white"
              >
                Features
              </a>
              <a
                href="#showcase"
                className="transition-colors hover:text-white"
              >
                Operations
              </a>
              <a
                href="#comparison"
                className="transition-colors hover:text-white"
              >
                Comparison
              </a>
              <a href="#pricing" className="transition-colors hover:text-white">
                Pricing
              </a>
              <a href="#faq" className="transition-colors hover:text-white">
                FAQ
              </a>
            </div>

            {/* SIGN-IN BUTTON */}
            <Link href="/register">
            <button
              type="button"
              className="group relative hidden sm:flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-black py-2 pl-11 pr-4 tracking-tight"
            >
              <div
                data-slot="button-box"
                className="absolute inset-y-0 left-1 z-40 my-auto flex size-8 flex-col items-center justify-center gap-px rounded-[8px] bg-[#FF5B2E]/30 transition-all duration-300 ease-out group-hover:left-[calc(100%-2.3rem)] group-hover:rotate-180"
              >
                <div className="flex flex-col gap-px group-hover:hidden">
                  {[
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 1, 0],
                    [1, 1, 1, 1, 1],
                    [0, 0, 0, 1, 0],
                    [0, 0, 1, 0, 0],
                  ].map((line, row) => (
                    <div className="flex gap-px" key={row}>
                      {line.map((active, col) => (
                        <span
                          key={col}
                          className={`inline-block size-0.75 shrink-0 rounded-full ${
                            active ? "bg-[#FF5B2E]" : "bg-[#FF5B2E]/25"
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <img
                  alt=""
                  loading="lazy"
                  width="32"
                  height="32"
                  className="hidden rotate-180 overflow-hidden rounded-[6px] object-cover blur-sm transition-all duration-300 group-hover:block group-hover:blur-none"
                  src="/Icon/apple-touch-icon.png"
                />
              </div>

              <div className="absolute -inset-px rounded-lg bg-white/20 transition-[clip-path] duration-300 [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0%_0_0)]" />

              <span className="inline-block text-white transition-transform duration-300 group-hover:-translate-x-8">
                Sign In
              </span>
            </button>
            </Link>

            <button className="flex items-center gap-2 rounded-lg border border-white/20 bg-black p-1.5 sm:hidden">
                <Menu className="h-4.5 w-4.5 text-white" />
            </button>
          </nav>

          {/* HERO SECTION */}
          <section className="relative z-30 mt-16 sm:mt-32 w-full px-2.5 pt-16 sm:pt-32 sm:px-6 lg:px-20 gap-6 lg:gap-8">
            {/* Announcement badge */}
            <div className="flex w-fit items-center justify-center gap-3 rounded-full border border-white/5 bg-[#171717] px-2.5 py-1 text-xs text-white sm:p-1 sm:pr-4">
              <div className="hidden w-fit items-center gap-2.5 rounded-full bg-black px-3 py-1 text-xs text-white sm:flex">
                <p>Urban Kitchen</p>
              </div>
              <p>The all-in-one restaurant operating system</p>
            </div>

            {/* Heading and description */}
            <div className="mt-6 flex flex-col items-start gap-6 md:mt-10 lg:flex-row lg:gap-10">
              <h1 className="text-balance text-3xl font-semibold -tracking-xl text-white sm:text-4xl md:text-5xl lg:text-7xl">
                The best restaurant operating system in the world.
              </h1>

              <div className="lg:max-w-md">
                <h2 className="text-balance text-sm font-medium text-neutral-300 sm:text-base lg:text-lg">
                  Consolidate Swiggy, Zomato, QR table ordering, Cloud POS, live
                  KDS, recipe inventory, and WhatsApp CRM into one platform. No
                  Chaos. No Tablet Juggling. Just Results.
                </h2>

                {/* CHAT CTA */}
                <button
                  type="button"
                  className="group relative mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-black py-2 pl-11 pr-4 tracking-tight md:mt-8"
                >
                  <div
                    data-slot="button-box"
                    className="absolute inset-y-0 left-1 z-40 my-auto flex size-8 flex-col items-center justify-center gap-px rounded-[8px] bg-[#FF5B2E]/30 transition-all duration-300 ease-out group-hover:left-[calc(100%-2.3rem)] group-hover:rotate-180"
                  >
                    <div className="flex flex-col gap-px group-hover:hidden">
                      {[
                        [0, 0, 1, 0, 0],
                        [0, 0, 0, 1, 0],
                        [1, 1, 1, 1, 1],
                        [0, 0, 0, 1, 0],
                        [0, 0, 1, 0, 0],
                      ].map((line, row) => (
                        <div className="flex gap-px" key={row}>
                          {line.map((active, col) => (
                            <span
                              key={col}
                              className={`inline-block size-0.75 shrink-0 rounded-full ${
                                active ? "bg-[#FF5B2E]" : "bg-[#FF5B2E]/25"
                              }`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    <img
                      alt=""
                      loading="lazy"
                      width="32"
                      height="32"
                      className="hidden rotate-180 overflow-hidden rounded-[6px] object-cover blur-sm transition-all duration-300 group-hover:block group-hover:blur-none"
                      src="/ProfileImage.png"
                    />
                  </div>

                  <div className="absolute -inset-px rounded-lg bg-white/20 transition-[clip-path] duration-300 [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0%_0_0)]" />

                  <span className="inline-block text-white transition-transform duration-300 group-hover:-translate-x-8">
                    Chat with Utkarsh
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
      {/* Features */}
      <section
        id="features"
        className="w-full px-2.5 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto w-full max-w-310">
          {/* Heading */}
          <h2 className="max-w-250 text-balance text-4xl font-semibold -tracking-xl text-neutral-950 sm:text-5xl lg:text-7xl dark:text-white">
            Replace your Fragmented Restaurant Stack
          </h2>
          <p className="mt-5 max-w-xl text-base text-neutral-600 sm:text-lg lg:text-xl dark:text-neutral-400">
            Everything your kitchen, dining room, and back-office needs —
            unified into a single real-time operating model.
          </p>

          {/* Bento grid */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:mt-14 lg:grid-cols-12">
            {/* 01. Omnichannel Hub (full-width banner) */}
            <article className="flex flex-col gap-10 rounded-[28px] border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl shadow-black/10 sm:p-10 lg:col-span-12 lg:flex-row lg:rounded-[32px]">
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  <span className="font-mono text-[13px] font-semibold tracking-widest text-[#FF5B2E]">
                    01. OMNICHANNEL HUB
                  </span>
                </div>
                <h3 className="mt-6 text-3xl font-semibold -tracking-xl sm:text-4xl lg:text-5xl">
                  One Screen for All Orders
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
                  Swiggy, Zomato, QR Table Orders, Counter POS, and Direct
                  WhatsApp takeaway flow into a single live stream.
                </p>
                <div className="min-h-8 flex-1" />
                <a
                  href="#book"
                  className="mt-8 inline-flex h-13 w-fit items-center gap-2.5 rounded-[14px] bg-[#FF5B2E] px-7 text-[15px] font-semibold text-white transition-[filter] hover:brightness-110 lg:mt-0"
                >
                  Book Live POS Walkthrough
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
                {/* Live order ticket */}
                <div className="rounded-[20px] border border-white/10 bg-neutral-900 p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <span className="font-mono text-sm font-semibold text-orange-400">
                      #104 SWIGGY
                    </span>
                    <span className="font-mono text-[13px] text-neutral-500">
                      1m ago
                    </span>
                  </div>
                  <p className="pt-3.5 text-[15px] text-neutral-200">
                    2x Truffle Burger, 1x Fries
                  </p>
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[13px] font-semibold text-emerald-400">
                      ₹740 · Auto-Routed KDS
                    </span>
                    <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs">
                      Printed KOT
                    </span>
                  </div>
                </div>

                {/* Channel chips */}
                <div className="flex flex-wrap gap-3">
                  {[
                    "Swiggy",
                    "Zomato",
                    "QR Tables",
                    "Counter POS",
                    "WhatsApp",
                  ].map((channel) => (
                    <span
                      key={channel}
                      className="rounded-full border border-white/15 px-3.5 py-2 font-mono text-xs text-neutral-300"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* 02. Speed & Sync (wide) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">02. SPEED &amp; SYNC</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Real-time
                </span>
              </div>
              <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0 flex-1 basis-70">
                  <h3 className="text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                    Instant KDS Dispatch
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Station routing across Grill, Barista, Fryer with prep
                    countdown timers and audio ticket chimes.
                  </p>
                </div>
                <div className="text-6xl font-semibold leading-none -tracking-xl text-emerald-700 dark:text-emerald-400">
                  0.05s
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 font-mono text-[13px] text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
                Active Prep Station:{" "}
                <span className="font-semibold text-orange-700 dark:text-orange-400">
                  Grill (03:45)
                </span>
              </div>
            </article>

            {/* 03. Data Isolation (narrow) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">03. DATA ISOLATION</span>
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  Isolated
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                Database-per-Business
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                Physical database partition for every registered brand. Zero
                shared multi-tenant table risk.
              </p>
              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 font-mono text-[13px] text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
                  <span>Secret Vault:</span>
                  <span className="font-semibold text-violet-700 dark:text-violet-400">
                    AES-256 Encrypted
                  </span>
                </div>
              </div>
            </article>

            {/* 04. Global Kill-Switch (narrow) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">04. GLOBAL KILL-SWITCH</span>
                <span className="font-semibold text-red-700 dark:text-red-400">
                  Item 86
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                Universal Out-of-Stock
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                One toggle marks sold-out dishes unavailable on Swiggy, Zomato,
                QR menus, and POS simultaneously.
              </p>
              <div className="mt-auto flex items-baseline justify-between pt-6 font-mono text-[13px]">
                <span className="text-neutral-500">Sync Latency:</span>
                <span className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                  Sub-Second
                </span>
              </div>
            </article>

            {/* 05. Inventory Engine (wide) */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between font-mono text-xs tracking-widest">
                <span className="text-neutral-500">05. INVENTORY ENGINE</span>
                <span className="font-semibold text-violet-700 dark:text-violet-400">
                  Sub-Gram
                </span>
              </div>
              <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0 flex-1 basis-70">
                  <h3 className="text-2xl font-semibold -tracking-xl text-neutral-950 dark:text-white">
                    Recipe-Level Stock Ledger
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Every burger sold auto-deducts 150g patty, 1 bun, and 20g
                    sauce to eliminate unexplained kitchen shrinkage.
                  </p>
                </div>
                <div className="text-6xl font-semibold leading-none -tracking-xl text-violet-700 dark:text-violet-400">
                  100%
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3.5 font-mono text-[13px] text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
                <span>Stock Movements:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  100% Immutable
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        id="showcase"
        className="relative mt-2 w-full overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 sm:mt-3 sm:rounded-[36px] dark:border-neutral-800 dark:bg-neutral-950"
      >
        {/* Ghost word */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-6 select-none whitespace-nowrap text-[25vw] font-bold leading-none tracking-tighter text-neutral-950/4.5 sm:left-6 sm:top-9 lg:text-[220px] dark:text-white/5"
        >
          OPERATIONS
        </span>

        <div className="relative z-10 mx-auto w-full max-w-310 px-4 py-16 sm:px-8 sm:py-24">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
            <div className="min-w-0 flex-1 basis-130">
              <p className="font-mono text-[13px] font-semibold tracking-widest text-[#E2461F]">
                PHYSICAL-TO-DIGITAL INTERFACE
              </p>
              <h2 className="mt-4 max-w-205 text-balance text-4xl font-semibold -tracking-xl text-neutral-950 sm:text-5xl lg:text-[68px] lg:leading-[1.04] dark:text-white">
                Designed for High-Velocity Service
              </h2>
            </div>
            <p className="max-w-95 flex-[0_1_380px] text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
              From handcrafted table QR stands to rugged kitchen displays —
              inspect every operational touchpoint.
            </p>
          </div>

          {/* Bento grid */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:mt-14 lg:grid-cols-12">
            {/* Cloud POS (large photo card) */}
            <article className="relative flex min-h-115 flex-col justify-between overflow-hidden rounded-[28px] bg-neutral-950 sm:rounded-[32px] lg:col-span-7 lg:min-h-140">
              <Image
                src={OPS_IMAGES.pos}
                alt="Tablet POS and menu on a phone in a restaurant"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="relative z-10 p-6">
                <span className="inline-block rounded-lg bg-black/75 px-3 py-1.5 font-mono text-xs font-semibold text-white">
                  Tablet POS &amp; Menu
                </span>
              </div>
              <div className="relative z-10 bg-linear-to-t from-black/90 via-black/55 to-transparent px-6 pb-8 pt-24 text-white sm:px-8">
                <h3 className="text-2xl font-semibold -tracking-xl sm:text-[32px] sm:leading-[1.15]">
                  Cloud POS &amp; Waiter Ordering
                </h3>
                <p className="mt-3 max-w-115 text-base leading-relaxed text-white/75">
                  Take table orders on iPad or Android tablets with live menu
                  synchronization and allergen filters.
                </p>
              </div>
            </article>

            {/* QR + KDS (stacked horizontal cards) */}
            <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-5">
              {[
                {
                  src: OPS_IMAGES.qr,
                  alt: "Chef using a tablet with a QR menu",
                  chip: "Smart QR Menu",
                  chipClass: "text-[#FF7A4D]",
                  title: "Zero-Wait Mobile Dining",
                  desc: "Guests scan table QR codes to view high-res visual menus, customize items, and pay table-side.",
                },
                {
                  src: OPS_IMAGES.kds,
                  alt: "Hand using a kitchen display screen",
                  chip: "Kitchen KDS Display",
                  chipClass: "text-emerald-400",
                  title: "Live Kitchen Station Routing",
                  desc: "Multi-station ticket management with audio alerts and color-coded preparation countdown timers.",
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="flex flex-1 flex-col overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm sm:flex-row dark:border-neutral-800 dark:bg-black"
                >
                  <div className="relative min-h-50 flex-1 basis-47.5">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 1024px) 20vw, 100vw"
                      className="object-cover"
                    />
                    <span
                      className={`absolute left-3.5 top-3.5 rounded-lg bg-black/75 px-2.5 py-1.5 font-mono text-xs font-semibold ${card.chipClass}`}
                    >
                      {card.chip}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 basis-60 flex-col justify-center p-7">
                    <h3 className="text-[22px] font-semibold leading-tight -tracking-xl text-neutral-950 dark:text-white">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {card.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Feature cards */}
            {/* NFC Tap Card */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-white p-7 sm:col-span-1 lg:col-span-4 dark:border-neutral-800 dark:bg-black">
              <div className="flex size-12 items-center justify-center rounded-[14px] bg-[#FFF1EC] text-[#E2461F] dark:bg-[#E2461F]/15">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5a10 10 0 0 1 14 0" />
                  <path d="M8.5 16a5 5 0 0 1 7 0" />
                  <circle cx="12" cy="19.5" r="0.8" fill="currentColor" />
                  <path d="M2 9a14 14 0 0 1 20 0" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold leading-tight -tracking-xl text-neutral-950 dark:text-white">
                Google Review NFC Tap Card
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                1-Tap phone scan takes guests straight to your 5★ Google Review
                page via dynamic cloud token{" "}
                <code className="rounded-md bg-neutral-100 px-1.5 py-px font-mono text-[13px] text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                  /r/[token]
                </code>
                .
              </p>
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-2.5 border-t border-neutral-100 pt-3.5 font-mono text-xs text-neutral-500 dark:border-neutral-800">
                  <span className="size-1.5 rounded-full bg-[#E2461F]" />
                  Certified NTAG213 Encrypted PVC
                </div>
              </div>
            </article>

            {/* QR Table Stand */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-white p-7 lg:col-span-4 dark:border-neutral-800 dark:bg-black">
              <div className="flex size-12 items-center justify-center rounded-[14px] bg-[#FFF6E5] text-amber-600 dark:bg-amber-500/15">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M20 20h.01M17 20v-3" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold leading-tight -tracking-xl text-neutral-950 dark:text-white">
                Weatherproof QR Table Stand
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                Laser-engraved teakwood and crystal acrylic stands that route
                table tokens (
                <code className="rounded-md bg-neutral-100 px-1.5 py-px font-mono text-[13px] text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                  /t/[token]
                </code>
                ) with zero mixups.
              </p>
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-2.5 border-t border-neutral-100 pt-3.5 font-mono text-xs text-neutral-500 dark:border-neutral-800">
                  <span className="size-1.5 rounded-full bg-amber-600" />
                  Anti-Glare Optical Lens
                </div>
              </div>
            </article>

            {/* Database-per-Business */}
            <article className="flex flex-col rounded-[28px] border border-neutral-200 bg-white p-7 lg:col-span-4 dark:border-neutral-800 dark:bg-black">
              <div className="flex size-12 items-center justify-center rounded-[14px] bg-[#EAF2FF] text-blue-600 dark:bg-blue-500/15">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <ellipse cx="12" cy="5" rx="8" ry="3" />
                  <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
                  <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold leading-tight -tracking-xl text-neutral-950 dark:text-white">
                Database-per-Business Isolation
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                Every business receives a dedicated database instance with
                encrypted secret vault protection.
              </p>
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-2.5 border-t border-neutral-100 pt-3.5 font-mono text-xs text-neutral-500 dark:border-neutral-800">
                  <span className="size-1.5 rounded-full bg-blue-600" />
                  Zero Multi-Tenant Data Leakage
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
