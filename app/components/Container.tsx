'use client';

import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}

export default function Container({ 
  children, 
  className = '', 
  size = 'default' 
}: ContainerProps) {
  const sizeClasses = {
    default: 'max-w-screen-xl',
    wide: 'max-w-[1440px]',
    narrow: 'max-w-4xl'
  };

  return (
    <div className={`mx-auto px-6 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
