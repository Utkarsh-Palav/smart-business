"use client";

import React from "react";
import { 
  Layers, 
  Database, 
  Key, 
  CreditCard, 
  MessageSquare, 
  Printer, 
  Smartphone, 
  ShieldCheck 
} from "lucide-react";

export default function LogoCarousel() {
  const logos = [
    { name: "SWIGGY API", desc: "Direct Partner Order Sync" },
    { name: "ZOMATO FEED", desc: "Live Auto-Acceptance" },
    { name: "NEON POSTGRES", desc: "DB-per-Business Isolation" },
    { name: "INFISICAL VAULT", desc: "AES-256 Secret Engine" },
    { name: "RAZORPAY", desc: "UPI & Multi-Tender Pay" },
    { name: "WHATSAPP CLOUD", desc: "Official Meta Business API" },
    { name: "THERMAL ESC/POS", desc: "Epson & Star Printers" },
    { name: "NFC TOKENS", desc: "Dynamic Cloud Routing" },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono text-xs text-center uppercase tracking-widest text-neutral-500 font-medium">
          Integrated Across Enterprise Hospitality Standards
        </h2>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0D1017] border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group"
            >
              <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 tracking-wider group-hover:text-[#FF5B2E] transition-colors">
                {logo.name}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5 font-sans">
                {logo.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
