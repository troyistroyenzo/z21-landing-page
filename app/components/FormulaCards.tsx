'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from './Container';
import content from '@/app/content/z21.json';
import { Cpu, Zap, Target, Rocket } from 'lucide-react';

export default function FormulaCards() {
  const cards = [
    {
      number: '01',
      icon: Cpu,
      title: 'Install the Stack',
      description: content.whatYouGet.grid[0].desc,
    },
    {
      number: '02',
      icon: Zap,
      title: 'Learn by Building',
      description: content.whatYouGet.grid[1].desc,
    },
    {
      number: '03',
      icon: Target,
      title: 'Ship Weekly',
      description: content.whatYouGet.grid[2].desc,
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Scale Forever',
      description: content.whatYouGet.grid[3].desc,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-dark-green">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-display-sm md:text-display text-off-white font-heading uppercase tracking-wider mb-4">
            The Z21 Formula
          </h2>
          <p className="text-muted-green text-lg leading-relaxed">
            Four phases to transform from AI-curious to AI-powered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative bg-darker-green rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300">
                  {/* Large semi-transparent number */}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className="absolute top-4 left-6 text-[6rem] font-heading font-black text-tan leading-none select-none animate-number-fade"
                  >
                    {card.number}
                  </motion.span>

                  {/* Icon */}
                  <div className="absolute top-6 right-6">
                    <Icon className="w-6 h-6 text-tan/60" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 pt-12">
                    <h3 className="text-xl font-heading font-bold uppercase tracking-widest text-tan mb-3">
                      {card.title}
                    </h3>
                    <p className="text-muted-green leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-tan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
