'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from './Container';
import content from '@/app/content/z21.json';
import { ChevronDown, Calendar, Code, Rocket, Users, Target, Sparkles } from 'lucide-react';

export default function RoadmapSection() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const weeks = [
    {
      number: '01',
      icon: Calendar,
      title: 'Foundation & Setup',
      image: 'gradient-to-br from-tan/20 to-transparent',
      outcomes: [
        'Install AI development stack',
        'Set up workflow templates',
        'Configure privacy-safe defaults',
        'Join the Z21 community'
      ],
      tools: ['ChatGPT API', 'Claude', 'Cursor', 'n8n']
    },
    {
      number: '02',
      icon: Code,
      title: 'First Production Workflow',
      image: 'gradient-to-br from-tan/30 to-transparent',
      outcomes: [
        'Choose your first workflow area',
        'Build end-to-end automation',
        'Test with real data',
        'Deploy to production'
      ],
      tools: ['Zapier', 'Make', 'GitHub Actions', 'Vercel']
    },
    {
      number: '03',
      icon: Rocket,
      title: 'Launch Your Offer',
      image: 'gradient-to-br from-tan/40 to-transparent',
      outcomes: content.cohort.outcomes.slice(0, 2),
      tools: ['Framer', 'ConvertKit', 'Stripe', 'Loom']
    },
    {
      number: '04',
      icon: Users,
      title: 'Market Validation',
      image: 'gradient-to-br from-tan/50 to-transparent',
      outcomes: [
        content.cohort.outcomes[2],
        'Gather user feedback',
        'Refine value proposition'
      ],
      tools: ['Cal.com', 'Typeform', 'Notion', 'Slack']
    },
    {
      number: '05',
      icon: Target,
      title: 'Scale & Optimize',
      image: 'gradient-to-br from-tan/60 to-transparent',
      outcomes: [
        'Optimize conversion rates',
        'Expand workflow coverage',
        'Automate recurring tasks'
      ],
      tools: ['Segment', 'Posthog', 'Retool', 'Supabase']
    },
    {
      number: '06',
      icon: Sparkles,
      title: 'Systems & Sustainability',
      image: 'gradient-to-br from-tan/70 to-transparent',
      outcomes: [
        content.cohort.outcomes[3],
        'Document your playbook',
        'Plan next 90 days'
      ],
      tools: ['OpenAI Assistants', 'LangChain', 'Pinecone', 'Custom APIs']
    }
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
            6-Week Roadmap
          </h2>
          <p className="text-muted-green text-lg leading-relaxed">
            Your transformation timeline from zero to production
          </p>
        </motion.div>

        <div className="space-y-12">
          {weeks.map((week, index) => {
            const Icon = week.icon;
            const isExpanded = expandedWeek === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="grid lg:grid-cols-[120px_1fr] gap-8 items-start"
              >
                {/* Week number */}
                <div className="hidden lg:block">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className="text-[8rem] font-heading font-black text-tan leading-none select-none"
                  >
                    {week.number}
                  </motion.span>
                </div>

                {/* Content card */}
                <div className="bg-darker-green rounded-xl overflow-hidden shadow-card">
                  <div className="grid md:grid-cols-[200px_1fr] gap-6">
                    {/* Week image */}
                    <div className={`h-48 md:h-auto bg-${week.image} bg-dark-green relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-12 h-12 text-tan/40" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-darker-green/50 to-transparent" />
                    </div>

                    {/* Week details */}
                    <div className="p-6 md:p-8">
                      <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan mb-4">
                        Week {week.number.replace('0', '')}: {week.title}
                      </h3>

                      {/* Learning outcomes */}
                      <div className="space-y-3 mb-6">
                        {week.outcomes.map((outcome, oIndex) => (
                          <div key={oIndex} className="flex items-start gap-2">
                            <span className="text-tan/60 mt-1">•</span>
                            <p className="text-off-white/80">{outcome}</p>
                          </div>
                        ))}
                      </div>

                      {/* Tools included - expandable */}
                      <button
                        onClick={() => setExpandedWeek(isExpanded ? null : index)}
                        className="flex items-center gap-2 text-tan/60 hover:text-tan transition-colors duration-300"
                      >
                        <span className="text-caption uppercase tracking-widest">Tools included</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-tan/20"
                        >
                          <div className="flex flex-wrap gap-2">
                            {week.tools.map((tool, tIndex) => (
                              <span
                                key={tIndex}
                                className="px-3 py-1 bg-tan/10 text-tan rounded text-sm"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
