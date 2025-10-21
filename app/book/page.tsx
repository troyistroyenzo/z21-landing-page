'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function BookPage() {
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
            Book Your 1:1 Discovery Call
          </h1>
          <p className="text-xl text-emerald-200">
            Let's discuss your big objective and design a focused 4-6 week sprint together.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-emerald-900/30 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-tan mb-6">Discovery Call Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-white font-semibold">30 minutes</span>
              <span className="text-gray-400 text-sm">Duration</span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-white font-semibold">This week</span>
              <span className="text-gray-400 text-sm">Available slots</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-white font-semibold">Zoom call</span>
              <span className="text-gray-400 text-sm">Format</span>
            </div>
          </div>

          <div className="text-left space-y-3 text-gray-300">
            <p className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-2">What we'll cover:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-1">•</span>
                <span>Your current situation and main objective</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-1">•</span>
                <span>Identify the highest-leverage problem to solve</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-1">•</span>
                <span>Map out a 4-6 week sprint plan</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 mr-3 mt-1">•</span>
                <span>Discuss deliverables and success metrics</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            className="px-8 py-3 bg-tan text-emerald-900 rounded-lg font-semibold hover:bg-tan/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule Discovery Call
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

        <p className="mt-6 text-sm text-gray-500">
          Not ready yet? DM "COACH" or "1ON1" on social for a quick chat first.
        </p>
      </motion.div>
    </div>
  );
}
