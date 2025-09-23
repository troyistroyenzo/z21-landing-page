'use client';

import React from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  trackingEvent?: string;
  disabled?: boolean;
}

export default function CTAButton({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  external = false,
  trackingEvent,
  disabled = false,
}: CTAButtonProps) {
  const baseStyles = 'font-medium transition-all duration-300 ease-out-swift inline-flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-tan/20 uppercase tracking-wide';
  
  const variantStyles = {
    primary: 'bg-tan text-off-white hover:bg-tan/80 active:bg-tan/90 shadow-md hover:shadow-lg',
    secondary: 'bg-dark-green text-off-white hover:bg-dark-green/90 active:bg-dark-green/80 shadow-md hover:shadow-lg',
    tertiary: 'bg-off-white text-dark-green border-2 border-dark-green hover:bg-dark-green hover:text-off-white',
    ghost: 'text-dark-green hover:bg-dark-green/10 active:bg-dark-green/20',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-caption rounded-lg',
    md: 'px-6 py-3 text-sm rounded-lg',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const handleClick = () => {
    if (disabled) return;
    
    if (trackingEvent) {
      trackEvent(trackingEvent, { variant, size });
    }
    
    if (onClick) {
      onClick();
    }
  };

  if (href) {
    if (external || href.startsWith('http') || href.startsWith('mailto:')) {
      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={combinedStyles}
          onClick={handleClick}
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link
        href={href}
        className={combinedStyles}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedStyles}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
