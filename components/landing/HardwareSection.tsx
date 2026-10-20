"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Wifi, QrCode, Layers, Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function HardwareSection() {
  const [activeTab, setActiveTab] = useState<"nfc" | "qr" | "kds">("nfc");

  return (
    <section id="hardware" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#07090E]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            Physical Touchpoints
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Connecting the Physical Dining Room to Digital Operations
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Durable, certified NFC and QR hardware assets that route directly through the Urban Kitchen control plane.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-8 flex justify-center gap-2 p-1 bg-[#10141E] border border-white/10 rounded-xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("nfc")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "nfc" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>NFC Review Card</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "qr" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Table Stand</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kds")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "kds" ? "bg-[#FF5B2E] text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>KDS & Print Hub</span>
          </button>
        </div>

        {/* Product Details Container */}
        <div className="mt-8 bg-[#0E121A] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10">
          {activeTab === "nfc" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Product Visual */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-[#181C26] to-[#0A0D14] border border-white/15 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="relative h-6 w-32">
                      <Image
                        src="/logo/urban-kitchen-lockup-dark.svg"
                        alt="Urban Kitchen"
                        fill
                        sizes="128px"
                        className="object-contain object-left"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> NFC Active
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-white block">Google Review Smart Asset</span>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Dynamic Route: /r/[token] • Tokenized Redirect
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                    <span>NTAG213 Encrypted Chip</span>
                    <span>Waterproof Matte PVC</span>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#FF5B2E] uppercase">Asset Specification</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Google Review NFC Tap Card</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                    A physical smart card held by waitstaff during customer billing. Diners tap their phone to immediately open your official Google Review page.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Dynamic Control Plane Routing:</strong> The physical card stores `/r/[token]`. You can re-target the destination URL or business profile from your dashboard without replacing the card.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Zero App Requirement:</strong> Operates natively with standard iOS and Android NFC readers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "qr" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-xs aspect-[3/4] rounded-2xl bg-[#141824] border border-white/15 p-6 shadow-xl flex flex-col justify-between text-center">
                  <div>
                    <span className="text-xs font-mono text-[#FF5B2E] block">Table 04</span>
                    <span className="text-sm font-bold text-white block mt-1">Scan for Live Menu & Order</span>
                  </div>

                  <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                    <QrCode className="w-full h-full text-black" />
                  </div>

                  <div className="text-[10px] text-gray-400 font-mono">
                    Tokenized Route: /t/andheri-t04
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#FF5B2E] uppercase">Tabletop Infrastructure</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Weatherproof Smart QR Table Stand</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                    Solid wood & acrylic table stands that resolve table-specific tokens directly in the control plane. Eliminates table order mixups.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">TableRoute Security:</strong> The client receives zero tenant database credentials or internal IDs. The control plane validates and loads the exact menu securely.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "kds" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md aspect-[16/10] rounded-2xl bg-[#090C12] border-2 border-gray-700 p-4 shadow-xl flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                    <span className="text-emerald-400 font-mono font-bold">KDS LIVE STATION: GRILL</span>
                    <span className="text-gray-400 font-mono">ESC/POS Thermal Hub Active</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-amber-200">
                      <span className="font-bold block">#104 Swiggy</span>
                      <span>2x Truffle Smash Burger</span>
                    </div>
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                      <span className="font-bold block">Table 04 Dine-In</span>
                      <span>1x Margherita Pizza</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 pt-2 border-t border-white/10">
                    Works on any Android, iOS, Windows touchscreen, or standard browser.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#FF5B2E] uppercase">Hardware Agnostic</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Kitchen Display & Thermal Printing Hub</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                    Zero proprietary lock-in. Run your Kitchen Display on your existing iPads, Android tablets, or touchscreens. Connects directly with standard USB, Bluetooth, and LAN thermal receipt printers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
