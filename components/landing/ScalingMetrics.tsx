"use client";

import React from "react";
import { ArrowRight, Layers, Database, Zap, ShieldCheck } from "lucide-react";

interface ScalingMetricsProps {
  onOpenDemo?: () => void;
}

export default function ScalingMetrics({ onOpenDemo }: ScalingMetricsProps) {
  const stack = [
    { name: "Neon PostgreSQL", icon: "🐘", role: "Database Isolation" },
    { name: "Prisma 7", icon: "⚡", role: "Edge Query Engine" },
    { name: "Infisical Vault", icon: "🔐", role: "Secret Encryption" },
    { name: "WhatsApp Cloud API", icon: "💬", role: "Direct CRM" },
    { name: "Swiggy Direct API", icon: "🛵", role: "Aggregator Sync" },
    { name: "Zomato Partner API", icon: "🍽️", role: "Live Order Feed" },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
          Scaling High-Growth Food Brands
        </h2>

        {/* Scaling Grid Container matching Aceternity Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Big Number & Architecture Card (Col-Span 7) */}
          <div className="lg:col-span-7 p-8 rounded-2xl bg-neutral-50 dark:bg-[#0A0D14] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#FF5B2E] uppercase tracking-wider block">
                Architecture Performance
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold text-neutral-900 dark:text-white font-mono">
                  0.05s
                </span>
                <span className="text-sm font-semibold text-neutral-500">
                  Real-Time Kitchen Sync Speed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed max-w-lg">
                Built on serverless Neon PostgreSQL and low-latency websocket connections. Orders from Swiggy, Zomato, counter kiosks, and table QR tokens reflect across all kitchen stations simultaneously.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">99.99% Uptime Guarantee</span>
              <button
                type="button"
                onClick={onOpenDemo}
                className="text-xs font-bold text-[#FF5B2E] hover:underline flex items-center gap-1"
              >
                <span>Request Technical Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Technology & Module Stack Pill Grid (Col-Span 5) */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-neutral-50 dark:bg-[#0A0D14] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-6">
            <div>
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Infrastructure Stack
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
                Zero Legacy Technical Debt
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {stack.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
              Hardware & OS Agnostic Runtime
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
