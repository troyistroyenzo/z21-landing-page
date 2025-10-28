'use client';

import React, { useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import GlobalCountdown from './components/GlobalCountdown';
import VSL from './components/VSL';
import CoursesSection from './components/CoursesSection';
import OfferSection from './components/OfferSection';
import ProblemSection from './components/ProblemSection';
import TrapSection from './components/TrapSection';
import ClientsSection from './components/ClientsSection';
import StorySection from './components/StorySection';
import FinalCTA from './components/FinalCTA';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

// Lazy load heavy 3D components
const PainPointSection3D = dynamic(() => import('./components/PainPointSection3D'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
});

const SolutionSection3D = dynamic(() => import('./components/SolutionSection3D'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
});

const FormulaCards3D = dynamic(() => import('./components/FormulaCards3D'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
});

const RoadmapSection3D = dynamic(() => import('./components/RoadmapSection3D'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
});
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
    // Defer Lenis initialization to improve initial load
    const initLenis = () => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return lenis;
    };

    // Initialize after a delay to not block initial render
    const timeoutId = setTimeout(() => {
      const lenis = initLenis();
      return () => {
        lenis.destroy();
      };
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <motion.main
      className="bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <Header />
      <Suspense fallback={<PageLoading />}>
        <Hero />
        <GlobalCountdown />
        <VSL />
        <CoursesSection />
        <OfferSection />
        <PainPointSection3D />
        <ProblemSection />
        <TrapSection />
        <SolutionSection3D />
        <ClientsSection />
        <StorySection />
        <FormulaCards3D />
        <RoadmapSection3D />
        <FinalCTA />
        <FAQ />
        <Footer />

        
      </Suspense>
    </motion.main>
  );
}
