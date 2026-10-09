"use client";

import React from "react";
import Image from "next/image";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Calendar,
  Layers,
  Smartphone,
  ChefHat,
  Database,
  Sliders
} from "lucide-react";
import InteractiveSandbox from "./InteractiveSandbox";

interface HeroSectionProps {
  onOpenDemo?: () => void;
}

export default function HeroSection({ onOpenDemo }: HeroSectionProps) {
  return (
    <section className="relative w-full pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#07090E]">
      {/* Subtle Structural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Atmospheric Subtle Warm Radial Focus */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#FF5B2E]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Headline & Context */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Architectural Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-gray-300 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B2E]" />
            <span>Built for Cafés, Restaurants, QSRs & Cloud Kitchens</span>
          </div>

          {/* Master Headline - Sharp, Restrained & Commanding */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            The Unified Operating System for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Modern Food & Beverage Operations.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Eliminate fragmented tablets, manual spreadsheets, and disconnected billing. 
            Urban Kitchen consolidates <strong>Swiggy, Zomato, QR table ordering, Cloud POS, live KDS, recipe inventory, and WhatsApp communications</strong> into a single high-performance engine.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <a
              href="#pricing"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shadow-[#FF5B2E]/20"
            >
              <span>Explore Founder Access</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-medium text-sm border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Request 1-on-1 Walkthrough</span>
            </button>
          </div>

          {/* Key Engineering Pillars */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-6 sm:gap-8 flex-wrap text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" /> Dedicated Neon DB per Business
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> 0.05s Real-time KDS Sync
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Encrypted Infisical Secrets
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#FF5B2E]" /> Unified Aggregator API Hub
            </span>
          </div>
        </div>

        {/* Interactive Live Sandbox */}
        <div className="mt-12 sm:mt-16">
          <InteractiveSandbox />
        </div>
      </div>
    </section>
  );
}
