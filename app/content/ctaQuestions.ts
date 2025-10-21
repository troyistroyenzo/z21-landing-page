export type QuestionType = 
  | 'text'
  | 'email'
  | 'select'
  | 'multiline'
  | 'phone'
  | 'url'
  | 'number';

export interface SelectOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
  };
}

// Questions for Z21 Founders CTA - Focused on understanding founder needs
export const ctaQuestions: Question[] = [
  {
    id: 'name',
    type: 'text',
    label: "First, what's your name?",
    placeholder: 'Enter your name',
    description: "We'll use this to personalize your experience",
    validation: {
      required: true,
      minLength: 2,
      errorMessage: 'Please enter your name'
    }
  },
  {
    id: 'email',
    type: 'email',
    label: "What's your email address?",
    placeholder: 'founder@company.com',
    description: "We'll send your Z21 access details here",
    validation: {
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      errorMessage: 'Please enter a valid email address'
    }
  },
  {
    id: 'currentRole',
    type: 'select',
    label: "What best describes you?",
    description: "This helps us tailor the program to your needs",
    options: [
      { value: 'founder', label: 'Startup Founder' },
      { value: 'solopreneur', label: 'Solopreneur' },
      { value: 'agency', label: 'Agency Owner' },
      { value: 'freelancer', label: 'Freelancer/Consultant' },
      { value: 'corporate', label: 'Corporate Professional' },
      { value: 'other', label: 'Other' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    }
  },
  {
    id: 'biggestChallenge',
    type: 'select',
    label: "What's your biggest challenge with AI right now?",
    description: "Be honest - this helps us focus on what matters",
    options: [
      { value: 'getting_started', label: "Don't know where to start" },
      { value: 'implementation', label: 'Ideas but struggling to implement' },
      { value: 'scaling', label: "Can't scale what I've built" },
      { value: 'roi', label: 'Not seeing real ROI from AI' },
      { value: 'time', label: 'Takes too much time to learn' },
      { value: 'technical', label: 'Too technical for me' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select a challenge'
    }
  },
  {
    id: 'timeCommitment',
    type: 'select',
    label: "How many hours per week can you commit to Z21?",
    description: "Be realistic - we want you to succeed",
    options: [
      { value: '5-10', label: '5-10 hours' },
      { value: '10-15', label: '10-15 hours' },
      { value: '15-20', label: '15-20 hours' },
      { value: '20+', label: '20+ hours (I\'m all in!)' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select your time commitment'
    }
  },
  {
    id: 'specificGoal',
    type: 'multiline',
    label: "What specific outcome do you want from Z21?",
    placeholder: 'e.g., Automate my sales process, Build an AI tool for my clients, etc.',
    description: "The more specific, the better we can help",
    validation: {
      required: true,
      minLength: 20,
      maxLength: 500,
      errorMessage: 'Please describe your goal (20-500 characters)'
    }
  },
  {
    id: 'urgency',
    type: 'select',
    label: "When do you need to see results?",
    description: "This helps us understand your timeline",
    options: [
      { value: 'asap', label: 'ASAP - I needed this yesterday' },
      { value: '1month', label: 'Within 1 month' },
      { value: '3months', label: 'Within 3 months' },
      { value: '6months', label: 'Within 6 months' },
      { value: 'exploring', label: 'Just exploring options' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select your timeline'
    }
  }
];

// Optional: Thank you message configuration
export const thankYouConfig = {
  title: "Application Submitted! ✓",
  subtitle: "Thanks for applying to Z21 Founders",
  message: "We've received your application and will review it carefully. Expect to hear from us within 24-48 hours about next steps.",
  ctaText: "Back to Homepage",
  ctaLink: "/"
};
