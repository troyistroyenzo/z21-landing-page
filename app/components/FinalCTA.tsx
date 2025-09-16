'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import content from '@/app/content/z21.json';
import { interpolateEnv } from '@/lib/utils';
import Link from 'next/link';

export default function FinalCTA() {
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

          <Link
            href={interpolateEnv(content.hero.primaryCta.href)}
            className="inline-block px-12 py-5 bg-tan text-dark-green font-heading font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-tan/90 transition-all transform hover:scale-105 shadow-card hover:shadow-deep"
          >
            {content.hero.primaryCta.label}
          </Link>

          {/* Social proof */}
          <div className="mt-16 pt-16 border-t border-dark-green/10">
            <p className="text-sm text-muted-green/60 uppercase tracking-wider mb-4">
              Join founders from
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {['Google', 'Meta', 'OpenAI', 'Stripe', 'Y Combinator'].map((company) => (
                <span key={company} className="text-dark-green/40 font-medium">
                  {company}
                </span>
              ))}
            </div>
          </div>
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
