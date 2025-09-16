'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import content from '@/app/content/z21.json';

export default function StorySection() {
  return (
    <section className="py-24 lg:py-32 bg-off-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Story content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-display-sm md:text-display text-dark-green font-heading uppercase tracking-wide mb-8">
              How I learned this <br />
              <span className="text-tan">the hard way</span>
            </h2>
            
            <div className="space-y-4 text-muted-green">
              <p className="text-lg leading-relaxed">
                After years of watching founders struggle with the same AI adoption patterns, 
                I realized the problem wasn't technology — it was translation.
              </p>
              
              <p className="leading-relaxed">
                Teams knew AI could help. They saw the demos, read the case studies, 
                hired consultants. But when Monday morning came, they still didn't know 
                where to start or how to make it stick.
              </p>
              
              <p className="leading-relaxed">
                {content.whyYouNeedIt.note}
              </p>
              
              <p className="text-lg font-medium text-dark-green mt-6">
                That's when Z21 was born — a bridge between potential and production, 
                delivered through proven workflows you can install immediately.
              </p>
            </div>
          </motion.div>

          {/* Right: Portrait/Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              {/* Placeholder for portrait */}
              <div className="aspect-[3/4] bg-gradient-to-br from-dark-green to-darker-green">
                <div className="absolute inset-0 flex items-end justify-center pb-12">
                  <div className="text-center">
                    <p className="text-off-white/80 text-sm uppercase tracking-wider mb-2">
                      Founded by
                    </p>
                    <p className="text-tan text-2xl font-heading uppercase tracking-wide">
                      Z21 Team
                    </p>
                  </div>
                </div>
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -z-10 -top-8 -right-8 w-32 h-32 bg-tan/10 rounded-full blur-2xl" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-40 h-40 bg-dark-green/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
