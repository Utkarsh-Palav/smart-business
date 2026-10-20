"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, CheckCircle, TrendingUp } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Siddharth Roy",
      role: "Founder & Head Roaster",
      business: "The Roastery Craft Coffee",
      location: "Bandra, Mumbai",
      avatar: "/hero2.jpg",
      rating: 5,
      metric: "+34% Sales Lift",
      quote:
        "Urban Kitchen's NFC Google Review cards completely transformed our local discovery. We went from 180 reviews to 850+ reviews in 4 months, making us the #1 rated cafe on Google Maps in our district. The QR table ordering handles 70% of our peak morning rush with zero queues.",
      tags: ["NFC Review Cards", "QR Table Ordering", "Loyalty"],
    },
    {
      name: "Ananya Deshmukh",
      role: "Managing Partner",
      business: "Spice Symphony Fine Dine",
      location: "Indiranagar, Bangalore",
      avatar: "/hero.jpg",
      rating: 5,
      metric: "30 Mins Faster Table Turns",
      quote:
        "The KDS station routing eliminated all chef-waiter yelling during Saturday dinner rushes. Starters, tandoor items, and main curries fire at exact intervals. Plus, guests love splitting the bill directly on their phone using UPI without waiting 15 minutes for the card machine.",
      tags: ["Multi-Station KDS", "Table Split-Pay", "POS"],
    },
    {
      name: "Kabir Mehta",
      role: "Owner & Chef",
      business: "Urban Crust Artisan Pizzeria",
      location: "CyberHub, Gurugram",
      avatar: "/hero3.jpg",
      rating: 5,
      metric: "₹52,000/mo Wastage Saved",
      quote:
        "Before Urban Kitchen, we had zero visibility into why we were running out of imported mozzarella. The recipe-level inventory deducts exact grams on every pizza sold. We caught ₹50k+ in monthly shrinkage within our first 30 days.",
      tags: ["Recipe Inventory", "Gross Margins", "Procurement"],
    },
    {
      name: "Vikram Sethi",
      role: "Operations Director",
      business: "CloudBite Kitchen Labs (6 Brands)",
      location: "Kalyani Nagar, Pune",
      avatar: "/hero4.jpg",
      rating: 5,
      metric: "Zero Order Cancellations",
      quote:
        "We operate 6 virtual delivery brands from one cloud kitchen. Juggling 6 Swiggy and Zomato tablets was a daily disaster. Urban Kitchen collapsed all 6 brands into one unified POS terminal with automatic KDS dispatch. Operational sanity restored.",
      tags: ["Multi-Brand POS", "Swiggy/Zomato Sync", "Cloud Kitchen"],
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#090C12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Proven Culinary Leadership
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Trusted by 1,200+ Restaurants, <br />
            <span className="bg-gradient-to-r from-amber-400 via-[#FF5B2E] to-emerald-400 bg-clip-text text-transparent">
              Cafés & Multi-Brand Empires
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300">
            Hear directly from the owners and operational heads who scaled their revenue and simplified their kitchen workflows with Urban Kitchen.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#121622] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF5B2E]/5"
            >
              <div>
                {/* Rating & Metric Badge */}
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {t.metric}
                  </span>
                </div>

                {/* Quote */}
                <p className="mt-4 text-xs sm:text-sm text-gray-200 leading-relaxed italic">
                  "{t.quote}"
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.tags.map((tg, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full overflow-hidden relative border border-white/20 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {t.role} • <strong className="text-gray-300">{t.business}</strong> ({t.location})
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
