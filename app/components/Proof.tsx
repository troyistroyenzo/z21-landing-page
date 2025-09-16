'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import Section from './Section';
import content from '@/app/content/z21.json';
import CTAButton from './CTAButton';
import { interpolateEnv } from '@/lib/utils';
import { CheckCircle, ExternalLink } from 'lucide-react';

export default function Proof() {
  return (
    <>
      {/* Why believe us */}
      <Section id={content.proof.id} background="default">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-display text-emerald-950 mb-12 text-center">
              {content.proof.title}
            </h2>

            {/* Proof bullets */}
            <div className="space-y-6 mb-12">
              {content.proof.bullets.map((bullet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-paper rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-rust mt-1 flex-shrink-0" />
                  <p className="text-lg text-emerald-950/80">{bullet}</p>
                </motion.div>
              ))}
            </div>

            {/* Social proof links */}
            <div className="flex flex-wrap justify-center gap-4">
              {content.proof.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-950 text-paper rounded-lg hover:bg-emerald-950/90 transition-all"
                >
                  <span>{social.label}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* How to get it */}
      <Section id={content.howToGetIt.id} background="paper">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-display text-emerald-950 mb-12 text-center">
              {content.howToGetIt.title}
            </h2>

            {/* Steps */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {content.howToGetIt.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-rust text-paper rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-emerald-950/80">{step}</p>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <CTAButton
                href={interpolateEnv(content.howToGetIt.primaryCta.href)}
                variant="primary"
                size="lg"
                external
                trackingEvent="get_apply_cta"
              >
                {content.howToGetIt.primaryCta.label}
              </CTAButton>
              
              <CTAButton
                href={interpolateEnv(content.howToGetIt.secondaryCta.href)}
                variant="secondary"
                size="lg"
                external
                trackingEvent="get_founders_cta"
              >
                {content.howToGetIt.secondaryCta.label}
              </CTAButton>
            </div>

            {/* Newsletter form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-md mx-auto"
            >
              <p className="text-center text-emerald-950 mb-4">
                {content.howToGetIt.newsletter.label}
              </p>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  
                  try {
                    const response = await fetch('/api/subscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email })
                    });
                    
                    if (response.ok) {
                      alert("You're in. Check your inbox for the Z21 Dispatch.");
                      form.reset();
                    } else {
                      alert("That didn't look like an email. Mind trying again?");
                    }
                  } catch (error) {
                    alert('An error occurred. Please try again.');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  name="email"
                  placeholder={content.howToGetIt.newsletter.placeholder}
                  required
                  className="flex-1 px-4 py-3 border-2 border-emerald-950/20 rounded-lg focus:outline-none focus:border-rust"
                />
                <CTAButton
                  variant="primary"
                  size="md"
                  trackingEvent="newsletter_subscribe"
                >
                  {content.howToGetIt.newsletter.button}
                </CTAButton>
              </form>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Antipitch Preempts */}
      <Section background="emerald">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-display text-paper mb-12 text-center">
              {content.antipitchPreempts.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {content.antipitchPreempts.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-paper/10 backdrop-blur rounded-xl p-8"
                >
                  <h3 className="text-2xl font-bold text-rust mb-3">
                    {item.h}
                  </h3>
                  <p className="text-paper/90">
                    {item.p}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
