'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { intakeQuestions, intakeThankYou, IntakeQuestion } from '@/app/content/intakeQuestions';
import { cn } from '@/lib/utils';

interface FormData {
  [key: string]: string | string[];
}

interface FormErrors {
  [key: string]: string;
}

const STORAGE_KEY = 'onboarding_intake_data';

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

export default function IntakeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  // Load saved form data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const { data, step } = JSON.parse(saved);
          if (step >= 0 && step < intakeQuestions.length) {
            setFormData(data);
            setCurrentStep(step);
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, []);

  // Save form data
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: formData,
        step: currentStep
      }));
    }
  }, [formData, currentStep]);

  const currentQuestion = intakeQuestions[currentStep];
  const progress = ((currentStep + 1) / intakeQuestions.length) * 100;

  const validateField = (question: IntakeQuestion, value: string | string[]): string | null => {
    if (!question.validation) return null;

    const { required, pattern, minLength, maxLength, errorMessage } = question.validation;

    if (Array.isArray(value)) {
      if (required && value.length === 0) {
        return errorMessage || 'Please select at least one option';
      }
      return null;
    }

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
    const value = formData[currentQuestion.id] || (currentQuestion.type === 'multiselect' ? [] : '');
    const error = validateField(currentQuestion, value);

    if (error) {
      setErrors({ ...errors, [currentQuestion.id]: error });
      return;
    }

    setErrors({ ...errors, [currentQuestion.id]: '' });

    if (currentStep < intakeQuestions.length - 1) {
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
      const finalData = { ...formData };
      Object.keys(otherInputs).forEach(key => {
        if (otherInputs[key]) {
          finalData[`${key}_other`] = otherInputs[key];
        }
      });

      const submitData = Object.entries(finalData).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? JSON.stringify(value) : value;
        return acc;
      }, {} as Record<string, string>);

      const response = await fetch('/api/onboarding-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit form');
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }

      setIsComplete(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
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

  // Success Screen
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      >
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">{intakeThankYou.title}</h2>
          <p className="text-xl text-zinc-400 mb-4">{intakeThankYou.subtitle}</p>
          <p className="text-base text-zinc-500 mb-6">{intakeThankYou.message}</p>
          <button
            onClick={() => router.push(intakeThankYou.ctaLink)}
            className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all"
          >
            {intakeThankYou.ctaText}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-screen">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-white">Z21 Onboarding Intake — Step 1 of 2</h1>
          <p className="text-sm text-zinc-400 mt-1">Help us understand your business and goals</p>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-zinc-900">
          <motion.div
            className="absolute top-0 left-0 h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question Container */}
        <div className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { duration: 0.15 }, opacity: { duration: 0.15 } }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">{currentQuestion.label}</h2>
              
              {currentQuestion.description && (
                <p className="text-zinc-400">{currentQuestion.description}</p>
              )}

              <div className="space-y-2">
                {(currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'url') && (
                  <input
                    type={currentQuestion.type}
                    value={(formData[currentQuestion.id] as string) || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors",
                      errors[currentQuestion.id] ? "border-red-500" : "border-zinc-800"
                    )}
                    autoFocus
                  />
                )}

                {currentQuestion.type === 'multiline' && (
                  <textarea
                    value={(formData[currentQuestion.id] as string) || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    rows={4}
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors resize-none",
                      errors[currentQuestion.id] ? "border-red-500" : "border-zinc-800"
                    )}
                    autoFocus
                  />
                )}

                {currentQuestion.type === 'select' && currentQuestion.options && (
                  <div className="grid gap-2">
                    {currentQuestion.options.map((option) => {
                      const isSelected = formData[currentQuestion.id] === option.value;
                      const isOther = option.value === 'other';
                      
                      return (
                        <div key={option.value}>
                          <button
                            onClick={() => handleInputChange(option.value)}
                            className={cn(
                              "w-full px-4 py-3 bg-zinc-900 border rounded-lg text-left transition-all hover:border-accent",
                              isSelected ? "border-accent bg-accent/10 text-white" : "border-zinc-800 text-zinc-300"
                            )}
                          >
                            <span className="flex items-center justify-between">
                              {option.label}
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-accent" />}
                            </span>
                          </button>
                          {isOther && isSelected && (
                            <input
                              type="text"
                              value={otherInputs[currentQuestion.id] || ''}
                              onChange={(e) => setOtherInputs({ ...otherInputs, [currentQuestion.id]: e.target.value })}
                              placeholder="Please specify..."
                              className="mt-2 w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

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
                              "w-full px-4 py-3 bg-zinc-900 border rounded-lg text-left hover:border-accent transition-all",
                              isSelected ? "border-accent bg-accent/10 text-white" : "border-zinc-800 text-zinc-300"
                            )}
                          >
                            <span className="flex items-center justify-between">
                              {option.label}
                              <div className={cn(
                                "w-5 h-5 border-2 rounded flex items-center justify-center",
                                isSelected ? "border-accent bg-accent" : "border-zinc-600"
                              )}>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                            </span>
                          </button>
                          {isOther && isSelected && (
                            <input
                              type="text"
                              value={otherInputs[currentQuestion.id] || ''}
                              onChange={(e) => setOtherInputs({ ...otherInputs, [currentQuestion.id]: e.target.value })}
                              placeholder="Please specify..."
                              className="mt-2 w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {errors[currentQuestion.id] && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors[currentQuestion.id]}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 pt-4 flex items-center justify-between border-t border-zinc-800">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
              currentStep === 0 ? "text-zinc-600 cursor-not-allowed" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="text-sm text-zinc-500">
            {currentStep + 1} of {intakeQuestions.length}
          </div>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                Submitting...
              </>
            ) : currentStep === intakeQuestions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>

        {submitError && (
          <div className="px-8 pb-4">
            <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400 text-sm">
              {submitError}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
