'use client';

import React from 'react';
import { motion } from 'framer-motion';
import content from '@/app/content/z21.json';

export default function ProofWall() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-white text-center mb-12"
        >
          {content.proofWall.title}
        </motion.h2>

        {/* Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {content.proofWall.metrics.map((metric, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-emerald/10 text-white rounded-full text-sm font-medium"
            >
              {metric}
            </span>
          ))}
        </motion.div>

        {/* Proof Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {content.proofWall.items.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative border border-rust/20 rounded-lg p-6 bg-paper/5 backdrop-blur-sm hover:bg-paper/10 transition-colors"
            >
              {/* Badge */}
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-rust text-paper rounded-full text-sm font-bold">
                {item.badge}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-white/80 mb-4">{item.result}</p>

              {/* Attribution */}
              <div className="flex items-center gap-3 pt-4 border-t border-rust/10">
                <div className="w-8 h-8 rounded-full bg-emerald/20" />
                <span className="text-sm text-white/60">{item.by}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
