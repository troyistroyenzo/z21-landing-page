'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypeformCTAButton from '@/app/vibe-check/components/TypeformCTAButton';
import Logo from '@/app/components/ui/Logo';

export default function VibeCheckPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show skeleton loader briefly
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800); // 0.8 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {!showContent ? (
          // Skeleton Loader
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            {/* Z21 Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mb-8"
            >
              <Logo className="w-20 h-20 text-white" />
            </motion.div>

            {/* Loading Bar */}
            <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ) : (
          // Main Content
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center min-h-screen p-8"
          >
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 
                className="text-5xl font-bold"
                style={{
                  background: 'linear-gradient(90deg, #fca5a5, #fed7aa, #fef3c7, #d9f99d, #a7f3d0, #bfdbfe, #ddd6fe, #fecdd3)',
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'rainbow-flow 8s ease infinite'
                }}
              >
                Join The Z21 Launchpad
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Build {'>'} talk. Take your AI skills from zero to hero.
              </p>

              <div className="flex flex-col items-center gap-8 mt-12">
                <TypeformCTAButton 
                  text="Start Your Journey"
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
