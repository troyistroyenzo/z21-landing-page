'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#0C1816] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Z21 Cohort Application
          </h1>
          <p className="text-xl text-emerald-200">
            Application portal coming soon. Join the waitlist to be notified when applications open.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-emerald-900/30 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-tan mb-4">What Happens Next</h2>
          <ul className="text-left space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-emerald-400 mr-3 mt-1">1.</span>
              <span>You'll receive an email when applications open for the next cohort</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 mr-3 mt-1">2.</span>
              <span>Complete the application form with your goals and current situation</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 mr-3 mt-1">3.</span>
              <span>We'll review and respond within 48 hours</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-400 mr-3 mt-1">4.</span>
              <span>If accepted, you'll receive onboarding materials and cohort details</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            className="px-8 py-3 bg-tan text-emerald-900 rounded-lg font-semibold hover:bg-tan/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Waitlist
          </motion.button>

          <Link href="/#offers">
            <motion.button
              className="px-8 py-3 bg-transparent text-emerald-300 border border-emerald-700 rounded-lg font-semibold hover:bg-emerald-900/20 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Offers
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
