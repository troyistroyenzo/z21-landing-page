'use client';

import React, { useEffect, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';
import B2BHero3D from '../components/b2b/B2BHero3D';
import B2BPromiseSection from '../components/b2b/B2BPromiseSection';
import B2BAudienceSection from '../components/b2b/B2BAudienceSection';
import B2BCurriculumSection from '../components/b2b/B2BCurriculumSection';
import B2BCaseStudiesSection from '../components/b2b/B2BCaseStudiesSection';
import B2BPricingSection from '../components/b2b/B2BPricingSection';
import B2BFinalCTA from '../components/b2b/B2BFinalCTA';
import B2BScrollIndicator from '../components/b2b/B2BScrollIndicator';

// Loading component
const PageLoading = () => (
  <div className="min-h-screen bg-[#0C1816] flex items-center justify-center">
    <motion.div
      className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function B2BPage() {
  useEffect(() => {
    // Initialize Lenis smooth scrolling optimized for 60fps
    const lenis = new Lenis({
      duration: 1.0, // Faster for better responsiveness and 60fps
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, // Increased for snappier response
      touchMultiplier: 1.5, // Reduced to prevent over-scrolling
      infinite: false,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <motion.main
      className="bg-black overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <B2BScrollIndicator />
      
      <Suspense fallback={<PageLoading />}>
        {/* Hero Section */}
        <section id="hero" className="relative">
          <B2BHero3D />
        </section>

        {/* Promise Section */}
        <section id="promise" className="relative">
          <B2BPromiseSection />
        </section>

        {/* Who It's For Section */}
        <section id="audience" className="relative">
          <B2BAudienceSection />
        </section>

        {/* What You Get - Curriculum */}
        <section id="curriculum" className="relative">
          <B2BCurriculumSection />
        </section>

        {/* Case Studies */}
        <section id="case-studies" className="relative">
          <B2BCaseStudiesSection />
        </section>

        {/* Pricing */}
        {/* <section id="pricing" className="relative">
          <B2BPricingSection />
        </section> */}

        {/* Final CTA */}
        <section id="cta" className="relative">
          <B2BFinalCTA />
        </section>
      </Suspense>
    </motion.main>
  );
}
