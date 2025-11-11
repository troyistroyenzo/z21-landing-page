'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { OfferItem } from '@/app/content/offerStack';

interface OfferModalProps {
  offer: OfferItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function OfferModal({ offer, isOpen, onClose }: OfferModalProps) {
  // Determine dynamic CTA labels based on availability
  const getCtaLabel = () => {
    if (offer.id === 'cohort' && offer.seasonOpen === false) {
      return 'Join Waitlist';
    }
    if (offer.id === 'coaching' && offer.acceptingClients === false) {
      return 'Join Priority List';
    }
    return offer.ctaLabel;
  };

  const getCtaRoute = () => {
    if (offer.id === 'cohort' && offer.seasonOpen === false) {
      return '/waitlist';
    }
    if (offer.id === 'coaching' && offer.acceptingClients === false) {
      return '/priority';
    }
    return offer.ctaRoute;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>

            {/* Modal Content */}
            <Dialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto 
                          bg-[#0C1816] border border-emerald-900/50 rounded-2xl shadow-2xl shadow-emerald-500/10"
                initial={{ 
                  opacity: 0, 
                  scale: 0.95,
                  x: '-50%',
                  y: '-50%'
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: '-50%',
                  y: '-50%'
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.95,
                  x: '-50%',
                  y: '-50%'
                }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
              >
                {/* Close Button */}
                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 p-2 rounded-lg text-gray-400 hover:text-white 
                             hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 
                             focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#0C1816]"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>

                {/* Modal Header */}
                <div className="p-8 pb-6 border-b border-emerald-900/30">
                  <Dialog.Title asChild>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      {offer.title}
                    </h2>
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <p className="text-lg text-emerald-200">
                      {offer.subtitle}
                    </p>
                  </Dialog.Description>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-8">
                  {/* Targets */}
                  <div>
                    <h3 className="text-xl font-semibold text-tan mb-3">Who This Is For</h3>
                    <ul className="space-y-2">
                      {offer.targets.map((target, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-400 mr-3 mt-1">•</span>
                          <span className="text-gray-300">{target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Format */}
                  <div>
                    <h3 className="text-xl font-semibold text-tan mb-3">Format</h3>
                    <p className="text-gray-300 leading-relaxed">{offer.format}</p>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h3 className="text-xl font-semibold text-tan mb-3">What You Get</h3>
                    <ul className="space-y-2">
                      {offer.deliverables.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-400 mr-3 mt-1">✓</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Extras */}
                  <div>
                    <h3 className="text-xl font-semibold text-tan mb-3">Plus</h3>
                    <ul className="space-y-2">
                      {offer.extras.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-400 mr-3 mt-1">+</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & Keywords */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-emerald-900/20">
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 bg-emerald-900/30 text-emerald-300 rounded-full text-sm font-medium">
                        {offer.pricing}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">DM Keywords:</span>
                      {offer.dmKeywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-800/50 text-gray-400 rounded-lg text-xs font-mono"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.a
                    href={getCtaRoute()}
                    className="block w-full sm:w-auto text-center px-8 py-4 bg-tan text-emerald-900 
                             rounded-lg font-bold text-lg hover:bg-tan/90 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-tan focus:ring-offset-2 
                             focus:ring-offset-[#0C1816]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getCtaLabel()}
                  </motion.a>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
