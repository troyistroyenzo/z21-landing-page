'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import content from '@/app/content/z21.json';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FinalCTA() {
  // Use consistent href value to prevent hydration mismatch
  const [ctaHref, setCtaHref] = useState('#');
  
  useEffect(() => {
    // Only access environment variables on the client
    const envUrl = process.env.NEXT_PUBLIC_COHORT_URL || '#';
    setCtaHref(envUrl);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-off-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-display-sm md:text-display text-dark-green font-heading uppercase tracking-wide mb-6">
            Ready to build <br />
            <span className="text-tan">your business?</span>
          </h2>

          <p className="text-body-lg text-muted-green mb-10 leading-relaxed">
            Join the next Z21 Cohort and transform from AI-curious to AI-powered 
            in just 6 weeks. Limited spots available.
          </p>

          <button
            disabled
            className="inline-block px-12 py-5 bg-gray-600 text-gray-300 font-heading font-bold text-lg uppercase tracking-wider rounded-lg cursor-not-allowed opacity-70"
          >
            Coming Soon
          </button>

        </motion.div>
      </Container>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-tan/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-dark-green/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
