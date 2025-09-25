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
    <section className="w-full bg-emerald-900 text-white py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Section - Logo and Cohort Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Logo width={32} height={32} className="w-8 h-8" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-white uppercase tracking-wide">
                NEXT COHORT OPENS ON <span className="text-yellow-400 font-bold">JANUARY 31</span>
              </span>
              <span className="text-sm text-gray-300 uppercase tracking-wide">
                BY <span className="text-yellow-400 font-bold">APPLICATION ONLY</span> • LIMITED TO <span className="text-yellow-400 font-bold">80 SPOTS</span>
              </span>
            </div>
          </div>

          {/* Center Section - Countdown Timer */}
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-300 uppercase tracking-wide mr-4">APPLY BEFORE</span>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider">SECONDS</div>
              </div>
            </div>
            <span className="text-sm text-gray-300 uppercase tracking-wide ml-4">TO JOIN</span>
          </div>

          {/* Right Section - Apply Button */}
          <div className="flex items-center">
            <Button
              variant="primary"
              size="md"
              className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 border-yellow-400 hover:border-yellow-500 font-bold uppercase tracking-wide"
            >
              APPLY NOW
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden mt-4 space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-300 uppercase tracking-wide mr-4">APPLY BEFORE</span>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">DAYS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">HOURS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">MINUTES</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wider">SECONDS</div>
                </div>
              </div>
              <span className="text-sm text-gray-300 uppercase tracking-wide ml-4">TO JOIN</span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 border-yellow-400 hover:border-yellow-500 font-bold uppercase tracking-wide w-full max-w-xs"
            >
              APPLY NOW
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
