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

export default function EcosystemStrip() {
  const partners = [
    { name: "Swiggy Partner API", icon: <Layers className="w-4 h-4 text-[#FC8019]" />, tag: "Official Sync" },
    { name: "Zomato Food Network", icon: <Layers className="w-4 h-4 text-[#E23744]" />, tag: "Live Orders" },
    { name: "Neon PostgreSQL", icon: <Database className="w-4 h-4 text-emerald-400" />, tag: "DB-per-Business" },
    { name: "Infisical Secret Vault", icon: <Key className="w-4 h-4 text-purple-400" />, tag: "AES-256 Vault" },
    { name: "Razorpay Payments", icon: <CreditCard className="w-4 h-4 text-blue-400" />, tag: "UPI & Cards" },
    { name: "WhatsApp Cloud API", icon: <MessageSquare className="w-4 h-4 text-[#00A884]" />, tag: "Official Meta API" },
    { name: "Epson & Star Thermal", icon: <Printer className="w-4 h-4 text-gray-300" />, tag: "ESC/POS Auto-Print" },
    { name: "Dynamic Table Tokens", icon: <Smartphone className="w-4 h-4 text-amber-400" />, tag: "NFC & QR Routing" },
  ];

  return (
    <div className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-black border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        <h3 className="font-mono text-xs text-center uppercase tracking-widest text-gray-500">
          Integrated Across Enterprise Hospitality Standards
        </h3>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0A0D14] border border-white/5 flex items-center justify-between hover:border-white/15 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-white/5 border border-white/5">
                  {p.icon}
                </div>
                <span className="text-xs font-medium text-gray-200">{p.name}</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 hidden sm:inline-block">
                {p.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
