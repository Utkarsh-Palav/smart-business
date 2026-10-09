"use client";

import React from "react";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

interface CtaBannerProps {
  onOpenDemo?: () => void;
}

export default function CtaBanner({ onOpenDemo }: CtaBannerProps) {
  return (
    <section className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#090C12] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#0E121B] border border-white/10 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block">
              Early Access Program
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Ready to Modernize Your Food Business Operations?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Experience the clarity of a unified Cloud POS, real-time KDS, and recipe-level stock ledger. 
              Start your 14-day free trial with full concierge menu digitization.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#pricing"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Start 14-Day Free Access</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white font-medium text-xs sm:text-sm border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Request Private Demo</span>
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 flex-wrap text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 15-minute setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free menu digitization
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
