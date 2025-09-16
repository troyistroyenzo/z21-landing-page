'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import { X, Check } from 'lucide-react';

export default function ProblemSection() {
  const myths = [
    "You need to be an AI expert to leverage AI",
    "AI will replace your job entirely",
    "Only tech companies can benefit from AI",
    "AI is too complex for small teams"
  ];

  const truths = [
    "AI is a tool that amplifies your existing skills",
    "Human expertise + AI creates unstoppable value",
    "Every industry can apply AI workflows today",
    "Start small with one workflow, scale from there"
  ];

  return (
    <section className="py-24 lg:py-32 gradient-dark">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-deep">
              {/* Placeholder for image */}
              <div className="aspect-[4/5] bg-gradient-to-br from-darker-green to-dark-green">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-8">
                    <p className="text-tan text-display-sm font-heading uppercase tracking-wider mb-4">
                      The Gap
                    </p>
                    <p className="text-off-white/80 text-lg">
                      Between AI potential and production reality
                    </p>
                  </div>
                </div>
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Right: Problem statement and myths/truths */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <h2 className="text-display-sm md:text-display text-off-white font-heading uppercase tracking-wide mb-8">
              The problem isn't you — <br />
              <span className="text-tan">it's your system</span>
            </h2>

            <div className="space-y-6">
              {/* Myths */}
              <div className="space-y-3">
                <p className="text-tan/60 text-sm uppercase tracking-wider">Common Myths</p>
                {myths.map((myth, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <X className="w-5 h-5 text-error-red mt-1 flex-shrink-0" />
                    <p className="text-muted-green line-through opacity-75">
                      {myth}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Truths */}
              <div className="space-y-3">
                <p className="text-tan/60 text-sm uppercase tracking-wider mt-8">The Reality</p>
                {truths.map((truth, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-success-green mt-1 flex-shrink-0" />
                    <p className="text-off-white/90">
                      {truth}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
