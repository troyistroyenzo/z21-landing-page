'use client';

import React from 'react';
import { motion } from 'framer-motion';
import content from '@/app/content/z21.json';
import { ArrowRight } from 'lucide-react';

export default function MechanismSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="py-20 bg-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-emerald-950 text-center mb-16"
        >
          {content.mechanism.title}
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 items-center"
        >
          {content.mechanism.steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-emerald/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-emerald-950 mb-2">
                  {step.h}
                </h3>
                <p className="text-emerald-950/70">{step.p}</p>
              </motion.div>

              {/* Arrow between steps */}
              {index < content.mechanism.steps.length - 1 && (
                <motion.div
                  variants={itemVariants}
                  className="hidden md:flex justify-center"
                >
                  <ArrowRight className="w-8 h-8 text-rust" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
