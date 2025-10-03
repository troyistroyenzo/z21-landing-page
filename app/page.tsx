'use client';

import React, { useEffect, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import GlobalCountdown from './components/GlobalCountdown';
import PainPointSection from './components/PainPointSection';
import SolutionSection from './components/SolutionSection';
import TestimonialsSection from './components/TestimonialsSection';
import TrapSection from './components/TrapSection';
import VSL from './components/VSL';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ClientsSection from './components/ClientsSection';
import ProblemSection from './components/ProblemSection';
import StorySection from './components/StorySection';
import FormulaCards from './components/FormulaCards';
import RoadmapSection from './components/RoadmapSection';
import FinalCTA from './components/FinalCTA';
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
    // Initialize Lenis smooth scrolling
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

    return () => {
      lenis.destroy();
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
        <GlobalCountdown />
        <VSL />
        <PainPointSection />
        <ProblemSection />
        <TrapSection />
        <SolutionSection />
        <ClientsSection />
        <TestimonialsSection />
        <StorySection />
        <FormulaCards />
        <RoadmapSection />
        <FinalCTA />
        <FAQ />
        <Footer />

        
      </Suspense>
    </motion.main>
  );
}
