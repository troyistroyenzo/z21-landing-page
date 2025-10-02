'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GearIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

const RealProblemSection = () => {
  return (
    <section className="py-24 bg-background">
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
            <div className="prose prose-lg max-w-none text-white space-y-6">
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
            <div className="relative">
              {/* Vertical Image Placeholder */}
              <div className="aspect-[16/9] relative rounded-xl overflow-hidden">
  <Image
    src="https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/DSC05796.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvRFNDMDU3OTYuanBnIiwiaWF0IjoxNzU5Mzc0ODQ3LCJleHAiOjE3OTA5MTA4NDd9.7ECIKPJo7Yes3hy-JhfXNyxqbeXCiEYlLA7IUpMkMfM"
    alt="Z21 Program Dashboard"
    fill
    className="object-cover rounded-xl"
    priority
  />
</div>

             
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RealProblemSection;
