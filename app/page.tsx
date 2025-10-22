'use client';

import React, { useEffect, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero3D from './components/Hero3D';
import GlobalCountdown from './components/GlobalCountdown';
import PainPointSection3D from './components/PainPointSection3D';
import SolutionSection3D from './components/SolutionSection3D';
import TestimonialsSection from './components/TestimonialsSection';
import TrapSection from './components/TrapSection';
import VSL from './components/VSL';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ClientsSection3D from './components/ClientsSection3D';
import ProblemSection from './components/ProblemSection';
import StorySection from './components/StorySection';
import FormulaCards3D from './components/FormulaCards3D';
import RoadmapSection3D from './components/RoadmapSection3D';
import CoursesSection from './components/CoursesSection';
import OfferSection from './components/OfferSection';
import FinalCTA from './components/FinalCTA';
import SolutionSection from './components/SolutionSection';
import ClientsSection from './components/ClientsSection';
import PainPointsSection from './components/PainPointSection';
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
        <Hero3D />
        <GlobalCountdown />
        <VSL />
        <CoursesSection />
        <OfferSection />
        
        <PainPointSection3D />
        <PainPointsSection />

        <ProblemSection />
        <TrapSection />
        {/* <SolutionSection/> */}
        

        <SolutionSection3D />
        {/* <ClientsSection3D /> */}
        <ClientsSection/>
        {/* <TestimonialsSection /> */}
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
