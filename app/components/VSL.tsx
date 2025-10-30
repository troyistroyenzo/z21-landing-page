'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from './ui/Button';

const VSL = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="vsl" ref={sectionRef} className="py-24 bg-#9FA3A2s">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-800 text-emerald-200 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
            Full Live Recording
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            See the transformation in action
          </h2>
          
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto text-balance">
            Watch how founders like you build profitable AI businesses from zero to one.
          </p>
        </motion.div>

        {/* Video Player */}
        <motion.div
          className="relative w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* YouTube Video */}
            <iframe
              className="w-full aspect-video"
              style={{ width: '100%', height: '100%' }}
              src="https://www.youtube.com/embed/zZibCk4ZqHE?rel=0&modestbranding=1&color=white"
              title="Zero to One Startup Transformation"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Stats */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center mt-6 gap-3 sm:space-x-8 text-sm text-emerald-300 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              Watch full live recording of “The Art of Personal Branding”
            </div>
            <div>See exactly how my workshops run, end‑to‑end</div>
          </motion.div>
        </motion.div>

        {/* CTA Below Video */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
        </motion.div>
      </div>
    </section>
  );
};

export default VSL;
