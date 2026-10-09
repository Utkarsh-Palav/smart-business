"use client";

import React, { useState } from "react";
import { Plus, Minus, MessageSquare, ArrowRight } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the onboarding and menu migration work?",
      a: "Onboarding takes approximately 15 minutes. Our team or automated menu ingestion tool imports your existing categories, items, prices, modifiers, and taxes from your existing PDF, spreadsheet, or POS export. You can run Urban Kitchen in parallel with your current setup before switching over.",
    },
    {
      q: "Do I need to purchase expensive proprietary hardware?",
      a: "No. Urban Kitchen is hardware agnostic. You can run our POS and KDS on any existing device you own — iPads, Android tablets, Windows POS touchscreens, or standard web browsers. It connects with standard USB, Bluetooth, and LAN thermal receipt printers (Epson, TVS, Star, etc.).",
    },
    {
      q: "How does the Swiggy and Zomato integration work?",
      a: "Urban Kitchen connects directly via official aggregator APIs. Incoming orders from Swiggy and Zomato arrive directly in your central POS queue and automatically route to kitchen station screens. Our global 1-click Item 86 switch updates availability across all platforms simultaneously.",
    },
    {
      q: "What happens if our restaurant internet drops out during peak rush?",
      a: "Urban Kitchen includes offline-first local network caching. If the internet drops, you can continue taking dine-in orders, punching items, and printing KOT receipts over your local WiFi. Once connectivity is restored, all data automatically syncs to your central database.",
    },
    {
      q: "How do the Google Review NFC cards function?",
      a: "When a guest pays, staff hold the card near the guest's smartphone (or the guest scans the QR code). This resolves the tokenized route /r/[token] via the control plane and directly opens your Google Review page. You can change your Google Review target URL anytime from your dashboard without replacing the physical card.",
    },
    {
      q: "How does recipe-level inventory decrement ingredient quantities?",
      a: "You map each menu item to its constituent ingredients once (e.g. 1 Burger = 1 Bun, 150g Patty, 20g Sauce). When an order is completed, the system idempotently deducts those exact quantities from your stock ledger. Low-stock alerts notify you before ingredients run out.",
    },
    {
      q: "How is our restaurant data isolated from other businesses?",
      a: "Urban Kitchen utilizes a Control Plane + Tenant Database architecture. Each business receives its own dedicated PostgreSQL database on Neon. Database connection secrets are stored in an encrypted Infisical vault and never exposed to the client browser.",
    },
  ];

  return (
    <section id="faq" className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Heading & Chat Card matching Aceternity Reference */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono text-xs text-[#FF5B2E] font-bold uppercase tracking-widest block mb-2">
                Help & Clarifications
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight leading-tight">
                Frequently Asked <br /> Questions
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Clear technical and operational answers for restaurant operators and business owners.
              </p>
            </div>

            {/* Chat Box on Left */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                Have a specific question about your kitchen setup?
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Our engineering team is available for live WhatsApp consultation.
              </p>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Chat with us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Accordion Rows matching Aceternity Reference */}
          <div className="lg:col-span-7 divide-y divide-neutral-200 dark:divide-neutral-800">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {faq.q}
                    </span>
                    <span className="text-neutral-500 shrink-0">
                      {isOpen ? <Minus className="size-4 text-[#FF5B2E]" /> : <Plus className="size-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pr-6 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
