'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import StickyHeader from '@/app/components/StickyHeader';
import HeroNoske from '@/app/components/HeroNoske';
import ProblemSection from '@/app/components/ProblemSection';
import StorySection from '@/app/components/StorySection';
import FormulaCards from '@/app/components/FormulaCards';
import DifferentiatorsSection from '@/app/components/DifferentiatorsSection';
import RoadmapSection from '@/app/components/RoadmapSection';
import FinalCTA from '@/app/components/FinalCTA';
import Footer from '@/app/components/Footer';

export default function NoskeLandingPage() {
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
    <main className="relative">
      <StickyHeader />
      <HeroNoske />
      
      {/* Separator strip */}
      <div className="bg-dark-green py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {Array(10).fill(0).map((_, i) => (
            <span key={i} className="text-tan/40 text-sm uppercase tracking-ultra inline-block mx-8">
              INTRODUCING Z21 • THE ZERO→ONE AI SHIPPING COMMUNITY • 
            </span>
          ))}
        </div>
      </div>

      <ProblemSection />
      <StorySection />
      <FormulaCards />
      <DifferentiatorsSection />
      <RoadmapSection />
      <FinalCTA />
      
      {/* Custom Footer for Noske style */}
      <footer className="bg-dark-green text-off-white py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-tan mb-4">
                Z21
              </h3>
              <p className="text-muted-green text-sm">
                The zero→one AI shipping community. Transform from AI-curious to AI-powered.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading uppercase tracking-wider text-tan/60 text-sm mb-4">
                Quick Links
              </h4>
              <div className="space-y-2">
                {['About', 'Cohort', 'Community', 'Contact'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-muted-green hover:text-tan transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading uppercase tracking-wider text-tan/60 text-sm mb-4">
                Legal
              </h4>
              <div className="space-y-2">
                {['Terms', 'Privacy', 'Disclaimer'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-muted-green hover:text-tan transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-tan/20 text-center">
            <p className="text-muted-green/60 text-sm">
              © 2025 Z21 Founders HQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
