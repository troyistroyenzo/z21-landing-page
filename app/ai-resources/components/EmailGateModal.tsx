'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, Sparkles } from 'lucide-react';

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function EmailGateModal({ isOpen, onClose, onSubmit }: EmailGateModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(email);
      onClose();
    } catch {
      setError('Failed to unlock resources. Please try again.');
    } finally {
      setLoading(false);
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Center container */}
          <div className="fixed inset-0 z-[101] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center">
                        <Lock className="w-10 h-10 text-accent" />
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white text-center mb-3">
                    Unlock Free AI Resources
                  </h2>

                  {/* Description */}
                  <p className="text-zinc-400 text-center mb-6">
                    Get instant access to our curated AI tools, templates, and guides. 
                    Plus, join our newsletter for weekly AI insights.
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-zinc-300">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>100+ AI prompts & templates</span>
                    </div>
                    <div className="flex items-center text-sm text-zinc-300">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Workflow automation guides</span>
                    </div>
                    <div className="flex items-center text-sm text-zinc-300">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Weekly AI tips & updates</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your best email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? 'Unlocking...' : 'Get Instant Access'}
                    </button>
                  </form>

                  {/* Privacy note */}
                  <p className="text-xs text-zinc-500 text-center mt-4">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}