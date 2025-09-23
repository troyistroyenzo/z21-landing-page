'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import content from '@/app/content/z21.json';
import { interpolateEnv } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

export default function StickyMobileBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after 25% scroll
      const scrollPercentage = (window.scrollY / document.body.scrollHeight) * 100;
      setScrolled(scrollPercentage > 25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    trackEvent('cta_mobile_apply_click');
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={scrolled ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-3 left-3 right-3 z-50 rounded-xl bg-emerald-950/90 text-paper px-4 py-3 flex items-center justify-between shadow-xl md:hidden backdrop-blur"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-rust">Z21</span>
        <span className="text-sm">6-week Cohort</span>
      </div>
      <a 
        href={interpolateEnv(content.hero.primaryCta.href)}
        onClick={handleClick}
        className="rounded-lg bg-rust px-3 py-2 text-sm font-medium hover:bg-rust/90 transition-colors"
      >
        {content.hero.stickyMobileCTA || 'Apply now'}
      </a>
    </motion.div>
  );
}
