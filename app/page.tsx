'use client';

import React, { useEffect, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import PainPointSection from './components/PainPointSection';
import SolutionSection from './components/SolutionSection';
import TrapSection from './components/TrapSection';
import RealProblemSection from './components/RealProblemSection';
import VSL from './components/VSL';
import Features from './components/Features';
import Proof from './components/Proof';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

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

    // Initialize Lenis smooth scrolling with ease-in-out
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => {
        // Custom ease-in-out cubic bezier approximation
        if (t < 0.5) {
          return 4 * t * t * t;
        } else {
          return 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
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
        <TrapSection />
        <RealProblemSection />
        <Features />
        <Proof />
        <FAQ />
        <Footer />
      </Suspense>
    </motion.main>
  );
}
