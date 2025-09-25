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
          className="relative max-w-7xl mx-auto"
        >
          <div className="relative bg-#F5EFE6 rounded-3xl p-4 md:p-6 lg:p-8">
            {/* Product Image Placeholder - Increased Size */}
            <div className="aspect-[16/9] md:aspect-[16/10] bg-#F5EFE6 relative overflow-hidden">
              <Image 
                src="https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/f7fd4d46-2bed-491b-a4c3-c33f0db3adb5.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvZjdmZDRkNDYtMmJlZC00OTFiLWE0YzMtYzMzZjBkYjNhZGI1LnBuZyIsImlhdCI6MTc1ODc3NzAyNSwiZXhwIjoxNzkwMzEzMDI1fQ._WbDvasTorIvVudnbtKYH7yyt8eNJ9d93R4QPqMKoW4"
                alt="Z21 Program Dashboard"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Enhanced Background Glow Effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-green-200 rounded-3xl opacity-20 blur-3xl transform scale-125"></div>
            <div className="absolute inset-0 bg-emerald-300 rounded-3xl opacity-10 blur-2xl transform scale-110"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
