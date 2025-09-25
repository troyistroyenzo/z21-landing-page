'use client';

import React, { useEffect, useState } from 'react';
import Button from './ui/Button';

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
    <section className="w-full flex flex-col items-center justify-center py-12 md:py-16 bg-white/80 backdrop-blur-md border border-gold/20 rounded-2xl shadow-green-lg mt-[-2rem] mb-8 max-w-3xl mx-auto">
      <div className="text-center mb-2">
        <span className="text-base md:text-lg font-medium text-gold tracking-wide">
          Next cohort opens on January 31
        </span>
      </div>
      <div className="text-center text-sm md:text-base text-gray-700 mb-4 font-inter">
        by application only • limited to 80 spots
      </div>
      <div className="text-center text-xs text-gray-500 mb-2 font-inter">
        apply before
      </div>
      <div className="flex items-center justify-center gap-4 md:gap-8 mb-2">
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold text-gold">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm text-gray-700 font-inter uppercase tracking-wider">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold text-gold">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm text-gray-700 font-inter uppercase tracking-wider">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold text-gold">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm text-gray-700 font-inter uppercase tracking-wider">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-bold text-gold">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm text-gray-700 font-inter uppercase tracking-wider">Seconds</span>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mb-4 font-inter">
        To join
      </div>
      <Button
        variant="primary"
        size="lg"
        className="bg-gold hover:bg-gold/90 text-white border-gold hover:border-gold/90 px-8"
        style={{ backgroundColor: '#C4A27A' }}
      >
        Apply Now
      </Button>
    </section>
  );
};

export default Countdown;
