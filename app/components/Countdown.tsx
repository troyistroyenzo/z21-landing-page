'use client';

import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import Logo from './ui/Logo';

const targetDate = new Date('2025-01-31T23:59:59');

function getTimeLeft() {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-emerald-900 text-white py-3 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left Section - Logo and Cohort Info */}
          <div className="flex items-center gap-4">
            <Logo width={28} height={28} className="w-7 h-7 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-xs font-medium text-white uppercase tracking-wide whitespace-nowrap">
                NEXT COHORT OPENS ON <span className="text-yellow-400 font-bold">JANUARY 31</span>
              </span>
              <span className="text-xs text-gray-300 uppercase tracking-wide hidden lg:inline">
                BY <span className="text-yellow-400 font-bold">APPLICATION ONLY</span> • LIMITED TO <span className="text-yellow-400 font-bold">80 SPOTS</span>
              </span>
            </div>
          </div>

          {/* Center Section - Countdown Timer */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300 uppercase tracking-wide">APPLY BEFORE</span>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-[10px] text-gray-300 uppercase tracking-wider">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] text-gray-300 uppercase tracking-wider">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] text-gray-300 uppercase tracking-wider">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] text-gray-300 uppercase tracking-wider">SECONDS</div>
              </div>
            </div>
            <span className="text-xs text-gray-300 uppercase tracking-wide hidden lg:inline">TO JOIN</span>
          </div>

          {/* Right Section - Apply Button */}
          <div className="flex items-center">
            <Button
              variant="primary"
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 border-yellow-400 hover:border-yellow-500 font-bold uppercase tracking-wide text-xs px-4 py-2"
            >
              APPLY NOW
            </Button>
          </div>
        </div>

        {/* Mobile Layout - Simplified Single Row */}
        <div className="md:hidden flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo width={24} height={24} className="w-6 h-6 flex-shrink-0" />
              <span className="text-[10px] font-medium text-white uppercase">
                JAN 31
              </span>
            </div>
            
            {/* Mobile Countdown */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-base font-bold text-yellow-400">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-[8px] text-gray-300 uppercase">D</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-yellow-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[8px] text-gray-300 uppercase">H</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-yellow-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[8px] text-gray-300 uppercase">M</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[8px] text-gray-300 uppercase">S</div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 border-yellow-400 hover:border-yellow-500 font-bold uppercase text-[10px] px-3 py-1.5"
            >
              APPLY
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
