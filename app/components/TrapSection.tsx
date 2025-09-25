'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const TrapSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-12"
          >
            The Trap
            <br />
            <span className="text-red-600">most builders fall into</span>
          </motion.h2>
        </div>

        {/* Content Card with Text Inside */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Image Placeholder Section */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-12">
              <div className="aspect-[16/9] bg-gray-300 rounded-2xl flex items-center justify-center relative">
                <div className="text-center">
                  <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-600 font-medium text-lg mb-2">Image Placeholder</p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto italic">
                    "A founder at a laptop, tabs open: 'offer', 'VSL', 'automation,' staring at a half-finished workflow"
                  </p>
                </div>
                
                {/* Decorative browser tabs */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-16 h-6 bg-gray-400 rounded-t text-xs text-white flex items-center justify-center">offer</div>
                  <div className="w-16 h-6 bg-gray-400 rounded-t text-xs text-white flex items-center justify-center">VSL</div>
                  <div className="w-20 h-6 bg-gray-400 rounded-t text-xs text-white flex items-center justify-center">automation</div>
                </div>
              </div>
            </div>

            {/* Text Content Inside Card */}
            <div className="p-12">
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  You're already doing the work—testing tools, posting, collecting interest.
                </p>
                
                <p className="mb-6">
                  The payoff? Your posts get attention. Your DMs light up.
                </p>
                
                <p className="mb-6">
                  The problem? Your pipeline and revenue don't move.
                </p>
                
                <p className="mb-6">
                  Your reach grows, but your runway doesn't. And your bank account doesn't care how many people liked your build-in-public thread this month.
                </p>
                
                <p className="mb-6">
                  You want to turn interest into customers. Maybe you launched something… and heard crickets. Or you're stuck in pilot mode—unsure how to turn experiments into a product people actually buy.
                </p>
                
                <p className="mb-6">
                  So you keep tweaking, hustling, hoping the next tool will flip the switch…
                </p>
                
                <p className="mb-6 font-semibold">
                  But without a system to turn attention into offers—and pilots into production—every month feels like starting from zero.
                </p>
                
                <p className="mb-6">
                  I see talented founders in this trap. I've been there. It's frustrating. Exhausting. And avoidable.
                </p>
                
                <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                  <p className="text-green-800 font-medium">
                    <strong>The good news?</strong> There's a way out: ship one production workflow and a real offer—so results continue even when you're not posting. A system that works without you… so you stop grinding for relevance and start building something that pays you back.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrapSection;
