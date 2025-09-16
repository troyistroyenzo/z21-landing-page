'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import content from '@/app/content/z21.json';
import { CheckCircle } from 'lucide-react';

export default function DifferentiatorsSection() {
  const differentiators = [
    'Personal connection over virality',
    'Human-in-the-loop by design',
    'Privacy-safe defaults',
    'Ship in public methodology',
    'Lifetime community access'
  ];

  return (
    <section className="py-24 lg:py-32 bg-off-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Differentiators list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-display-sm md:text-display text-dark-green font-heading uppercase tracking-wide mb-8">
              What makes us <br />
              <span className="text-tan">Different</span>
            </h2>
            
            <div className="space-y-4">
              {differentiators.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-tan flex-shrink-0" />
                  <p className="text-lg text-muted-green">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-muted-green leading-relaxed">
              {content.whyYouNeedIt.note}
            </p>
          </motion.div>

          {/* Right: Full-bleed image with overlay text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <div className="absolute inset-0 lg:-right-20 rounded-2xl overflow-hidden shadow-deep">
              <div className="relative h-full gradient-dark">
                {/* Overlay text */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-wider text-tan text-center leading-tight">
                    Personal <br />
                    Connection <br />
                    Over <br />
                    Virality
                  </h3>
                </div>

                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-tan/10 via-transparent to-transparent" />
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #b19d7c 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
