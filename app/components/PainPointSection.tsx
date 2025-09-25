'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cross2Icon } from '@radix-ui/react-icons';

const PainPointSection = () => {
  const painPoints = [
    'You keep tinkering with AI tools. You keep posting.',
    'But your pipeline stays flat.',
    'You don\'t need a bigger audience.',
    'You don\'t need to post daily.',
    'You don\'t need another app or course.',
    'You don\'t need more "AI pilots."',
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
              WHAT HAPPENS WHEN YOU HAVE THE{' '}
              <span className="text-green-600">IDEAS</span>
              <br />
              BUT NO SYSTEM TO SHIP A STARTUP?
            </h2>

            {/* Pain Points List */}
            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 mt-1 bg-red-50 rounded-full flex items-center justify-center border border-red-200 group-hover:bg-red-100 transition-colors duration-200">
                    <Cross2Icon className="w-3 h-3 text-red-500" />
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Image Holder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              {/* Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <Cross2Icon className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 font-medium">Image Placeholder</p>
                  <p className="text-sm text-gray-400 mt-1">Replace with actual image</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Cross2Icon className="w-4 h-4 text-red-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <Cross2Icon className="w-3 h-3 text-red-400" />
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-8 left-8 w-full h-full bg-red-50 rounded-2xl opacity-50"></div>
              <div className="absolute top-16 left-16 w-full h-full bg-red-100 rounded-2xl opacity-30"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PainPointSection;
