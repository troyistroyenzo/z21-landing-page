'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from './Container';
import { motion } from 'framer-motion';
import content from '@/app/content/z21.json';
import { interpolateEnv } from '@/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-paper/80 backdrop-blur-lg border-b border-emerald-950/10'
          : 'bg-transparent'
      }`}
    >
      <Container className="relative">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-emerald-950 hover:text-rust transition-colors"
          >
            Z21
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {content.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-emerald-950 hover:text-rust transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={interpolateEnv(content.hero.primaryCta.href)}
              className="px-5 py-2 bg-rust text-paper rounded-lg hover:bg-rust/90 transition-all font-medium"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-emerald-950 transition-all ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-emerald-950 transition-all ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-emerald-950 transition-all ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-paper shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {content.nav.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-emerald-950 hover:text-rust transition-colors font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={interpolateEnv(content.hero.primaryCta.href)}
                className="px-5 py-3 bg-rust text-paper rounded-lg hover:bg-rust/90 transition-all font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        )}
      </Container>
    </motion.header>
  );
}
