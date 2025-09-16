'use client';

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
  const baseStyles = 'font-medium transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-rust/20';
  
  const variantStyles = {
    primary: 'bg-rust text-paper hover:bg-rust/90 active:bg-rust/80',
    secondary: 'bg-emerald-950 text-paper hover:bg-emerald-950/90 active:bg-emerald-950/80',
    tertiary: 'bg-paper text-emerald-950 border-2 border-emerald-950 hover:bg-emerald-950 hover:text-paper',
    ghost: 'text-emerald-950 hover:bg-emerald-950/10 active:bg-emerald-950/20',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
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
