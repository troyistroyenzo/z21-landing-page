'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@radix-ui/react-icons';

const SolutionSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-green-600 mb-6">
              Zero to One
            </h2>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              A 6-week program that turns founders from AI-overwhelmed tinkerers into operators— 
              with a live offer and production workflows that scale without you.
            </p>
          </motion.div>
        </div>

        {/* Product Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 shadow-2xl border border-green-200">
            {/* Product Image Placeholder */}
            <div className="aspect-[16/10] bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckIcon className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Product Preview</h3>
                <p className="text-gray-500 font-medium">Z21 Program Dashboard</p>
                <p className="text-sm text-gray-400 mt-2">Replace with actual product screenshot/mockup</p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 left-6 w-4 h-4 bg-green-200 rounded-full opacity-60"></div>
              <div className="absolute top-6 right-6 w-3 h-3 bg-green-300 rounded-full opacity-40"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-green-400 rounded-full opacity-50"></div>
              <div className="absolute bottom-6 right-6 w-5 h-5 bg-green-100 rounded-full opacity-70"></div>
            </div>

            {/* Floating Success Icons */}
            <div className="absolute -top-4 left-1/4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-2 right-1/3 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-md border-4 border-white">
              <CheckIcon className="w-3 h-3 text-white" />
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <CheckIcon className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Background Glow Effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-green-200 rounded-3xl opacity-20 blur-3xl transform scale-110"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
