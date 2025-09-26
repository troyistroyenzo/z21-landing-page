'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckIcon, DiscordLogoIcon, VideoIcon, ReaderIcon, PersonIcon, CalendarIcon, LightningBoltIcon } from '@radix-ui/react-icons';

const WhatYouGetSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);

  const features = [
    {
      icon: <VideoIcon className="w-5 h-5" />,
      title: "Weekly Live Calls",
      description: "90-minute implementation sessions every Thursday"
    },
    {
      icon: <DiscordLogoIcon className="w-5 h-5" />,
      title: "Private Community",
      description: "24/7 access to founders building alongside you"
    },
    {
      icon: <ReaderIcon className="w-5 h-5" />,
      title: "Complete Curriculum",
      description: "Step-by-step modules with templates and SOPs"
    },
    {
      icon: <PersonIcon className="w-5 h-5" />,
      title: "1:1 Support",
      description: "Direct access to coaches for personalized help"
    },
    {
      icon: <CalendarIcon className="w-5 h-5" />,
      title: "Lifetime Updates",
      description: "All future content and program improvements"
    },
    {
      icon: <LightningBoltIcon className="w-5 h-5" />,
      title: "Fast-Track Resources",
      description: "Pre-built templates, scripts, and workflows"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">
            What You Get
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-600">
            Inside Time to Build
          </h3>
        </motion.div>

        <motion.div style={{ y }} className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-600 mr-4 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Central highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 shadow-2xl"
          >
            <h4 className="text-2xl font-bold mb-4">Everything You Need to Launch</h4>
            <p className="text-lg opacity-90 mb-6">
              No fluff. No theory. Just proven systems that work.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-2" />
                <span>6-Week Program</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-2" />
                <span>Live Support</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-2" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
