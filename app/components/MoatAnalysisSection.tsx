'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cross2Icon, CheckIcon, MixIcon } from '@radix-ui/react-icons';

const MoatAnalysisSection = () => {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 1000], [0, 50]);
  
  const comparisons = [
    {
      others: "Teach you how to get attention",
      ttb: "Turn attention into income",
      icon: true
    },
    {
      others: "Focus on growth hacks",
      ttb: "Build sustainable systems",
      icon: true
    },
    {
      others: "Promise viral content",
      ttb: "Deliver paying clients",
      icon: true
    },
    {
      others: "Sell you more courses",
      ttb: "Give you implementation",
      icon: true
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Why Time to Build Works
            <span className="block text-green-600">When Other Programs Don't</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div 
              style={{ y: imageY }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <MixIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Decorative Image</p>
                  <p className="text-sm text-gray-500">A man sitting at a desk with a microphone and computer</p>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-100 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-100 rounded-full opacity-50 blur-xl"></div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-gray-600 mb-8">
              You might be wondering... what makes these results possible when so many other programs fail?
            </p>
            
            <p className="text-xl font-bold text-gray-900 mb-6">
              Here's the difference:
            </p>

            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex items-center gap-3 bg-red-50 rounded-lg p-3">
                      <Cross2Icon className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-gray-700">{item.others}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                      <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">{item.ttb}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-600"
            >
              <p className="text-lg text-gray-800 font-medium mb-2">
                The Bottom Line:
              </p>
              <p className="text-gray-700">
                Tips don't build systems. Growth hacks don't build businesses. 
                And audience size means nothing without a strategy behind it.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MoatAnalysisSection;
