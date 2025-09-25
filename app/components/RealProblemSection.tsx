'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GearIcon } from '@radix-ui/react-icons';

const RealProblemSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left Side - Content (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              The Real Problem
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-8 leading-tight">
              Isn&apos;t Your Idea.
              <br />
              It&apos;s Your System.
            </h3>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Most zero→one efforts don&apos;t stall from lack of talent. They stall because the system is wrong.
              </p>
              
              <p>
                We build visibility instead of value. We stack tools instead of workflows. We create motion—but nothing compounds.
              </p>
              
              <p>
                We think &ldquo;more content&rdquo; or &ldquo;another AI app&rdquo; is the answer. But content without clarity is noise. And an AI pilot without production is a demo.
              </p>
              
              <p>
                If your revenue depends on your personal output, you don&apos;t have leverage—you have a treadmill. The moment you rest, momentum disappears.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-400">
                <p className="font-semibold text-gray-800">
                  The truth is simple: Content is how people find you. Business is what happens after they do.
                </p>
              </div>
              
              <p>
                If you don&apos;t have a system that turns attention → trust → a premium offer—and installs one workflow in production to deliver consistently—you&apos;re not building a company. You&apos;re renting momentum.
              </p>
              
              <div className="bg-green-50 p-8 rounded-xl border-l-4 border-green-500">
                <p className="text-green-800 font-semibold mb-4">
                  <strong>Z21 fixes the system: identity → system → proof.</strong>
                </p>
                <p className="text-green-700">
                  Offer live, 90-sec VSL, 2+ qualified calls, and one production AI workflow in 6 weeks—so you finally move from tinkering to operating.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Vertical Image (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-xl border border-gray-200">
              {/* Vertical Image Placeholder */}
              <div className="aspect-[3/4] bg-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <GearIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-600 font-medium mb-2">Vertical Image</p>
                  <p className="text-sm text-gray-500">System visualization</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <GearIcon className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RealProblemSection;
