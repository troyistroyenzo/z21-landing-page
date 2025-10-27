'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TypeformCTA from '../components/TypeformCTA';
import { cn } from '@/lib/utils';

interface TypeformCTAButtonProps {
  text?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeformCTAButton({ 
  text = 'Get Started',
  className = '',
  variant = 'primary',
  size = 'md'
}: TypeformCTAButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-accent text-white hover:bg-accent/90 hover:scale-105',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-black'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
      >
        {text}
        <svg 
          className="w-4 h-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 7l5 5m0 0l-5 5m5-5H6" 
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && <TypeformCTA onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
