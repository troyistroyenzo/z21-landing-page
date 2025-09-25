'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightIcon, LightningBoltIcon, PersonIcon, TargetIcon } from '@radix-ui/react-icons';
import Button from './ui/Button';

const Hero = () => {
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 500], ['0%', '20%']);
  const contentY = useTransform(scrollY, [0, 500], ['0%', '-10%']);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6]);
  
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
          backgroundPosition: 'right center',
          y: backgroundY,
        }}
      />
      {/* Mobile background position adjustment */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            background-position: 75% center !important;
          }
        }
      `}</style>
      
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center w-full px-4 md:px-6 py-32 mt-24"
        style={{ y: contentY, opacity }}
      >
        {/* Container for desktop right alignment and mobile centering */}
        <div className="w-full max-w-7xl mx-auto flex justify-center md:justify-end">
          <div className="w-full md:w-[65%] lg:w-[60%] text-center md:text-right">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-green-50 text-green-700 mb-6 md:mb-8 shadow-green border border-green-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Cohort 3 opens January 2025
            </motion.div>

            {/* Main Headline with Georgia/Saaseriescd font */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-balance mb-6 leading-tight text-white font-SAASeriesCD"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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

            {/* Subtitle with Helvetica/Inter font */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/80 text-balance mb-8 md:mb-12 leading-relaxed px-4 md:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Install one production AI workflow, publish a 90s VSL, launch an offer page, 
              and book 2+ qualified calls in 6 weeks.
            </motion.p>

            {/* CTA Buttons - centered on mobile */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 mb-12 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                variant="primary" 
                size="lg" 
                className="group bg-gold hover:bg-gold/90 text-white border-gold hover:border-gold/90 w-full sm:w-auto"
                style={{ backgroundColor: '#C4A27A' }}
              >
                Apply for Cohort 3
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

            {/* Stats - centered on mobile */}
            <motion.div
              className="flex items-center justify-center md:justify-end gap-6 sm:gap-8 md:gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-700/20 rounded-xl text-green-200 shadow-green group-hover:bg-green-700/30 group-hover:shadow-green-lg transition-all duration-200">
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70 font-inter">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Elements with Parallax */}
      <motion.div
        className="absolute top-1/4 left-12 w-3 h-3 bg-accent rounded-full opacity-60 hidden md:block"
        style={{ y: useTransform(scrollY, [0, 500], ['0%', '50%']) }}
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-12 w-2 h-2 bg-success rounded-full opacity-40 hidden md:block"
        style={{ y: useTransform(scrollY, [0, 500], ['0%', '-30%']) }}
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-30 hidden md:block"
        style={{ y: useTransform(scrollY, [0, 500], ['0%', '40%']) }}
        animate={{ x: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </section>
  );
};

export default Hero;
