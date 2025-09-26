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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              WHAT HAPPENS WHEN YOU HAVE THE{' '}
              <span className="text-green-600">IDEAS</span>
              <br />
              BUT NO SYSTEM TO SHIP A STARTUP?
            </h2>

            {/* Grey Divider */}
            <div className="w-full border-b border-gray-400/30 mb-8"></div>

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
            viewport={{ once: true, margin: '-200px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Actual Image */}
              <img 
                src="https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/DSC02916.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvRFNDMDI5MTYuanBnIiwiaWF0IjoxNzU4NzcwNzQ4LCJleHAiOjE3OTAzMDY3NDh9.TrJCKhG6Ee3WQkGeDr3IiDuE_zuTcWK671fkXYXuC3A"
                alt="Startup founder working"
                className="aspect-square w-full object-cover rounded-xl"
              />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PainPointSection;
