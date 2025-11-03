'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ResourceGridProps {
  children: ReactNode;
}

export default function ResourceGrid({ children }: ResourceGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {children}
    </motion.div>
  );
}
