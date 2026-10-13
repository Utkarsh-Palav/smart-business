"use client";

import React, { useState } from "react";
import AceternityHero from "@/components/landing/AceternityHero";
import LogoCarousel from "@/components/landing/LogoCarousel";
import BentoFeatures from "@/components/landing/BentoFeatures";
import ShowcaseGrid from "@/components/landing/ShowcaseGrid";
import UserInsights from "@/components/landing/UserInsights";
import ScalingMetrics from "@/components/landing/ScalingMetrics";
import ComparisonTable from "@/components/landing/ComparisonTable";
import DescriptivePricing from "@/components/landing/DescriptivePricing";
import FoundersDesk from "@/components/landing/FoundersDesk";
import VideoTestimonials from "@/components/landing/VideoTestimonials";
import FaqSection from "@/components/landing/FaqSection";
import FooterCta from "@/components/landing/FooterCta";
import DemoModal from "@/components/landing/DemoModal";

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <main className="h-dvh w-full bg-white dark:bg-black text-neutral-900 dark:text-white pt-3 font-sans selection:bg-[#FF5B2E]/30 selection:text-white">
      {/* 1. Hero Section (Framed Dark Box with Curved Glowing Arcs & Watermark) */}
      <AceternityHero />

      {/* 2. Ecosystem & Standards Logo Carousel */}
      {/* <LogoCarousel /> */}

      {/* 3. Bento Grid: 'Replace your Fragmented Restaurant Stack' */}
      <BentoFeatures  />

      {/* 4. 'Operations' Visual Showcase Grid with Watermark Typography */}
      <ShowcaseGrid />

      {/* 5. 'Raw insights straight from kitchen operations' */}
      <UserInsights onOpenDemo={() => setDemoModalOpen(true)} />

      {/* 6. 'Scaling High-Growth Food Brands' Metrics & Infrastructure Stack */}
      <ScalingMetrics onOpenDemo={() => setDemoModalOpen(true)} />

      {/* 7. 'Urban Kitchen vs Traditional Legacy POS' Comparison Matrix Table */}
      <ComparisonTable />

      {/* 8. 'Descriptive Pricing Plans' with Monthly/Annual Switch */}
      <DescriptivePricing />

      {/* 9. 'The Founder's Desk' Full-Width Dark Letter Section */}
      <FoundersDesk />

      {/* 10. 'What operators have been saying' Video/Preview Cards */}
      <VideoTestimonials onOpenDemo={() => setDemoModalOpen(true)} />

      {/* 11. Frequently Asked Questions (2-Column with Left Chat Card) */}
      <FaqSection />

      {/* 12. Bottom Framed CTA Container with Watermark Typography & Footer */}
      <FooterCta onOpenDemo={() => setDemoModalOpen(true)} />

      {/* 13. 1-on-1 Interactive Demo Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </main>
  );
}
