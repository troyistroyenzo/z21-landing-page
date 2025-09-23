'use client';

import React, { useEffect, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import Hero from './components/Hero';
import VSL from './components/VSL';
import Features from './components/Features';
import Proof from './components/Proof';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ObjectionsAccordion from './components/ObjectionsAccordion';
import ProofWall from './components/ProofWall';
import MechanismSection from './components/MechanismSection';
import StickyMobileBar from './components/StickyMobileBar';

export default function Home() {
  useEffect(() => {
    // Check for reduced motion preference first
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return; // Skip Lenis initialization if reduced motion is preferred
    }

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

    // Handle anchor links
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
              offset: -80, // Account for sticky header
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Cleanup
    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <main className="bg-white">
      <Header />
      <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <Hero />
      </Suspense>
      <VSL />
      <MechanismSection />
      <Features />
      <ObjectionsAccordion />
      <ProofWall />
      <Proof />
      <FAQ />
      <Footer />
      <StickyMobileBar />
    </main>
  );
}
