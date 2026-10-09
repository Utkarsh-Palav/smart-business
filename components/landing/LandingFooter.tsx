"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="w-full bg-[#06080C] border-t border-white/5 pt-14 pb-10 px-4 sm:px-6 lg:px-8 text-xs text-gray-400">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/5">
          {/* Col 1 */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <div className="relative h-8 w-40">
                <Image
                  src="/logo/urban-kitchen-lockup-dark.svg"
                  alt="Urban Kitchen"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Unified operating system connecting physical review cards, QR smart tables, omnichannel POS, live KDS, recipe inventory, and WhatsApp communications into a single high-performance engine.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>Control Plane & Neon Postgres Active</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Modules</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#modules" className="hover:text-white transition-colors">Omnichannel POS</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Smart QR Table Menu</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Kitchen Display (KDS)</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Recipe-Level Inventory</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">WhatsApp CRM</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Multi-Outlet Hub</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hardware & Tech</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#hardware" className="hover:text-white transition-colors">Google Review NFC Cards</a></li>
              <li><a href="#hardware" className="hover:text-white transition-colors">QR Table Stands</a></li>
              <li><a href="#hardware" className="hover:text-white transition-colors">KDS & Thermal Print Hub</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Neon Database Isolation</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Infisical Secret Vault</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#flywheel" className="hover:text-white transition-colors">Operating Workflow</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing & Plans</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} Urban Kitchen. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Security Architecture</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
