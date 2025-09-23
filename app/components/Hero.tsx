'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Container from './Container';
import CTAButton from './CTAButton';
import content from '@/app/content/z21.json';
import { ChevronDown } from 'lucide-react';
import { interpolateEnv } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function Hero() {
  const searchParams = useSearchParams();
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const v = searchParams.get('v');
    if (v === '2') {
      setVariant('B');
    }
  }, [searchParams]);

  const scrollToVSL = () => {
    const vslSection = document.getElementById('vsl');
    if (vslSection) {
      vslSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Select copy based on variant
  const heroTitle = variant === 'B' && content.hero.variantB?.title 
    ? content.hero.variantB.title 
    : content.hero.title;

  const ctaLabel = variant === 'B' 
    ? 'Start the 6-week sprint'
    : content.hero.primaryCta.label;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-off-white pt-20">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-tan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-dark-green/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-caption uppercase tracking-widest text-tan font-medium mb-6"
          >
            {content.hero.eyebrow}
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="font-heading text-display-lg lg:text-[80px] text-dark-green mb-6 leading-[0.9] uppercase tracking-wide font-black"
          >
            {heroTitle}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="font-body text-body-lg lg:text-xl text-muted-green mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {content.hero.sub}
          </motion.p>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {content.hero.badges.map((badge, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-dark-green/10 text-dark-green rounded-full text-caption uppercase tracking-wide font-medium"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <CTAButton
              href={interpolateEnv(content.hero.primaryCta.href)}
              variant="primary"
              size="lg"
              external
              trackingEvent="cta_apply_click"
            >
              {ctaLabel}
            </CTAButton>
            
            <CTAButton
              href={interpolateEnv(content.hero.secondaryCta.href)}
              variant="secondary"
              size="lg"
              external
              trackingEvent="cta_founders_click"
            >
              {content.hero.secondaryCta.label}
            </CTAButton>
          </motion.div>

          {/* Watch VSL prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="mt-20"
          >
            <button
              onClick={scrollToVSL}
              className="group flex flex-col items-center gap-2 text-muted-green hover:text-tan transition-colors duration-300"
            >
              <span className="text-caption font-medium uppercase tracking-widest">
                {content.hero.tertiaryCta.label}
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </motion.div>

          {/* CTA Microtext */}
          {content.hero.ctaMicrotext && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
              className="mt-4 text-caption text-muted-green uppercase tracking-wider"
            >
              {content.hero.ctaMicrotext}
            </motion.p>
          )}
        </div>
      </Container>
    </section>
  );
}
