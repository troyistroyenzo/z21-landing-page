'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'paper' | 'emerald' | 'gradient';
}

export default function Section({ 
  children, 
  className = '', 
  id,
  background = 'default'
}: SectionProps) {
  const backgroundStyles = {
    default: '',
    paper: 'bg-paper',
    emerald: 'bg-emerald-950 text-paper',
    gradient: 'bg-gradient-to-b from-paper to-paper/50'
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`py-20 lg:py-32 ${backgroundStyles[background]} ${className}`}
    >
      {children}
    </motion.section>
  );
}
