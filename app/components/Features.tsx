'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from './Container';
import Section from './Section';
import content from '@/app/content/z21.json';
import CTAButton from './CTAButton';
import { CheckCircle, TrendingUp, Package, Target } from 'lucide-react';
import { interpolateEnv } from '@/lib/utils';

export default function Features() {
  return (
    <>
      {/* What Z21 is */}
      <Section background="paper">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-display text-emerald-950 mb-4">
              {content.whatItIs.title}
            </h2>
            <p className="text-display-sm text-rust mb-8">
              {content.whatItIs.kicker}
            </p>
            <p className="text-body-lg text-emerald-950/80 mb-8">
              {content.whatItIs.copy}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {content.whatItIs.bullets.map((bullet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-rust mt-1 flex-shrink-0" />
                  <p className="text-emerald-950/80">{bullet}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Why you need it */}
      <Section id={content.whyYouNeedIt.id} background="default">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-display text-emerald-950 mb-8">
              {content.whyYouNeedIt.title}
            </h2>
            <div className="space-y-6 mb-8">
              {content.whyYouNeedIt.points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-paper rounded-xl"
                >
                  <TrendingUp className="w-6 h-6 text-rust mt-1 flex-shrink-0" />
                  <p className="text-emerald-950/80 text-lg">{point}</p>
                </motion.div>
              ))}
            </div>
            {content.whyYouNeedIt.note && (
              <p className="text-emerald-950/70 italic p-4 bg-rust/10 rounded-lg">
                {content.whyYouNeedIt.note}
              </p>
            )}
          </motion.div>
        </Container>
      </Section>

      {/* The Z21 Cohort */}
      <Section id={content.cohort.id} background="emerald">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-display text-white mb-4">
                {content.cohort.title}
              </h2>
              <p className="text-display-sm text-rust">
                {content.cohort.subtitle}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Outcomes */}
              <div className="bg-paper/10 backdrop-blur rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {content.cohort.outcomesTitle}
                </h3>
                <div className="space-y-4">
                  {content.cohort.outcomes.map((outcome, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Target className="w-5 h-5 text-rust mt-1 flex-shrink-0" />
                      <p className="text-white/80">{outcome}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div className="bg-paper/10 backdrop-blur rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {content.cohort.includesTitle}
                </h3>
                <div className="space-y-4">
                  {content.cohort.includes.map((include, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Package className="w-5 h-5 text-rust mt-1 flex-shrink-0" />
                      <p className="text-white/80">{include}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                href={interpolateEnv(content.cohort.ctaPrimary.href)}
                variant="primary"
                size="lg"
                external
                trackingEvent="cohort_apply_cta"
              >
                {content.cohort.ctaPrimary.label}
              </CTAButton>
              <CTAButton
                href={interpolateEnv(content.cohort.ctaSecondary.href)}
                variant="tertiary"
                size="lg"
                external
                trackingEvent="cohort_founders_cta"
              >
                {content.cohort.ctaSecondary.label}
              </CTAButton>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* What you get */}
      <Section background="paper">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-display text-emerald-950 mb-12 text-center">
              {content.whatYouGet.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {content.whatYouGet.grid.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-emerald-950/10"
                >
                  <h3 className="text-xl font-bold text-emerald-950 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-emerald-950/70">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
