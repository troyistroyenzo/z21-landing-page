'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EnvelopeOpenIcon } from '@radix-ui/react-icons';

const TomLetterSection = () => {
  return (
    <section className="py-24 bg-emerald-900">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full mb-6">
            <EnvelopeOpenIcon className="w-8 h-8 text-yellow-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            A Letter From Tom:
          </h2>
          <p className="text-2xl md:text-3xl text-yellow-400/90 font-medium">
            How I Learned This The Hard Way
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-emerald-950/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-emerald-700/30"
        >
          <p className="text-xl text-emerald-100 leading-relaxed mb-6">
            <span className="text-3xl font-bold text-yellow-400">"</span>
            Content will be populated here. This section will contain Tom's personal story and journey 
            that led to creating this program. It will be an authentic, vulnerable share about the struggles 
            and breakthroughs that shaped the Zero to One methodology.
            <span className="text-3xl font-bold text-yellow-400">"</span>
          </p>
          
          <div className="border-t border-emerald-700/30 pt-6 mt-8">
            <p className="text-emerald-300 italic">— Tom, Founder of Zero to One</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TomLetterSection;
