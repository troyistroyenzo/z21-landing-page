'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, LightningBoltIcon, PersonIcon, TargetIcon } from '@radix-ui/react-icons';
import Button from './ui/Button';

const Hero = () => {
  const stats = [
    { icon: <LightningBoltIcon className="w-5 h-5" />, value: '6', label: 'Weeks' },
    { icon: <PersonIcon className="w-5 h-5" />, value: '20+', label: 'Founders' },
    { icon: <TargetIcon className="w-5 h-5" />, value: '90%', label: 'Success Rate' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-6 py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-green-50 text-green-700 mb-8 shadow-green border border-green-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Cohort 3 opens January 2025
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-balance mb-6 leading-tight"
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

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-600 text-balance mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Install one production AI workflow, publish a 90s VSL, launch an offer page, 
            and book 2+ qualified calls in 6 weeks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button variant="primary" size="lg" className="group">
              Apply for Cohort 3
              <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="ghost" size="lg">
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center justify-center gap-8 md:gap-12"
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
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-50 rounded-xl text-green-600 shadow-green group-hover:bg-green-100 group-hover:shadow-green-lg transition-all duration-200">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-12 w-3 h-3 bg-accent rounded-full opacity-60"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-12 w-2 h-2 bg-success rounded-full opacity-40"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-30"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </section>
  );
};

export default Hero;
