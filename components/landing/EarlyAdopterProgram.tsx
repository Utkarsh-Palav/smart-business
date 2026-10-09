"use client";

import React from "react";
import { Sparkles, ShieldCheck, Check, ArrowRight, UserCheck, Clock, Headphones } from "lucide-react";

export default function EarlyAdopterProgram() {
  const perks = [
    {
      icon: <UserCheck className="w-5 h-5 text-[#FF5B2E]" />,
      title: "White-Glove Menu Digitization",
      desc: "Send us your existing PDF, image, or legacy POS menu. Our onboarding team configures all categories, items, modifiers, and taxes for you within 24 hours.",
    },
    {
      icon: <Headphones className="w-5 h-5 text-amber-400" />,
      title: "Direct Access to Founding Team",
      desc: "Get a dedicated private WhatsApp channel with our product engineers for live support, custom feature feedback, and rapid onboarding.",
    },
    {
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      title: "15-Minute Zero-Downtime Migration",
      desc: "Test Urban Kitchen alongside your existing billing software without disrupting your active kitchen operations.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      title: "Dedicated Neon Database Provisioning",
      desc: "Your data is provisioned into a physically isolated PostgreSQL database instance from day one.",
    },
  ];

  return (
    <section className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#07090E]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#0E121B] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block">
                Early Adopter Program
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Launch with Full Concierge Setup & Engineering Support
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                We are partnering closely with ambitious cafés, restaurant owners, and cloud kitchens. As an early adopter, you receive direct onboarding assistance, complimentary hardware packs, and locked-in founder pricing.
              </p>
              <div className="pt-2">
                <a
                  href="#pricing"
                  className="px-5 py-2.5 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <span>Claim Early Adopter Benefits</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Perks Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {perks.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="p-2 rounded-lg bg-white/5 w-fit border border-white/5">
                    {p.icon}
                  </div>
                  <h4 className="text-xs font-bold text-white">{p.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
