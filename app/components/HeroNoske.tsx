'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import content from '@/app/content/z21.json';
import { interpolateEnv } from '@/lib/utils';
import Link from 'next/link';

export default function HeroNoske() {
  return (
    <section className="relative min-h-screen flex items-center bg-off-white pt-28 pb-16">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Main headline */}
          <h1 className="font-heading text-display-lg md:text-display-xl text-dark-green uppercase tracking-wide leading-[0.9] mb-6">
            {content.hero.title}
          </h1>

          {/* Subheading */}
          <p className="text-body-lg md:text-xl text-muted-green max-w-3xl mx-auto mb-10 leading-relaxed">
            {content.hero.sub}
          </p>

          {/* CTA Button */}
          <Link
            href={interpolateEnv(content.hero.primaryCta.href)}
            className="inline-block px-10 py-4 bg-tan text-dark-green font-heading font-bold text-base uppercase tracking-wider rounded hover:bg-tan/90 transition-all transform hover:scale-105 shadow-card hover:shadow-card-hover"
          >
            {content.hero.primaryCta.label}
          </Link>
        </motion.div>

        {/* Image collage or visual element */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-20"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-deep">
            {/* Gradient placeholder for image collage */}
            <div className="relative h-[500px] gradient-dark">
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-tan/30 to-transparent" />
              </div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-off-white/80 text-caption uppercase tracking-ultra mb-4">
                    {content.hero.eyebrow}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {content.hero.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-off-white/10 backdrop-blur text-off-white rounded-full text-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-tan/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-tan/10 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Background texture/pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0b372b 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </section>
  );
}
