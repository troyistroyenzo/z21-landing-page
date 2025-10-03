'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightIcon, LightningBoltIcon, PersonIcon, TargetIcon } from '@radix-ui/react-icons';
import Button from './ui/Button';

const Hero = () => {
  const { scrollY } = useScroll();
  
  // Optimized parallax transforms for mobile performance
  const backgroundY = useTransform(scrollY, [0, 800], ['0%', '15%']);
  const contentY = useTransform(scrollY, [0, 600], ['0%', '-5%']);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.8]);
  
  const stats = [
    { icon: <LightningBoltIcon className="w-5 h-5" />, value: '6', label: 'Weeks' },
    { icon: <PersonIcon className="w-5 h-5" />, value: '20+', label: 'Founders' },
    { icon: <TargetIcon className="w-5 h-5" />, value: '90%', label: 'Success Rate' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center md:bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/_R655433.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvX1I2NTU0MzMuanBnIiwiaWF0IjoxNzU4NzY1Mzc1LCJleHAiOjE3OTAzMDEzNzV9.hhiKdRf-H2t5XPjSS3Qn3wqJ183rfUqkvbbtDW5Kpsw')",
          backgroundPosition: '-10rem',
          y: backgroundY,
        }}
      />
      {/* Mobile background position adjustment */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            background-position: 55% center !important;
          }
        }
      `}</style>
      
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center w-full px-4 md:px-6 py-32 mt-24"
        style={{ y: contentY, opacity }}
      >
        {/* Container for desktop right alignment and mobile centering */}
        <div className="w-full max-w-7xl mx-auto flex justify-start md:justify-end">
          <div className="w-full md:w-[65%] lg:w-[60%] text-left md:text-right">
            {/* Badge */}
            

            {/* Main Headline with improved mobile font sizing */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-balance mb-6 leading-[1.1] text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ willChange: 'transform' }}
            >
              Build Your Startup from{' '}
              <motion.span
                className="inline-block relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.span
                  className="inline-block zero-to-one-text"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                  }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.8, 
                    ease: "easeIn",
                  }}
                >
                  Zero to One
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Subtitle with better mobile sizing */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 text-balance mb-8 md:mb-12 leading-relaxed px-2 md:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ willChange: 'transform' }}
            >

              Leverage AI, lean startup, and personal brand frameworks to ship a real offer and one production workflow.
            </motion.p>

            {/* CTA Buttons - centered on mobile */}
            <motion.div
  className="flex flex-col sm:flex-row items-start justify-start md:justify-end gap-4 mb-12 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                variant="primary" 
                size="lg" 
                className="group bg-gold hover:bg-gold/90 text-white border-gold hover:border-gold/90 w-full sm:w-auto"
                style={{ backgroundColor: '#AE9370' }}
              >
                Learn More
                <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
              >
                Watch Demo
              </Button>
            </motion.div>

  
          </div>
        </div>
      </motion.div>

      {/* Floating Elements - Hidden on mobile for performance */}
    </section>
  );
};

export default Hero;
