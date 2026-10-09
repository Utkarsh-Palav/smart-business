"use client";

import React from "react";
import { ShieldCheck, Database, Key, Server, Lock, Cpu, CheckCircle2 } from "lucide-react";

export default function ArchitectureSecurity() {
  return (
    <section id="architecture" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#090C12] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            Technical Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Control Plane + Neon DB-per-Business Isolation
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Unlike legacy POS systems that store all customer data in shared multi-tenant tables, Urban Kitchen provisions an isolated PostgreSQL database for every business.
          </p>
        </div>

        {/* 3 Pillars of Security Architecture */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Layer 1 */}
          <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-gray-400">Layer 01</span>
              </div>
              <h3 className="text-base font-bold text-white mt-4">Control Plane & Auth</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Central identity resolution, encrypted sessions, granular RBAC (Owner, Manager, Waiter, Kitchen Operator), and tokenized table routing.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Central Control PostgreSQL DB</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tokenized `/t/[token]` table routes</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-gray-500 font-mono">
              Identity & Business Lifecycle
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Key className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-gray-400">Layer 02</span>
              </div>
              <h3 className="text-base font-bold text-white mt-4">Infisical Secret Vault</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Tenant database credentials are never stored in cleartext or passed to client browsers. Machine identities resolve database URLs securely on the server.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Universal Auth machine credentials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Zero database URLs in client runtime</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-gray-500 font-mono">
              AES-256 Vault Management
            </div>
          </div>

          {/* Layer 3 */}
          <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-gray-400">Layer 03</span>
              </div>
              <h3 className="text-base font-bold text-white mt-4">Tenant Database Isolation</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Each restaurant receives its own dedicated PostgreSQL instance on Neon. Menus, orders, customer CRM, and inventory are physically partitioned.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero cross-tenant query leak risk</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Prisma 7 modern driver adapters</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-gray-500 font-mono">
              Neon Serverless PostgreSQL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
