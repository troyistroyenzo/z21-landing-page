'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TriangleAlert, CheckCircle2, Workflow, Sparkles, AlertCircle } from 'lucide-react';

type Item = {
  title: string;
  expectation: string;
  reality: string;
  hurt: string;
};

const items: Item[] = [
  {
    title: 'Content Ops',
    expectation: 'AI drafts → daily posts',
    reality: 'Draft graveyard, voice drifts',
    hurt: 'No calendar = no compound',
  },
  {
    title: 'Automation',
    expectation: 'Weekend scripts replace ops',
    reality: 'API limits, brittle code',
    hurt: 'Demos ≠ production',
  },
  {
    title: 'Support AI',
    expectation: 'Autonomous replies',
    reality: 'Hallucinations, off-brand',
    hurt: 'Missing guardrails',
  },
  {
    title: 'Data',
    expectation: 'Single source of truth',
    reality: 'Notion/Sheets disagree',
    hurt: 'Cannot track revenue',
  },
  {
    title: 'Tooling',
    expectation: 'One AI app = leverage',
    reality: 'Tool sprawl, no owner',
    hurt: 'Systems decay',
  },
  {
    title: 'Pipeline',
    expectation: 'Personal brand = leads',
    reality: 'Viral posts, empty calendar',
    hurt: 'No trust bridge',
  },
];

export default function PainPointsSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-display-sm md:text-display text-off-white font-heading uppercase tracking-wide">
            Expectation <span className="text-tan">vs</span> Reality
          </h2>
          <p className="text-muted-green mt-2 text-lg">
            AI lives in demos, not in production.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Image on the left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden h-[500px] lg:h-[600px]"
          >
            <Image
              src="https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/DSC05796.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvRFNDMDU3OTYuanBnIiwiaWF0IjoxNzU5Mzc0ODQ3LCJleHAiOjE3OTA5MTA4NDd9.7ECIKPJo7Yes3hy-JhfXNyxqbeXCiEYlLA7IUpMkMfM"
              alt="Z21 Program Dashboard"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-off-white/90 text-sm italic">
                "We thought AI would delete busywork. Instead, we built new kinds."
              </p>
            </div>
          </motion.div>

          {/* Pain points on the right */}
          <div className="grid gap-3">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="rounded-lg border border-muted/20 bg-card/50 backdrop-blur p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Workflow className="w-4 h-4 text-tan" />
                  <h3 className="text-off-white font-medium text-sm">{item.title}</h3>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 text-success-green flex-shrink-0" />
                    <div className="flex gap-2">
                      <span className="text-tan/70 uppercase text-xs">Expect:</span>
                      <span className="text-off-white/80">{item.expectation}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <TriangleAlert className="w-3.5 h-3.5 mt-0.5 text-error-red flex-shrink-0" />
                    <div className="flex gap-2">
                      <span className="text-tan/70 uppercase text-xs">Reality:</span>
                      <span className="text-muted-green/80">{item.reality}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-tan/70 flex-shrink-0" />
                    <span className="text-off-white/60 italic">{item.hurt}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Solution micro-frame */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 flex items-center gap-2 text-xs text-off-white/60 bg-darker-green/30 rounded-lg p-3 border border-tan/20"
            >
              <CheckCircle2 className="w-4 h-4 text-tan" />
              <span>Fix = owner • SOP • handoff • guardrails • metric</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
