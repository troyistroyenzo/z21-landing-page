'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons';

interface CourseSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string; // Will be replaced with actual images
  description: string;
}

const CoursesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides: CourseSlide[] = [
    {
  id: 'slide-1',
  title: 'The Art of Prompt Engineering — Marketing',
  subtitle: 'Design AI-powered campaigns & funnels',
  image: 'https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/AI%20PROMPT%20ENGINEERING%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvQUkgUFJPTVBUIEVOR0lORUVSSU5HICgxKS5wbmciLCJpYXQiOjE3NjAwNTc1ODgsImV4cCI6MTc5MTU5MzU4OH0.KJKjJbvHGCSbQGFj25UdUb1YoQINDY7jKFY722ZOf9s',
  description: 'Build agentic content systems (TCREI + RSTI), automate research-to-draft, launch pages & email flows, and publish weekly proof that compounds pipeline.'
},
{
  id: 'slide-2',
  title: 'The Art of Prompt Engineering — Accounting Edition',
  subtitle: 'Safer, faster finance with AI (HITL)',
  image: 'https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/Z21%20%20HeyApril.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvWjIxICBIZXlBcHJpbC5wbmciLCJpYXQiOjE3NjAwNTc1NzEsImV4cCI6MTc5MTU5MzU3MX0.e1nFJ9n5k1cr5ae6B7YvVCqSlS7sBqiqbuXWClkIYE8',
  description: 'Ship variance explainers, AP triage, and bank-recon summaries with guardrails. Leave with a custom GPT, starter prompt library, and an Impact Scoreboard to track ROI.'
},
{
  id: 'slide-3',
  title: 'The Art of Personal Branding',
  subtitle: 'Own your story, system, and proof',
  image: 'https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/The%20Art%20of%20Personal%20Branding.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvVGhlIEFydCBvZiBQZXJzb25hbCBCcmFuZGluZy5wbmciLCJpYXQiOjE3NjAwNTczNjksImV4cCI6MTc5MTU5MzM2OX0.wrqTo-J2AA6ltgCXjYIKD9MH7iDk8eJAxbZsmKFRr3M',
  description: 'Clarify identity, values, and voice; build a 30-day content series; and install a Content OS that turns lived stories into durable authority.'
},
{
  id: 'slide-4',
  title: 'The Art of Color Grading',
  subtitle: 'Cinematic grading in DaVinci Resolve',
  image: 'https://kldpzpnipovkkwzvstrm.supabase.co/storage/v1/object/sign/photos/TROY%20COLOR%20GRADING%20DECK.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGMwZGRhNC1iYWNkLTQzMGYtOWVkOC1iNzY3YzU1NDM5YzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwaG90b3MvVFJPWSBDT0xPUiBHUkFESU5HIERFQ0sucG5nIiwiaWF0IjoxNzYwMDU3NTU4LCJleHAiOjE3OTE1OTM1NTh9.w-ghOBeR-GJMjO6mDl8ic9_ABeGfqZJPmV41Obn_Svo',
  description: 'Master scopes, log→Rec.709/CST, node architecture, skin-tone refinement, PowerGrades, and fast delivery pipelines for consistent, cinematic looks.'
}

  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="py-24 bg-gradient-to-b from-emerald-950 via-[#0C1816] to-[#0C1816] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-tan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Master Multiple
            <span className="block text-tan">Revenue-Generating Skills</span>
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            Each curriculum is designed to turn you into a high-value professional.
            Choose your path or master them all.
          </p>
        </motion.div>

        {/* Image Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Slide Container */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  opacity: { duration: 0.8, ease: 'easeInOut' },
                  scale: { duration: 0.8, ease: 'easeInOut' }
                }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Image Background */}
                <div className="w-full h-full relative">
                  <img 
                    src={slides[currentSlide].image} 
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient overlay from transparent to dark at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content Overlay - Bottom aligned */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 text-center px-12 pb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
                        {slides[currentSlide].title}
                      </h3>
                      <p className="text-xl md:text-2xl text-emerald-100 mb-2 drop-shadow-lg">
                        {slides[currentSlide].subtitle}
                      </p>
                      <p className="text-base text-white/90 max-w-2xl mx-auto drop-shadow-lg">
                        {slides[currentSlide].description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-emerald-900/80 backdrop-blur-md hover:bg-emerald-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-emerald-600/50"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-emerald-900/80 backdrop-blur-md hover:bg-emerald-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border border-emerald-600/50"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-12 h-3 bg-tan'
                    : 'w-3 h-3 bg-emerald-700/50 hover:bg-emerald-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-6">
            <p className="text-emerald-300 text-lg font-medium">
              <span className="text-tan text-2xl font-bold">{currentSlide + 1}</span>
              <span className="text-emerald-400 mx-2">/</span>
              <span className="text-emerald-400">{slides.length}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
