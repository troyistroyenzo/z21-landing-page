'use client';

import { motion } from 'framer-motion';
import Logo from '@/app/components/ui/Logo';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      {/* Z21 Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: 'easeOut',
          delay: 0.1 
        }}
        className="mb-8"
      >
        <Logo className="w-24 h-24 text-white" />
      </motion.div>

      {/* Loading Bar */}
      <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: 1.8,
            ease: 'easeOut'
          }}
        />
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, ease: 'easeOut' }}
        className="mt-6 text-zinc-500 text-sm"
      >
        Loading...
      </motion.p>
    </motion.div>
  );
}
