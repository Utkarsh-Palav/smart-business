"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FooterCtaProps {
  onOpenDemo?: () => void;
}

export default function FooterCta({ onOpenDemo }: FooterCtaProps) {
  return (
    <div className="w-full p-2 sm:p-4 md:p-6 bg-white dark:bg-black">
      {/* Big Dark Framed Container matching Aceternity Reference */}
      <div className="relative w-full rounded-[28px] sm:rounded-[36px] bg-black border border-neutral-800 p-8 sm:p-14 lg:p-20 overflow-hidden flex flex-col justify-between">
        
        {/* Top CTA Area */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.15]">
              Make Your Restaurant a High-Performance Engine.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-400">
              Start your 14-day free access today. Setup in 15 minutes with white-glove menu digitization.
            </p>
          </div>

          {/* White Pill Action Button on Right matching reference */}
          <div className="shrink-0">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black font-semibold text-xs sm:text-sm px-6 py-3.5 hover:bg-neutral-200 transition-colors shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Aceternity Giant Watermark Branding in Background */}
        <div className="relative w-full h-20 sm:h-36 lg:h-48 overflow-hidden pointer-events-none select-none flex items-center justify-center my-6">
          <p className="absolute -bottom-4 sm:-bottom-8 lg:-bottom-12 text-center text-[54px] sm:text-[110px] lg:text-[180px] font-extrabold uppercase tracking-tight text-white/[0.04] whitespace-nowrap">
            URBAN KITCHEN
          </p>
        </div>

        {/* Bottom Multi-Column Footer Links matching Aceternity Reference */}
        <div className="relative z-10 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-neutral-400">
          {/* Col 1: Logo & Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <div className="relative h-8 w-40">
                <Image
                  src="/logo/urban-kitchen-lockup-dark.svg"
                  alt="Urban Kitchen"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
              Unified operating system connecting physical review cards, QR smart tables, omnichannel POS, live KDS, recipe inventory, and WhatsApp CRM.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Control Plane & Neon Postgres Active</span>
            </div>
          </div>

          {/* Col 2: Modules */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Modules</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li><a href="#features" className="hover:text-white transition-colors">Omnichannel POS</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">Smart QR Menu</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Kitchen Display (KDS)</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Recipe Stock Ledger</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">WhatsApp AI CRM</a></li>
            </ul>
          </div>

          {/* Col 3: Hardware */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Hardware</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li><a href="#showcase" className="hover:text-white transition-colors">Google Review NFC Cards</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">QR Table Stands</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">KDS Terminals</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">Thermal Print Hub</a></li>
            </ul>
          </div>

          {/* Col 4: Resources & Legal */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li><a href="#comparison" className="hover:text-white transition-colors">Comparison Matrix</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy & Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500">
          <div>© {new Date().getFullYear()} Urban Kitchen. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 font-mono">Built for modern food businesses.</div>
        </div>

      </div>
    </div>
  );
}
