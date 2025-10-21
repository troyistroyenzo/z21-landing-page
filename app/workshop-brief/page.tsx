'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Zap, Building } from 'lucide-react';
import Link from 'next/link';

export default function WorkshopBriefPage() {
  return (
    <div className="min-h-screen bg-[#0C1816] flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full text-center"
      >
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Request Your Team Workshop Brief
          </h1>
          <p className="text-xl text-emerald-200">
            Install 1-2 production workflows with your team. Get a custom brief tailored to your needs.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-emerald-900/30 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-tan mb-6">Workshop Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-left space-y-4">
              <div className="flex items-start">
                <Users className="w-6 h-6 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Team Focus</span>
                  <span className="text-gray-400 text-sm">Finance, Ops, Sales, Marketing, Product/IT teams</span>
                </div>
              </div>
              <div className="flex items-start">
                <Target className="w-6 h-6 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Custom Tailored</span>
                  <span className="text-gray-400 text-sm">Topics adapted to your team's specific needs</span>
                </div>
              </div>
            </div>
            
            <div className="text-left space-y-4">
              <div className="flex items-start">
                <Zap className="w-6 h-6 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold block">Quick Implementation</span>
                  <span className="text-gray-400 text-sm">1-2 days to production workflows</span>
                </div>
              </div>
              <div className="flex items-start">
                <Building className="w-6 h-6 text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold block">On-site Option</span>
                  <span className="text-gray-400 text-sm">Live, face-to-face sessions available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-900/20 pt-6">
            <p className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3">What you'll build:</p>
            <div className="text-left space-y-2 text-gray-300">
              <div className="flex items-start">
                <span className="text-emerald-400 mr-3">✓</span>
                <span>TCREI + RSTI prompting frameworks</span>
              </div>
              <div className="flex items-start">
                <span className="text-emerald-400 mr-3">✓</span>
                <span>Human-in-the-loop workflow design</span>
              </div>
              <div className="flex items-start">
                <span className="text-emerald-400 mr-3">✓</span>
                <span>Quick-win production workflows</span>
              </div>
              <div className="flex items-start">
                <span className="text-emerald-400 mr-3">✓</span>
                <span>Custom GPT blueprint for your team</span>
              </div>
              <div className="flex items-start">
                <span className="text-emerald-400 mr-3">✓</span>
                <span>Impact scoreboard to track ROI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-900/20 rounded-xl border border-emerald-800/30 p-6 mb-8">
          <p className="text-sm text-emerald-300 mb-2">Variable Pricing</p>
          <p className="text-gray-300">
            Workshop pricing depends on team size, scope, and delivery format. 
            Request a brief to get a custom quote for your specific needs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            className="px-8 py-3 bg-tan text-emerald-900 rounded-lg font-semibold hover:bg-tan/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Request Workshop Brief
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
          Quick question? DM "BUILD" or "TEAM" on social to start a conversation.
        </p>
      </motion.div>
    </div>
  );
}
