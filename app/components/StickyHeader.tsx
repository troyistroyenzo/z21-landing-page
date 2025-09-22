'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { interpolateEnv } from '@/lib/utils';
import content from '@/app/content/z21.json';

export default function StickyHeader() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set countdown target (e.g., 7 days from now for cohort start)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-green border-b border-tan/20"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center h-16 divide-x divide-tan/20">
          {/* Logo and notices section */}
          <div className="flex items-center gap-6 px-6">
            <Link href="/" className="text-off-white font-heading font-bold text-xl tracking-wider">
              Z21
            </Link>
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-tan text-caption uppercase tracking-wide">
                Next Cohort Jan 2025
              </span>
              <span className="text-muted-green text-caption uppercase tracking-wide">
                • Limited Spots
              </span>
            </div>
          </div>

          {/* Countdown timer section */}
          <div className="hidden md:flex items-center gap-6 px-6">
            <div className="flex items-center gap-4">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-off-white text-2xl font-heading font-bold tabular-nums">
                    {formatNumber(item.value)}
                  </div>
                  <div className="text-tan/60 text-[10px] uppercase tracking-wider mt-0.5">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA section */}
          <div className="flex-1 flex items-center justify-end px-6">
            <Link
              href={interpolateEnv(content.hero.primaryCta.href)}
              className="px-6 py-2.5 bg-tan text-dark-green font-heading font-bold text-sm uppercase tracking-wider rounded hover:bg-tan/90 transition-all"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
