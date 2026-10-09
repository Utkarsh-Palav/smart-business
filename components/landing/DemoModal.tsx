"use client";

import React, { useState } from "react";
import { X, CheckCircle2, PhoneCall, Sparkles, MessageSquare, Calendar } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    outlets: "1",
    concept: "CAFE",
    phone: "",
    city: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#10141E] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Demo Request Scheduled!
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto leading-relaxed">
              Our restaurant implementation specialist will message you on WhatsApp at{" "}
              <strong className="text-emerald-400">{formData.phone || "your number"}</strong> within 15 minutes with your custom kitchen demo link.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#FF5B2E] text-white font-semibold text-xs sm:text-sm hover:bg-[#FF5B2E]/90"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5B2E] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 1-on-1 Personalized Walkthrough
            </div>
            <h3 className="text-2xl font-bold text-white">
              See Urban Kitchen in Action
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Watch how our Unified POS, KDS, and Recipe Inventory fit your specific food concept.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Restaurant / Café Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Tokai Roasters"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5B2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Food Business Type
                  </label>
                  <select
                    value={formData.concept}
                    onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141926] border border-white/10 text-white focus:outline-none focus:border-[#FF5B2E]"
                  >
                    <option value="CAFE">Café & Coffee Shop</option>
                    <option value="RESTAURANT">Fine / Casual Dining</option>
                    <option value="QSR">QSR & Fast Food</option>
                    <option value="CLOUD_KITCHEN">Cloud Kitchen</option>
                    <option value="BAKERY">Bakery & Desserts</option>
                    <option value="FRANCHISE">Franchise / Chain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Total Outlets
                  </label>
                  <select
                    value={formData.outlets}
                    onChange={(e) => setFormData({ ...formData, outlets: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141926] border border-white/10 text-white focus:outline-none focus:border-[#FF5B2E]"
                  >
                    <option value="1">1 Outlet</option>
                    <option value="2-3">2 - 3 Outlets</option>
                    <option value="4-10">4 - 10 Outlets</option>
                    <option value="10+">10+ Outlets (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5B2E]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Bandra"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5B2E]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#FF5B2E] hover:bg-[#FF5B2E]/90 text-white font-bold text-sm transition-all shadow-lg shadow-[#FF5B2E]/30 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Confirm Free Demo Call</span>
                </button>
                <span className="text-[10px] text-gray-400 text-center block mt-2">
                  🔒 We respect your privacy. No spam, ever.
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
