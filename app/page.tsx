'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import Hero from './components/Hero';
import VSL from './components/VSL';
import Features from './components/Features';
import Proof from './components/Proof';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

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

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      lenis.destroy();
    }

    // Cleanup
    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <main className="bg-white">
      <Header />
      <Hero />
      <VSL />
      <Features />
      <Proof />
      <FAQ />
      <Footer />
    </main>
  );
}
