'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function B2BScrollIndicator() {
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', label: 'Intro' },
    { id: 'promise', label: 'Promise' },
    { id: 'audience', label: 'Who' },
    { id: 'curriculum', label: 'What' },
    { id: 'case-studies', label: 'Cases' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'cta', label: 'Apply' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          const absoluteBottom = bottom + window.scrollY;

          if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block"
    >
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group flex items-center justify-end gap-3"
            whileHover={{ x: -5 }}
          >
            {/* Label */}
            <span
              className={`text-xs font-medium transition-all duration-300 ${
                activeSection === section.id
                  ? 'text-emerald-400 opacity-100 translate-x-0'
                  : 'text-gray-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {section.label}
            </span>

            {/* Dot */}
            <motion.div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'w-8 bg-emerald-400'
                  : 'bg-emerald-700/50 group-hover:bg-emerald-600'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          </motion.button>
        ))}
      </div>

      {/* Progress Line */}
      <div className="absolute right-1 top-0 bottom-0 w-px bg-emerald-800/30">
        <motion.div
          className="w-full bg-emerald-400"
          style={{
            height: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
