'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Container from './Container';
import { AlertCircle } from 'lucide-react';

export default function ProblemSection() {
  const macroProblemPoints = [
    "Optimizing for content output, not offer throughput",
    "Pilots never cross to production workflows",
    "Data silos break handoffs weekly",
    "Revenue stops when you stop"
  ];

  return (
    <section className="py-16 lg:py-20 gradient-dark">
      <Container>
        {/* Macro Problem - Condensed */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-display-sm md:text-display text-off-white font-heading uppercase tracking-wide mb-4">
              The blocker isn't talent — <span className="text-tan">it's your system</span>
            </h2>
            <p className="text-lg text-muted-green/80">
              Visibility without velocity. Tools without workflows.
            </p>
          </motion.div>

          {/* Compact Macro Points Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-3 mb-8"
          >
            {macroProblemPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 bg-darker-green/30 border border-dark-green/30 rounded-lg p-4"
              >
                <AlertCircle className="w-4 h-4 text-tan flex-shrink-0" />
                <p className="text-off-white/90 text-sm">{point}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Punchline - Smaller */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center bg-gradient-to-r from-dark-green/30 to-darker-green/30 border border-tan/20 rounded-lg p-6"
          >
            <p className="text-lg text-off-white">
              Content finds you. <span className="text-tan font-medium">Systems deliver value on repeat.</span>
            </p>
          </motion.div>

          {/* Z21 Frame - Compact */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 border border-tan/20 rounded-lg p-4"
          >
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-tan text-sm font-medium">Identity</p>
                <p className="text-off-white/70 text-xs">Clear premium promise</p>
              </div>
              <div>
                <p className="text-tan text-sm font-medium">System</p>
                <p className="text-off-white/70 text-xs">AI-assisted workflow</p>
              </div>
              <div>
                <p className="text-tan text-sm font-medium">Proof</p>
                <p className="text-off-white/70 text-xs">2+ calls/week, shipped</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
