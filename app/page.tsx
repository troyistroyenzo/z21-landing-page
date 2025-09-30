'use client';

import React, { useEffect, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import PainPointSection from './components/PainPointSection';
import SolutionSection from './components/SolutionSection';
import TomLetterSection from './components/TomLetterSection';
import BuildInSixWeeks from './components/BuildInSixWeeks';
import CurriculumSection from './components/CurriculumSection';
import WhatYouGetSection from './components/WhatYouGetSection';
import TestimonialsSection from './components/TestimonialsSection';
import MoatAnalysisSection from './components/MoatAnalysisSection';
import ReviewsSection from './components/ReviewsSection';
import TrapSection from './components/TrapSection';
import RealProblemSection from './components/RealProblemSection';
import VSL from './components/VSL';
import Features from './components/Features';
import Proof from './components/Proof';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ClientsSection from './components/ClientsSection';
import HeroNoske from './components/HeroNoske';

// Loading component
const PageLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <motion.div
      className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function Home() {
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    // Initialize Lenis smooth scrolling with enhanced inertia and "weight"
    const lenis = new Lenis({
      duration: 2.4,
      easing: (t) => {
        // Enhanced ease-in-out for more "weight"
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        
        return t < 0.5
          ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
          : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.6, // Reduced for more control
      touchMultiplier: 1.8, // Increased for mobile inertia
      syncTouch: true,
      touchInertiaMultiplier: 35, // Add inertia for touch
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links with smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const element = document.querySelector(href) as HTMLElement;
          if (element) {
            lenis.scrollTo(element, {
              offset: -80,
              duration: 2,
              easing: (t) => {
                // Ease-in-out for anchor links
                if (t < 0.5) {
                  return 4 * t * t * t;
                } else {
                  return 1 - Math.pow(-2 * t + 2, 3) / 2;
                }
              },
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <motion.main
      className="bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header />
      <Suspense fallback={<PageLoading />}>
        <Hero />
        <Countdown />
        <VSL />
        <PainPointSection />
        <SolutionSection />
        <TomLetterSection />
        <BuildInSixWeeks />
        <CurriculumSection />
        <WhatYouGetSection />
        <TestimonialsSection />
        <MoatAnalysisSection />
        <TrapSection />
        <RealProblemSection />
        <Features />
        <ClientsSection />
        <ReviewsSection />
        <Proof />
        <FAQ />
        <Footer />
      </Suspense>
    </motion.main>
  );
}
