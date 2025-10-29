'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { ctaQuestions, thankYouConfig, Question } from '@/app/content/ctaQuestions';
import { cn } from '@/lib/utils';
import PricingCard from './PricingCard';

interface FormData {
  [key: string]: string | string[];
}

interface FormErrors {
  [key: string]: string;
}

const STORAGE_KEY = 'vibecheck_form_data';

// Smoother animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export default function TypeformCTA({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isNotFit, setIsNotFit] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showTimeEstimate, setShowTimeEstimate] = useState(false);
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  // Load saved form data on mount with validation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const { data, step } = JSON.parse(saved);
          // Validate that the step is within valid range
          if (step >= 0 && step < ctaQuestions.length) {
            setFormData(data);
            setCurrentStep(step);
          } else {
            // Clear invalid data
            console.warn('Invalid saved step, clearing localStorage');
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          console.error('Failed to load saved form data', e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, []);

  // Save form data to localStorage after each change
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: formData,
        step: currentStep
      }));
    }
  }, [formData, currentStep]);

  // Filter visible questions based on conditional logic
  const visibleQuestions = ctaQuestions.filter((q) => {
    if (!q.conditionalLogic) return true;
    const { questionId, value } = q.conditionalLogic.showIf;
    return formData[questionId] === value;
  });

  const currentQuestion = visibleQuestions[currentStep];
  const progress = currentQuestion ? ((currentStep + 1) / visibleQuestions.length) * 100 : 0;

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
  }, [currentStep]);

  // Safety check: Clear invalid localStorage and reset
  useEffect(() => {
    if (visibleQuestions.length === 0 || currentStep >= visibleQuestions.length) {
      console.warn('Invalid form state, clearing localStorage');
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(0);
      setFormData({});
    }
  }, [visibleQuestions.length, currentStep]);

  // If no current question, return loading state
  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check if user is not a fit (simplified - backend has full scoring)
  const checkNotFit = (data: FormData): boolean => {
    // Knockouts only (backend calculates full score)
    
    // Time commitment: <2 hours
    if (data.timeCommitment === '<2') return true;
    
    // AI familiarity: Too beginner (<3)
    const aiReadiness = Number(data.aiReadiness);
    if (aiReadiness > 0 && aiReadiness < 3) return true;
    
    // No sample data
    if (data.sampleData === 'no') return true;

    // All other scoring happens on backend
    return false;
  };

  const validateField = (question: Question, value: string | string[]): string | null => {
    if (!question.validation) return null;

    const { required, pattern, minLength, maxLength, errorMessage } = question.validation;

    // Handle array values (multiselect, checkbox)
    if (Array.isArray(value)) {
      if (required && value.length === 0) {
        return errorMessage || 'Please select at least one option';
      }
      // For checkbox type with all required
      if (question.type === 'checkbox' && question.options) {
        if (value.length !== question.options.length) {
          return errorMessage || 'All confirmations are required';
        }
      }
      return null;
    }

    // Handle string values
    const stringValue = String(value || '');

    if (required && !stringValue) {
      return errorMessage || 'This field is required';
    }

    if (pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(stringValue)) {
        return errorMessage || 'Invalid format';
      }
    }

    if (minLength && stringValue.length < minLength) {
      return errorMessage || `Minimum ${minLength} characters required`;
    }

    if (maxLength && stringValue.length > maxLength) {
      return errorMessage || `Maximum ${maxLength} characters allowed`;
    }

    return null;
  };

  const handleNext = () => {
    const value = formData[currentQuestion.id] || (currentQuestion.type === 'multiselect' || currentQuestion.type === 'checkbox' ? [] : '');
    const error = validateField(currentQuestion, value);

    if (error) {
      setErrors({ ...errors, [currentQuestion.id]: error });
      return;
    }

    setErrors({ ...errors, [currentQuestion.id]: '' });

    // Show time estimate AFTER moving to first AI question (not immediately after sprint selection)
    if (currentStep > 0 && visibleQuestions[currentStep - 1]?.id === 'sprintType' && formData.sprintType === 'ai_onboarding') {
      setShowTimeEstimate(true);
      setTimeout(() => setShowTimeEstimate(false), 3000);
    }

    if (currentStep < visibleQuestions.length - 1) {
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
      // Merge other inputs with form data
      const finalData = { ...formData };
      Object.keys(otherInputs).forEach(key => {
        if (otherInputs[key]) {
          finalData[`${key}_other`] = otherInputs[key];
        }
      });

      // Convert arrays to JSON strings for submission
      const submitData = Object.entries(finalData).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? JSON.stringify(value) : value;
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch('/api/cta-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit form');
      }

      // Track form completion
      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'engagement',
          event_label: 'typeform_cta',
          value: 1
        });
      }

      // Clear localStorage on successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }

      // Check if user is a fit AFTER successful submission
      const isNotFitResult = checkNotFit(finalData);
      
      if (isNotFitResult) {
        // Show "not ready" screen
        setIsNotFit(true);
      } else {
        // Show success screen if they are a fit
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string | string[]) => {
    setFormData({ ...formData, [currentQuestion.id]: value });
  };

  const handleMultiselectToggle = (optionValue: string) => {
    const currentValues = (formData[currentQuestion.id] as string[]) || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    handleInputChange(newValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (currentQuestion.type !== 'multiline') {
        e.preventDefault();
        handleNext();
      }
    }
  };

  // Not a Fit Screen
  if (isNotFit) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      >
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Not quite ready yet</h2>
          <p className="text-lg text-zinc-400 mb-4">Based on your responses, we recommend getting more familiar with AI first</p>
          <p className="text-sm text-zinc-500 mb-6">
            Check out our free resources to build your foundation, then come back when you're ready to commit 4-6 hours/week.
          </p>
          <div className="space-y-3">
            <a
              href="https://calendly.com/troyenzo/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-5 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-all text-sm border border-zinc-700"
            >
              Book a Free Consultation
            </a>
            <button
              onClick={() => router.push('/')}
              className="block w-full px-5 py-3 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Back to Home Page
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Success Screen
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      >
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{thankYouConfig.title}</h2>
          <p className="text-lg sm:text-xl text-zinc-400 mb-4">{thankYouConfig.subtitle}</p>
          <p className="text-sm sm:text-base text-zinc-500 mb-6">{thankYouConfig.message}</p>
          <div className="space-y-3">
            <a
              href={thankYouConfig.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-5 sm:px-6 py-3 sm:py-3.5 bg-accent text-white font-semibold rounded-lg border-2 border-accent hover:bg-accent/90 hover:border-accent/90 transition-all hover:scale-105 text-sm sm:text-base"
            >
              {thankYouConfig.ctaText}
            </a>
            <button
              onClick={() => router.push('/')}
              className="block w-full px-5 py-3 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Back to Home Page
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl sm:rounded-2xl w-full max-w-full sm:max-w-2xl overflow-hidden max-h-screen flex flex-col">

        
        {/* Progress Bar with Number */}
        <div className="relative h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-4">
          <div className="absolute inset-0 bg-zinc-900">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white/20"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="text-sm sm:text-base text-white font-medium">
              Question {currentStep + 1} of {visibleQuestions.length}
            </span>
            <span className="text-xs sm:text-sm text-zinc-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Time Estimate Toast */}
        <AnimatePresence>
          {showTimeEstimate && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10"
            >
              <div className="bg-accent/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-white shadow-lg">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">This will take ~8 minutes to complete</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Container */}
        <div className="p-4 sm:p-8 min-h-[300px] sm:min-h-[400px] relative flex-1 overflow-y-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.15, ease: [0, 0, 0.2, 1] },
                opacity: { duration: 0.15 }
              }}
              className="space-y-6"
            >
              {/* Question Label */}
              <h2 className="text-xl sm:text-3xl font-bold text-white">
                {currentQuestion.label}
              </h2>

              {/* Question Description */}
              {currentQuestion.description && (
                <p className="text-sm sm:text-base text-zinc-400">{currentQuestion.description}</p>
              )}

              {/* Pricing Card - Show before investment question */}
              {currentQuestion.id === 'investmentReadiness' && (
                <div className="mb-6">
                  <PricingCard />
                </div>
              )}

              {/* Input Field */}
              <div className="space-y-2">
                {/* Text/Email/URL inputs - FULL WIDTH */}
                {(currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'phone' || currentQuestion.type === 'url') && (
                  <input
                    type={currentQuestion.type === 'email' ? 'email' : currentQuestion.type === 'url' ? 'url' : 'text'}
                    value={(formData[currentQuestion.id] as string) || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentQuestion.placeholder}
                    className={cn(
                      "w-full px-3 sm:px-4 py-3 bg-zinc-900 border rounded-lg text-base text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors",
                      errors[currentQuestion.id] ? "border-red-500" : "border-zinc-800"
                    )}
                    autoFocus
                  />
                )}

                {/* Multiline textarea */}
                {currentQuestion.type === 'multiline' && (
                  <textarea
                    value={(formData[currentQuestion.id] as string) || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentQuestion.placeholder}
                    rows={4}
                    className={cn(
                      "w-full px-3 sm:px-4 py-3 bg-zinc-900 border rounded-lg text-base text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors resize-none",
                      errors[currentQuestion.id] ? "border-red-500" : "border-zinc-800"
                    )}
                    autoFocus
                  />
                )}

                {/* Select dropdown */}
                {currentQuestion.type === 'select' && currentQuestion.options && (
                  <div className="grid gap-2">
                    {currentQuestion.options.map((option) => {
                      const isDisabled = currentQuestion.id === 'sprintType' && option.value === 'personal_branding';
                      const isOther = option.value === 'other';
                      const isSelected = formData[currentQuestion.id] === option.value;
                      
                      return (
                        <div key={option.value}>
                          <button
                            onClick={() => !isDisabled && handleInputChange(option.value)}
                            disabled={isDisabled}
                            className={cn(
                              "w-full px-3 sm:px-4 py-3 bg-zinc-900 border rounded-lg text-sm sm:text-base text-left transition-all",
                              isDisabled && "opacity-40 cursor-not-allowed",
                              !isDisabled && "hover:border-accent",
                              isSelected
                                ? "border-accent bg-accent/10 text-white"
                                : "border-zinc-800 text-zinc-300 hover:text-white"
                            )}
                          >
                            <span className="flex items-center justify-between">
                              {option.label}
                              {isSelected && !isDisabled && (
                                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                              )}
                            </span>
                          </button>
                          
                          {/* Other input field */}
                          {isOther && isSelected && (
                            <motion.input
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              type="text"
                              value={otherInputs[currentQuestion.id] || ''}
                              onChange={(e) => setOtherInputs({ ...otherInputs, [currentQuestion.id]: e.target.value })}
                              placeholder="Please specify..."
                              className="mt-2 w-full px-3 sm:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Multiselect checkboxes */}
                {currentQuestion.type === 'multiselect' && currentQuestion.options && (
                  <div className="grid gap-2">
                    {currentQuestion.options.map((option) => {
                      const isSelected = ((formData[currentQuestion.id] as string[]) || []).includes(option.value);
                      const isOther = option.value === 'other';
                      
                      return (
                        <div key={option.value}>
                          <button
                            onClick={() => handleMultiselectToggle(option.value)}
                            className={cn(
                              "w-full px-3 sm:px-4 py-3 bg-zinc-900 border rounded-lg text-sm sm:text-base text-left hover:border-accent transition-all",
                              isSelected
                                ? "border-accent bg-accent/10 text-white"
                                : "border-zinc-800 text-zinc-300 hover:text-white"
                            )}
                          >
                            <span className="flex items-center justify-between">
                              {option.label}
                              <div className={cn(
                                "w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0",
                                isSelected ? "border-accent bg-accent" : "border-zinc-600"
                              )}>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                            </span>
                          </button>
                          
                          {/* Other input field */}
                          {isOther && isSelected && (
                            <motion.input
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              type="text"
                              value={otherInputs[currentQuestion.id] || ''}
                              onChange={(e) => setOtherInputs({ ...otherInputs, [currentQuestion.id]: e.target.value })}
                              placeholder="Please specify..."
                              className="mt-2 w-full px-3 sm:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Checkbox (all required) */}
                {currentQuestion.type === 'checkbox' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isChecked = ((formData[currentQuestion.id] as string[]) || []).includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleMultiselectToggle(option.value)}
                          className="w-full flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-accent transition-all text-left"
                        >
                          <div className={cn(
                            "w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-0.5",
                            isChecked ? "border-accent bg-accent" : "border-zinc-600"
                          )}>
                            {isChecked && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                          </div>
                          <span className="text-sm sm:text-base text-zinc-300">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Range slider with better visibility */}
                {currentQuestion.type === 'range' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs sm:text-sm text-zinc-400">
                      <span>{currentQuestion.min}</span>
                      <span className="text-xl sm:text-2xl font-bold text-accent">
                        {formData[currentQuestion.id] || currentQuestion.min}
                      </span>
                      <span>{currentQuestion.max}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={currentQuestion.min}
                        max={currentQuestion.max}
                        step={currentQuestion.step || 1}
                        value={(formData[currentQuestion.id] as string) || currentQuestion.min}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, white 0%, white ${((Number(formData[currentQuestion.id]) || currentQuestion.min!) - currentQuestion.min!) / ((currentQuestion.max! - currentQuestion.min!) / 100)}%, rgb(63 63 70) ${((Number(formData[currentQuestion.id]) || currentQuestion.min!) - currentQuestion.min!) / ((currentQuestion.max! - currentQuestion.min!) / 100)}%, rgb(63 63 70) 100%)`
                        }}
                      />
                    </div>
                  </div>
                )}

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
        <div className="px-4 sm:px-8 pb-4 sm:pb-8 pt-4 flex items-center justify-between gap-2 bg-zinc-950 border-t border-zinc-800">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base",
              currentStep === 0
                ? "text-zinc-600 cursor-not-allowed"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-white">Submitting...</span>
              </>
            ) : currentStep === visibleQuestions.length - 1 ? (
              <span className="text-white">Submit</span>
            ) : (
              <>
                <span className="text-white">Next</span>
              </>
            )}
          </button>
        </div>

        {/* Submit Error */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-8 pb-4"
          >
            <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-sm">
              {submitError}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
