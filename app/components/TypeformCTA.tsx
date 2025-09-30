'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ctaQuestions, thankYouConfig, Question } from '@/app/content/ctaQuestions';
import { cn } from '@/lib/utils';

interface FormData {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function TypeformCTA({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentQuestion = ctaQuestions[currentStep];
  const progress = ((currentStep + 1) / ctaQuestions.length) * 100;

  useEffect(() => {
    // Track form started
    if (currentStep === 0 && typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', 'form_start', {
          event_category: 'engagement',
          event_label: 'typeform_cta'
        });
      }
    }
  }, []);

  const validateField = (question: Question, value: string): string | null => {
    if (!question.validation) return null;

    const { required, pattern, minLength, maxLength, errorMessage } = question.validation;

    if (required && !value) {
      return errorMessage || 'This field is required';
    }

    if (pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        return errorMessage || 'Invalid format';
      }
    }

    if (minLength && value.length < minLength) {
      return errorMessage || `Minimum ${minLength} characters required`;
    }

    if (maxLength && value.length > maxLength) {
      return errorMessage || `Maximum ${maxLength} characters allowed`;
    }

    return null;
  };

  const handleNext = () => {
    const value = formData[currentQuestion.id] || '';
    const error = validateField(currentQuestion, value);

    if (error) {
      setErrors({ ...errors, [currentQuestion.id]: error });
      return;
    }

    setErrors({ ...errors, [currentQuestion.id]: '' });

    if (currentStep < ctaQuestions.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/cta-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Track form completion
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'engagement',
          event_label: 'typeform_cta',
          value: 1
        });
      }

      setIsComplete(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData({ ...formData, [currentQuestion.id]: value });
    if (errors[currentQuestion.id]) {
      setErrors({ ...errors, [currentQuestion.id]: '' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (currentQuestion.type !== 'multiline') {
        e.preventDefault();
        handleNext();
      }
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">{thankYouConfig.title}</h2>
          <p className="text-xl text-zinc-400 mb-4">{thankYouConfig.subtitle}</p>
          <p className="text-zinc-500 mb-6">{thankYouConfig.message}</p>
          <button
            onClick={() => window.location.href = thankYouConfig.ctaLink}
            className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            {thankYouConfig.ctaText}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-zinc-800 relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Question Container */}
        <div className="p-8 min-h-[400px] relative">
          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  handleNext();
                } else if (swipe > swipeConfidenceThreshold && currentStep > 0) {
                  handlePrevious();
                }
              }}
              className="space-y-6"
            >
              {/* Question Number */}
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="text-accent font-semibold">{currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
                <span>{currentQuestion.label}</span>
              </div>

              {/* Question Label */}
              <h2 className="text-3xl font-bold text-white">
                {currentQuestion.label}
              </h2>

              {/* Question Description */}
              {currentQuestion.description && (
                <p className="text-zinc-400">{currentQuestion.description}</p>
              )}

              {/* Input Field */}
              <div className="space-y-2">
                {currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'phone' || currentQuestion.type === 'url' ? (
                  <input
                    type={currentQuestion.type === 'email' ? 'email' : 'text'}
                    value={formData[currentQuestion.id] || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentQuestion.placeholder}
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors",
                      errors[currentQuestion.id] ? "border-red-500" : "border-zinc-800"
                    )}
                    autoFocus
                  />
                ) : currentQuestion.type === 'multiline' ? (
                  <textarea
                    value={formData[currentQuestion.id] || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentQuestion.placeholder}
                    rows={4}
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors resize-none",
                      errors[currentQuestion.id] ? "border-red-500" : "border-zinc-800"
                    )}
                    autoFocus
                  />
                ) : currentQuestion.type === 'select' && currentQuestion.options ? (
                  <div className="grid gap-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleInputChange(option.value);
                          setTimeout(() => handleNext(), 300);
                        }}
                        className={cn(
                          "w-full px-4 py-3 bg-zinc-900 border rounded-lg text-left hover:border-accent transition-all",
                          formData[currentQuestion.id] === option.value
                            ? "border-accent bg-accent/10 text-white"
                            : "border-zinc-800 text-zinc-300 hover:text-white"
                        )}
                      >
                        <span className="flex items-center justify-between">
                          {option.label}
                          {formData[currentQuestion.id] === option.value && (
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* Error Message */}
                {errors[currentQuestion.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-500 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors[currentQuestion.id]}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
              currentStep === 0
                ? "text-zinc-600 cursor-not-allowed"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {ctaQuestions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentStep ? "bg-accent w-8" : "bg-zinc-700"
                )}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-white">Submitting...</span>
              </>
            ) : currentStep === ctaQuestions.length - 1 ? (
              <>
                <span className="text-white">Submit</span>
                <CheckCircle2 className="w-5 h-5 text-white" />
              </>
            ) : (
              <>
                <span className="text-white">Next</span>
                <ChevronRight className="w-5 h-5 text-white" />
              </>
            )}
          </button>
        </div>

        {/* Submit Error */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 pb-4"
          >
            <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400">
              {submitError}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
