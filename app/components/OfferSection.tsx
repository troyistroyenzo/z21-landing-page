'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OfferCard3D from './OfferCard3D';
import OfferModal from './OfferModal';
import { offerStack } from '@/app/content/offerStack';
import type { OfferItem } from '@/app/content/offerStack';

export default function OfferSection() {
  const [activeModal, setActiveModal] = useState<OfferItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (offer: OfferItem) => {
    setActiveModal(offer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Delay clearing the offer to allow exit animation
    setTimeout(() => {
      setActiveModal(null);
    }, 200);
  };

  return (
    <section 
      id="offers" 
      className="py-24 bg-gradient-to-b from-[#0C1816] via-[#0C1816] to-emerald-950/20 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-tan/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Offer Stack
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            Pick the path that fits your build. Each option installs real assets and a working workflow.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {offerStack.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: 'easeOut'
              }}
            >
              <OfferCard3D
                offer={offer}
                onOpenModal={() => handleOpenModal(offer)}
                isPaused={modalOpen}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <OfferModal
          offer={activeModal}
          isOpen={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
