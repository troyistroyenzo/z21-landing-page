'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from './ui/Button';
import Logo from './ui/Logo';

export default function GlobalCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // Set countdown target date to January 31, 2026
    const targetDate = new Date('2026-01-31T23:59:59Z');
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Handle scroll to make countdown sticky
    const handleScroll = () => {
      // Get the hero section height (approximate)
      const heroHeight = window.innerHeight * 0.9; // Adjust this value as needed
      setIsSticky(window.scrollY > heroHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <>
      {/* Spacer to prevent layout jump when sticky */}
      {isSticky && (
        <div
          aria-hidden="true"
          style={{ height: 76 }}
        />
      )}
      <header
        className={`w-full bg-emerald-900 text-white py-3 px-4 overflow-x-hidden border-b border-tan/20 transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 right-0 z-50 opacity-100 translate-y-0'
            : 'relative opacity-100 translate-y-0'
        }`}
        style={{
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          ...(isSticky
            ? { boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)' }
            : {}),
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4 h-16">
            {/* Left Section - Logo and Cohort Info */}
            <div className="flex items-center gap-6 px-6">
              <Link href="/" className="text-off-white font-heading font-bold text-xl tracking-wider">
                <Logo width={28} height={28} className="w-7 h-7 flex-shrink-0 inline-block mr-2" />
                Z21
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-tan text-caption uppercase tracking-wide">
                  NEXT COHORT OPENS ON <span className="text-yellow-400 font-bold">JANUARY 31</span>
                </span>
                <span className="text-muted-green text-caption uppercase tracking-wide">
                  • BY APPLICATION ONLY • LIMITED TO <span className="text-yellow-400 font-bold">80 SPOTS</span>
                </span>
              </div>
            </div>
            {/* Center Section - Countdown Timer */}
            <div className="flex items-center gap-6 px-6">
              <span className="text-xs text-gray-300 uppercase tracking-wide">APPLY BEFORE</span>
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
              <span className="text-xs text-gray-300 uppercase tracking-wide hidden lg:inline">TO JOIN</span>
            </div>
            {/* Right Section - Apply Button */}
            <div className="flex items-center px-6">
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
                  <div className="text-base font-bold text-yellow-400">{formatNumber(timeLeft.days)}</div>
                  <div className="text-[8px] text-gray-300 uppercase">D</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-yellow-400">{formatNumber(timeLeft.hours)}</div>
                  <div className="text-[8px] text-gray-300 uppercase">H</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-yellow-400">{formatNumber(timeLeft.minutes)}</div>
                  <div className="text-[8px] text-gray-300 uppercase">M</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-yellow-400">{formatNumber(timeLeft.seconds)}</div>
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
      </header>
    </>
  );
}
