"use client";

import React from "react";
import { Play, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface VideoTestimonialsProps {
  onOpenDemo?: () => void;
}

export default function VideoTestimonials({ onOpenDemo }: VideoTestimonialsProps) {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-neutral-100 dark:bg-[#07090E] border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header matching reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight">
              What operators have been saying
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenDemo}
            className="group relative flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#FF5B2E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E24A1F] transition-all"
          >
            <span>Schedule Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Dark Video / Flow Cards matching Aceternity Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black border border-neutral-800 text-white flex flex-col justify-between min-h-[220px] shadow-sm relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
                <span>01. FRONT-OF-HOUSE SPEED</span>
                <span className="text-[#FF5B2E]">Table QR + NFC</span>
              </div>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                "Our weekend customer queue vanished completely. Diners scan the table stand, choose modifiers, and pay via UPI directly from their phone."
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Boutique Roastery & Café</span>
              <span className="text-emerald-400">Zero Waiter Latency</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black border border-neutral-800 text-white flex flex-col justify-between min-h-[220px] shadow-sm relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
                <span>02. INGREDIENT MARGINS</span>
                <span className="text-emerald-400">Recipe Inventory</span>
              </div>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-medium">
                "We immediately spotted where cheese and patty stock was disappearing. The sub-gram auto-decrementing gave us total control over our kitchen costs."
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Cloud Kitchen Group</span>
              <span className="text-emerald-400">3.2% Margin Lift</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
