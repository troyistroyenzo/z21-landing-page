'use client';

import React from 'react';
import Image from 'next/image';
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
          <div className="relative bg-#F5EFE6 rounded-3xl p-8 ">
            {/* Product Image Placeholder */}
            <div className="aspect-[16/10] bg-#F5EFE6 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden">
              <Image 
                src="https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/ef842d96-0afc-4092-8210-6ddfd2eea3f6.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZWY4NDJkOTYtMGFmYy00MDkyLTgyMTAtNmRkZmQyZWVhM2Y2LnBuZyIsImlhdCI6MTc1ODc3MzIxMSwiZXhwIjoxNzkwMzA5MjExfQ.SfDUv0qcAhsF8ALuBZlphUTm1x7awTdweiG2gCJy_vY"
                alt="Z21 Program Dashboard"
                fill
                className="object-cover"
                priority
              />
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
