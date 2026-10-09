"use client";

import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function FoundersDesk() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-black text-white border-t border-b border-neutral-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#FF5B2E] font-bold uppercase tracking-widest">
            Architecture Philosophy
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          The Founder's Desk
        </h2>

        <div className="space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed font-normal pt-2">
          <p>
            When we stepped into commercial restaurant kitchens, we didn't see lack of passion — we saw <strong>operational fragmentation</strong>.
          </p>
          <p>
            A typical café or kitchen operator is forced to juggle five different devices: a Swiggy tablet chiming on the counter, a Zomato tablet blinking next to it, a legacy desktop POS running outdated billing software, paper KOT tickets getting lost near the fryer, and raw material inventory guessed on a weekly spreadsheet.
          </p>
          <p>
            We built <strong>Urban Kitchen</strong> on one simple premise: <em>A restaurant is a high-velocity manufacturing unit. It needs a unified operating system.</em>
          </p>
          <p>
            By connecting physical NFC cards and smart QR table stands directly to an isolated Neon PostgreSQL database, orders route to the kitchen in 0.05 seconds, ingredients auto-decrement by the gram, and customers receive their bills directly on WhatsApp. No fluff. No tablet circus. Just pure operational clarity.
          </p>
        </div>

        <div className="pt-6 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="font-bold text-white block text-sm">The Urban Kitchen Team</span>
            <span className="text-xs text-neutral-500 font-mono">Founders & Culinary Systems Architects</span>
          </div>

          <div className="text-xs font-mono text-[#FF5B2E] bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
            PostgreSQL • Neon • Infisical • Prisma
          </div>
        </div>
      </div>
    </section>
  );
}
