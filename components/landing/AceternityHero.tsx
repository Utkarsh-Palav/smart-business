"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

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

export default function AceternityHero() {
  return (
    <div className="px-3">
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
            <Link href="/login" aria-label="Sign in to Urban Kitchen">
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
    </div>
  );
}
