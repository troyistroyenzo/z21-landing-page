'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';
import Logo from './ui/Logo';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Proof', href: '#proof' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo - 3x larger on desktop, responsive on mobile */}
          <motion.div 
            className="flex items-center" 
            whileHover={{ scale: 0.05 }}
          >
            <div className="w-24 h-24 md:w-24 md:h-24 flex items-center justify-center">
              <Logo width={96} height={96} className="w-16 h-16 md:w-24 md:h-24" />
            </div>
            <span 
              className="font-bold text-2xl md:text-3xl"
              style={{ color: '#AF977C' }}
            >
              Z21 Launchpad
            </span>
          </motion.div>

          {/* Desktop Navigation - Right aligned with larger text */}
          <nav className="hidden md:flex items-center space-x-8 ml-auto">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="hover:text-foreground transition-colors duration-200 text-base lg:text-lg font-medium"
                style={{ color: '#AF977C' }}
                whileHover={{ y: -1 }}
              >
                {item.label}
              </motion.a>
            ))}
            {/* Apply Now button inline with nav */}
            <Link href="/cta-demo">
              <Button 
                variant="ghost" 
                size="md"
                className="bg-gold hover:bg-gold/90 text-white border-gold hover:border-gold/90"
              >
                Apply Now
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - Centered content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden glass border-t border-gray-200/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="block text-center hover:text-foreground transition-colors duration-200 py-3 text-lg font-medium"
                  style={{ color: '#AF977C' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="pt-4">
                <Link href="/cta-demo" className="block">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full bg-gold hover:bg-gold/90 text-white border-gold hover:border-gold/90"
                    
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
