'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from './Container';
import { 
  ChevronDown, 
  Calendar, 
  Code, 
  Rocket, 
  Users, 
  Target, 
  Sparkles, 
  Brain,
  BookOpen,
  Shield,
  Award,
  Package,
  Compass,
  Zap,
  BarChart3,
  TrendingUp
} from 'lucide-react';

export default function RoadmapSection() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [activeTrack, setActiveTrack] = useState<string>('overview');

  const prework = {
    title: 'Pre-Work: Orientation & Value Realignment',
    subtitle: 'Week 0',
    icon: Compass,
    purpose: 'Reset identity, align incentives, and define what "winning" means before we touch tools.',
    outcomes: [
      'Value Realignment: write your Vision, Beliefs, and Boundaries (T. Welch style)',
      'Personal Baseline: audience, offer hypotheses, funnel assets audit',
      'Metrics Set: pick Virality, Acquisition, Conversion, Leverage (hours saved) KPIs'
    ],
    assets: [
      'Founder OS (Notion): identity, beliefs, constraints, weekly cadence',
      'Scoreboard template (opt-ins, content, calls, time saved)',
      '30-min Lab: "Psych Safety & Failure Loops"—reframing psyche/trauma as iteration fuel'
    ]
  };

  const weeks = [
    {
      number: '01',
      icon: Brain,
      title: 'Identity → Offer',
      subtitle: 'Brand + Lean Foundations',
      theme: '"Clarity compounds."',
      abstract: [
        'Vision & Beliefs (brand POV) → Positioning statement → Offer thesis',
        'Lean Startup: problem interview script, riskiest assumption test (RAT), value prop map'
      ],
      technical: [
        'Offer Page skeleton (Lovable/Framer/Webflow)',
        'Tracking setup: Fathom/GA + Meta/YouTube pixels'
      ],
      deliverables: [
        'Offer one-pager (with checkout link placeholder)',
        'Positioning doc (ICP, pain, promise, proof)',
        'Interview 3 prospects; log insights'
      ],
      metrics: 'Click-to-read %, interview completion, first waitlist signups'
    },
    {
      number: '02',
      icon: Zap,
      title: 'Personal Brand Engine + Virality Metrics',
      theme: '"Become discoverable. Publish proof."',
      abstract: [
        'Narrative design: Identity > System > Proof; "elevate the mundane" motif',
        'Virality Metrics: HOOK rate, hold %, CTR, DM response rate, save/share rates'
      ],
      technical: [
        'Script a 90-sec VSL (hook → mechanism → outcomes → CTA)',
        'Long-form → clips workflow with AI: transcription + hooks + titles + CTAs',
        'ManyChat keywords (FOUNDERS / COHORT / BUILD) wired to CRM'
      ],
      deliverables: [
        '90-sec VSL recorded',
        '5 clips + a 7-day content calendar (platform variants)',
        'DM keyword flows live'
      ],
      metrics: 'HOOK ≥ 35–45% (shorts), CTR to site, DM→email capture rate'
    },
    {
      number: '03',
      icon: Code,
      title: 'AI in Production #1',
      subtitle: 'Funnel + Sales Ops',
      theme: '"Production or nothing."',
      abstract: [
        'Sales Funnel: Awareness → Consideration → Application → Call → Close',
        'Mindsets: resistance, imposter spikes; replacing volume guilt with systems'
      ],
      technical: [
        'Lead-Triage Co-Pilot (email/DM): score A/B/C, draft replies, book calls',
        'Call-Prep Brief: LinkedIn/site scrape → 1-pager + discovery questions',
        'Proposal Draft: notes → price blocks → clean doc'
      ],
      deliverables: [
        'One working workflow in the funnel (triage, prep, or proposal)',
        '2 call slots/week live on calendar'
      ],
      metrics: 'Time-to-first-reply, booked-call rate, proposal turnaround',
      aiStack: 'ChatGPT Custom GPT (+ file tools), n8n/Zapier, Notion/Sheets, Calendly/Stripe'
    },
    {
      number: '04',
      icon: Rocket,
      title: 'AI in Production #2',
      subtitle: 'Content OS or Ops',
      theme: '"Same hours, 10× output."',
      abstract: [
        'Systems thinking: SOPs that survive bad days; guardrails for quality',
        'Pitfalls: model hallucination, over-automation, privacy, "set-and-forget" decay'
      ],
      technical: [
        'Content OS: long-video → 5–7 clips/week + titles + captions + schedule CSV',
        'Inbox → Decisions: meeting → decisions/owners; follow-ups to Slack/Calendar',
        'SOP Auto-Writer: Loom/transcript → Inputs/Steps/Checks/Outputs/Owner'
      ],
      deliverables: [
        'Second production workflow live',
        'Two SOPs published to Notion (with owners/due dates)'
      ],
      metrics: 'Hours saved/day, content throughput, % meetings with tasks'
    },
    {
      number: '05',
      icon: TrendingUp,
      title: 'Pipeline, Pricing & Conversion',
      subtitle: 'Lean Tests',
      theme: '"Make it revenue-ready."',
      abstract: [
        'Pricing/packaging tests; objection handling; ethical scarcity',
        'Cognitive traps: sunk cost, avoidance, "more content will fix it"'
      ],
      technical: [
        'A/B offer positioning; Calendly qualifying questions; simple CRM board',
        'Offer emails: VSL send, objection sweep, last-call with deadline'
      ],
      deliverables: [
        'Offer page live with checkout',
        'A/B headline test running; objection-buster email live'
      ],
      metrics: 'Apply→call %, call→close %, checkout conversion, LTV signals'
    },
    {
      number: '06',
      icon: Award,
      title: 'Ship & Showcase',
      subtitle: 'Proof Flywheel',
      theme: '"Receipts, not promises."',
      abstract: [
        'Story harvesting: how to turn small wins into durable proof',
        'Renewal: building a post-cohort habit loop (publish → pipeline → price step)'
      ],
      technical: [
        'Proof Wall: case snippets gallery, before/after screenshots, KPI tiles',
        'Analytics recap: VSL play 50/90, CTA clicks, application rate, time saved'
      ],
      deliverables: [
        'Live showcase demo (offer + VSL + 2 calls + 1 workflow running)',
        '30/60-day plan: next workflow, content cadence, price step'
      ],
      metrics: 'Workflows active @30/60 days, calls/week, hours saved, repeatable publish rate'
    }
  ];

  const crossCuttingTracks = [
    {
      id: 'mindsets',
      title: 'Mindsets, Psyche & Renewal',
      subtitle: 'Welch-inspired',
      icon: Brain,
      description: 'Weekly support for psychological resilience',
      content: [
        'Weekly 20-min circle: fear inventory, failure review, micro-resets',
        'Tools: "If/Then" relapse plans, "3 wins" journal, "ship even small" ritual'
      ]
    },
    {
      id: 'technical',
      title: 'Technical Knowledge Boosters',
      icon: Code,
      description: 'Advanced AI implementation skills',
      content: [
        'Safe prompting (TCREI + RSTI), chain-of-thought, verification loops',
        'Data handling: PII hygiene, redaction, vendor settings; when to escalate to a human'
      ]
    },
    {
      id: 'pitfalls',
      title: 'Pitfalls & Assumptions',
      subtitle: 'Red Team',
      icon: Shield,
      description: 'Critical thinking and risk management',
      content: [
        'Hype alarms: pilots ≠ production',
        'Reliance risk: single-platform dependence; founder bottleneck',
        'Quality gates: show calcs, check totals, avoid false certainty'
      ]
    }
  ];

  const artifacts = [
    'Founder OS (identity, beliefs, cadence)',
    'Offer Kit (page template, pricing tests, objection library)',
    'Content OS (scripts, clips template, planner CSV)',
    'Workflow Packs (Lead triage, Call prep, Proposal writer, Inbox→Decisions, SOP auto-writer)',
    'SOP template (Inputs → Steps → Checks → Outputs → Owner)',
    'Scoreboard (assets shipped, calls booked, hours saved, workflows active @30/60/90)'
  ];

  const facilitationCadence = [
    { day: 'Monday', activity: 'Teaching (abstract → applied, 60–75m)' },
    { day: 'Wednesday', activity: 'Build Lab (technical implementation, 90m)' },
    { day: 'Friday', activity: 'Ship Room (demos + scoreboard, 60m)' },
    { day: 'Office Hours', activity: '30m slots (VIP priority)' }
  ];

  const tools = {
    build: ['ChatGPT (Custom GPTs)', 'n8n/Zapier', 'Notion', 'Google Drive'],
    siteVideo: ['Lovable/Webflow/Framer', 'Riverside/Descript/CapCut', 'YouTube'],
    commEvents: ['Skool (community/lessons/payments)', 'Zoom + Luma', 'ManyChat'],
    analytics: ['Stripe', 'Fathom/GA', 'Meta/YouTube pixels']
  };

  return (
    <section id="curriculum" className="py-24 lg:py-32 bg-dark-green">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-display-sm md:text-display text-off-white font-heading uppercase tracking-wider mb-6">
            6-Week Transformation Roadmap
          </h2>
          <p className="text-muted-green text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            From uncertain & overwhelmed to an AI-powered operator: Offer live • 90-sec VSL • 2+ calls • 1 production workflow, plus a proof cadence that compounds.
          </p>
          
          {/* Track selector */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveTrack('overview')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTrack === 'overview' 
                  ? 'bg-tan text-dark-green' 
                  : 'bg-tan/10 text-tan hover:bg-tan/20'
              }`}
            >
              Weekly Roadmap
            </button>
            <button
              onClick={() => setActiveTrack('cross-cutting')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTrack === 'cross-cutting' 
                  ? 'bg-tan text-dark-green' 
                  : 'bg-tan/10 text-tan hover:bg-tan/20'
              }`}
            >
              Cross-Cutting Tracks
            </button>
            <button
              onClick={() => setActiveTrack('tools')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTrack === 'tools' 
                  ? 'bg-tan text-dark-green' 
                  : 'bg-tan/10 text-tan hover:bg-tan/20'
              }`}
            >
              Tools & Resources
            </button>
          </div>
        </motion.div>

        {/* Overview/Weekly Roadmap */}
        {activeTrack === 'overview' && (
          <div className="space-y-12">
            {/* Pre-work */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-[120px_1fr] gap-8 items-start"
            >
              <div className="hidden lg:block">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 0.2, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[8rem] font-heading font-black text-tan leading-none select-none"
                >
                  00
                </motion.span>
              </div>

              <div className="bg-darker-green rounded-xl overflow-hidden shadow-card border-2 border-tan/20">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Compass className="w-8 h-8 text-tan" />
                    <div>
                      <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan">
                        {prework.title}
                      </h3>
                      <p className="text-tan/60 text-sm uppercase tracking-wider">{prework.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-off-white/80 mb-6 italic">{prework.purpose}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-3">Outcomes</h4>
                      <div className="space-y-2">
                        {prework.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-tan/60 mt-1">•</span>
                            <p className="text-off-white/70 text-sm">{outcome}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-3">Assets</h4>
                      <div className="space-y-2">
                        {prework.assets.map((asset, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-tan/60 mt-1">•</span>
                            <p className="text-off-white/70 text-sm">{asset}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weeks 1-6 */}
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
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-8 h-8 text-tan" />
                        <div>
                          <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan">
                            Week {week.number.replace('0', '')}: {week.title}
                          </h3>
                          {week.subtitle && (
                            <p className="text-tan/60 text-sm uppercase tracking-wider">{week.subtitle}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-tan/80 mb-6 italic font-medium">{week.theme}</p>

                      {/* Show collapsed content */}
                      {!isExpanded && (
                        <div className="space-y-3 mb-4">
                          {week.deliverables.slice(0, 2).map((deliverable, dIndex) => (
                            <div key={dIndex} className="flex items-start gap-2">
                              <span className="text-tan/60 mt-1">•</span>
                              <p className="text-off-white/80">{deliverable}</p>
                            </div>
                          ))}
                          {week.deliverables.length > 2 && (
                            <p className="text-tan/60 text-sm italic">+{week.deliverables.length - 2} more deliverables...</p>
                          )}
                        </div>
                      )}

                      {/* Expand button */}
                      <button
                        onClick={() => setExpandedWeek(isExpanded ? null : index)}
                        className="flex items-center gap-2 text-tan hover:text-tan/80 transition-colors duration-300"
                      >
                        <span className="text-sm uppercase tracking-widest font-medium">
                          {isExpanded ? 'Show Less' : 'Show Full Details'}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 space-y-6"
                        >
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Abstract → Applied */}
                            <div>
                              <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-3">Abstract → Applied</h4>
                              <div className="space-y-2">
                                {week.abstract.map((item, aIndex) => (
                                  <div key={aIndex} className="flex items-start gap-2">
                                    <span className="text-tan/60 mt-1">•</span>
                                    <p className="text-off-white/70 text-sm">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Technical */}
                            <div>
                              <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-3">Technical</h4>
                              <div className="space-y-2">
                                {week.technical.map((item, tIndex) => (
                                  <div key={tIndex} className="flex items-start gap-2">
                                    <span className="text-tan/60 mt-1">•</span>
                                    <p className="text-off-white/70 text-sm">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Deliverables */}
                          <div>
                            <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-3">Deliverables (shipped by Sunday)</h4>
                            <div className="space-y-2">
                              {week.deliverables.map((deliverable, dIndex) => (
                                <div key={dIndex} className="flex items-start gap-2">
                                  <span className="text-tan/60 mt-1">✓</span>
                                  <p className="text-off-white/70 text-sm">{deliverable}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="pt-4 border-t border-tan/20">
                            <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-2">Metrics to Watch</h4>
                            <p className="text-off-white/70 text-sm">{week.metrics}</p>
                          </div>

                          {/* AI Stack (if applicable) */}
                          {week.aiStack && (
                            <div className="pt-4 border-t border-tan/20">
                              <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-2">AI Stack</h4>
                              <p className="text-off-white/70 text-sm">{week.aiStack}</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Cross-Cutting Tracks */}
        {activeTrack === 'cross-cutting' && (
          <div className="space-y-8">
            {crossCuttingTracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-darker-green rounded-xl p-6 md:p-8"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-10 h-10 text-tan flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan mb-1">
                        {track.title}
                      </h3>
                      {track.subtitle && (
                        <p className="text-tan/60 text-sm uppercase tracking-wider mb-3">{track.subtitle}</p>
                      )}
                      <p className="text-off-white/80 mb-4">{track.description}</p>
                      <div className="space-y-2">
                        {track.content.map((item, cIndex) => (
                          <div key={cIndex} className="flex items-start gap-2">
                            <span className="text-tan/60 mt-1">•</span>
                            <p className="text-off-white/70">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tools & Resources */}
        {activeTrack === 'tools' && (
          <div className="space-y-12">
            {/* Artifacts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-darker-green rounded-xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-8 h-8 text-tan" />
                <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan">
                  Artifacts You'll Receive
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {artifacts.map((artifact, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-tan mt-1">✓</span>
                    <p className="text-off-white/80">{artifact}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tool Stack */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-darker-green rounded-xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-tan" />
                <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan">
                  Tool Stack
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(tools).map(([category, toolList]) => (
                  <div key={category}>
                    <h4 className="text-tan/80 uppercase text-sm tracking-wider mb-3">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="space-y-2">
                      {toolList.map((tool, tIndex) => (
                        <div key={tIndex} className="flex items-start gap-2">
                          <span className="text-tan/60 mt-1">•</span>
                          <p className="text-off-white/70 text-sm">{tool}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Facilitation Cadence */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-darker-green rounded-xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-tan" />
                <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan">
                  Weekly Schedule
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {facilitationCadence.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-tan/5 rounded-lg">
                    <span className="text-tan font-bold">{item.day}:</span>
                    <p className="text-off-white/80">{item.activity}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Graduation Criteria */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-tan/20 to-tan/10 rounded-xl p-6 md:p-8 border-2 border-tan/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-tan" />
                <h3 className="text-2xl font-heading font-bold uppercase tracking-widest text-tan">
                  Assessment & Graduation
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-tan font-bold mb-2">Pass = Proof</h4>
                  <p className="text-off-white/80">
                    Offer live + VSL + ≥2 qualified calls + ≥1 production workflow
                  </p>
                </div>
                <div>
                  <h4 className="text-tan font-bold mb-2">Graduation Requirements</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-tan mt-1">✓</span>
                      <p className="text-off-white/80">Publish a case snippet to the Proof Wall (metrics + screenshot)</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-tan mt-1">✓</span>
                      <p className="text-off-white/80">Optional Z21 Certified Operator micro-assessment (capstone + review)</p>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </Container>
    </section>
  );
}
