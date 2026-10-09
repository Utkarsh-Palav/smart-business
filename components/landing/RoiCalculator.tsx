"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";

export default function RoiCalculator() {
  const [outlets, setOutlets] = useState(2);
  const [monthlyRevenue, setMonthlyRevenue] = useState(500000); // ₹5.0 Lakhs per outlet
  const [aggregatorShare, setAggregatorShare] = useState(40); // 40% delivery share

  const totalMonthlyGross = outlets * monthlyRevenue;
  const totalAnnualGross = totalMonthlyGross * 12;

  // Realistic Operational Modeling:
  // 1. Direct Order Shift: Converting 15% of delivery orders to direct zero-commission QR/WhatsApp saves ~20% aggregator commission
  const aggregatorRevenue = totalMonthlyGross * (aggregatorShare / 100);
  const directShiftedRevenue = aggregatorRevenue * 0.15;
  const monthlyCommissionSaved = directShiftedRevenue * 0.20;

  // 2. Food Cost Leakage Prevention: Saving ~3% of gross sales from accurate recipe-level ingredient decrementing
  const monthlyWastageSaved = totalMonthlyGross * 0.03;

  // 3. Table Turnover & Direct Upsell Boost: ~4% lift in dine-in sales throughput
  const dineInRevenue = totalMonthlyGross * (1 - aggregatorShare / 100);
  const monthlyTurnoverLift = dineInRevenue * 0.04;

  const totalMonthlyExtraProfit = monthlyCommissionSaved + monthlyWastageSaved + monthlyTurnoverLift;
  const totalAnnualExtraProfit = totalMonthlyExtraProfit * 12;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="calculator" className="w-full py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#090C12] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider block mb-2">
            Operational Cost Modeling
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Interactive Profit & Margin Estimator
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Model how reducing recipe wastage, capturing direct table orders, and speeding up table turnover impacts your store margins.
          </p>
        </div>

        {/* Calculator Body */}
        <div className="mt-12 bg-[#0E121B] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-semibold text-gray-200">Number of Outlets / Branches</label>
                  <span className="font-mono font-bold text-white px-2.5 py-1 bg-white/5 rounded border border-white/10">
                    {outlets} {outlets === 1 ? "Outlet" : "Outlets"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={outlets}
                  onChange={(e) => setOutlets(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#FF5B2E]"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-semibold text-gray-200">Avg. Monthly Sales per Outlet</label>
                  <span className="font-mono font-bold text-emerald-400 px-2.5 py-1 bg-white/5 rounded border border-white/10">
                    {formatCurrency(monthlyRevenue)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="2500000"
                  step="50000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 3 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className="font-semibold text-gray-200">Online Aggregator Delivery Share</label>
                  <span className="font-mono font-bold text-amber-400 px-2.5 py-1 bg-white/5 rounded border border-white/10">
                    {aggregatorShare}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={aggregatorShare}
                  onChange={(e) => setAggregatorShare(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Breakdown metrics */}
              <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-gray-400 block text-[11px]">Direct Order Shift</span>
                  <span className="font-mono font-bold text-emerald-400 block mt-1">
                    +{formatCurrency(monthlyCommissionSaved)}/mo
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-gray-400 block text-[11px]">Recipe Wastage Saved</span>
                  <span className="font-mono font-bold text-emerald-400 block mt-1">
                    +{formatCurrency(monthlyWastageSaved)}/mo
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-gray-400 block text-[11px]">Table Turnover Lift</span>
                  <span className="font-mono font-bold text-emerald-400 block mt-1">
                    +{formatCurrency(monthlyTurnoverLift)}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-5 bg-[#141926] border border-white/10 rounded-xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Estimated Net Impact
                </span>
                <div className="mt-3">
                  <span className="text-xs text-gray-400 block">Annual Estimated Margin Improvement</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mt-1">
                    {formatCurrency(totalAnnualExtraProfit)}
                  </div>
                  <span className="text-xs text-gray-400 block mt-1">
                    ≈ {formatCurrency(totalMonthlyExtraProfit)} per month across {outlets} {outlets === 1 ? "outlet" : "outlets"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <a
                  href="#pricing"
                  className="w-full py-3 rounded-lg bg-[#FF5B2E] hover:bg-[#E24A1F] text-white text-center text-xs font-semibold block transition-colors shadow-sm"
                >
                  View Early Access Pricing →
                </a>
                <span className="text-[10px] text-gray-400 text-center block mt-2">
                  *Based on average 3% wastage prevention and 15% direct order shift.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
