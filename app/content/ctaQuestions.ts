export type QuestionType = 
  | 'text'
  | 'email'
  | 'select'
  | 'multiselect'
  | 'multiline'
  | 'phone'
  | 'url'
  | 'number'
  | 'range'
  | 'checkbox';

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
  min?: number;
  max?: number;
  step?: number;
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    knockout?: boolean;
    errorMessage?: string;
  };
  conditionalLogic?: {
    showIf: { questionId: string; value: string };
  };
  scoring?: {
    weight: number;
    passThreshold?: number;
  };
}

// AI Onboarding Sprint Questions - 1:1 DWY Program
export const ctaQuestions: Question[] = [
  // SECTION 1 — Basic Info
  {
    id: 'name',
    type: 'text',
    label: "What's your name?",
    placeholder: 'Enter your name',
    validation: {
      required: true,
      minLength: 2,
      errorMessage: 'Please enter your name'
    }
  },
  {
    id: 'workDescription',
    type: 'text',
    label: "Describe what you do in one line",
    placeholder: 'e.g., "I\'m a real estate agent helping clients find mid-range properties in Manila."',
    validation: {
      required: true,
      minLength: 10,
      errorMessage: 'Please describe what you do'
    }
  },
  {
    id: 'profileLink',
    type: 'url',
    label: "Where can we learn more about you or your work?",
    placeholder: 'IG / LinkedIn / website / portfolio',
    description: 'Share your social media, website, or portfolio link',
    validation: {
      required: true,
      errorMessage: 'Please provide a valid URL'
    }
  },
  {
    id: 'email',
    type: 'email',
    label: "Email address",
    placeholder: 'your@email.com',
    validation: {
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      errorMessage: 'Please enter a valid email address'
    }
  },
  {
    id: 'referralSource',
    type: 'select',
    label: "How did you hear about this?",
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'referral', label: 'Referral' },
      { value: 'event', label: 'Event/Workshop' },
      { value: 'other', label: 'Other' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    }
  },

  // SECTION 2 — Path Choice (Branch)
  {
    id: 'sprintType',
    type: 'select',
    label: "Which sprint are you applying for?",
    options: [
      { value: 'ai_onboarding', label: 'AI Onboarding (how to integrate AI into your workflow)' },
      { value: 'personal_branding', label: 'Personal Branding (clarity, offers, and content engine)' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select a sprint'
    }
  },

  // SECTION 3 — AI Onboarding Path
  // PART A: Context & Goals
  {
    id: 'aiMotivation',
    type: 'multiline',
    label: "Why do you want to onboard to AI right now?",
    placeholder: "What's not working / what do you hope to automate or improve?",
    validation: {
      required: true,
      minLength: 20,
      errorMessage: 'Please provide more details (at least 20 characters)'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    }
  },
  {
    id: 'roleDescription',
    type: 'select',
    label: "Which of these best describes you?",
    options: [
      { value: 'founder', label: 'Founder / solopreneur' },
      { value: 'freelancer', label: 'Freelancer / service provider' },
      { value: 'team_lead', label: 'Team lead / operations head' },
      { value: 'creator', label: 'Creator / consultant' },
      { value: 'other', label: 'Other' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    }
  },
  {
    id: 'timeCommitment',
    type: 'select',
    label: "How many hours per week can you realistically commit to this 1:1 sprint?",
    options: [
      { value: '4-6', label: '4–6 hours ✅' },
      { value: '2-3', label: '2–3 hours ⚠️' },
      { value: '<2', label: '< 2 hours 🚫' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select your time commitment'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'startTimeline',
    type: 'select',
    label: "Timeline to start",
    options: [
      { value: 'within_14', label: 'Within 14 days ✅' },
      { value: '15-30', label: '15–30 days ⚠️' },
      { value: '>30', label: 'More than 30 days 🚫' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select a timeline'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  },

  // PART B: Readiness & Current Setup
  {
    id: 'aiReadiness',
    type: 'range',
    label: "How would you rate your AI familiarity?",
    description: "0 = new to it, 10 = already using AI daily in work",
    min: 0,
    max: 10,
    step: 1,
    validation: {
      required: true
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'toolStack',
    type: 'multiselect',
    label: "Current tool stack",
    description: "Select all that apply",
    options: [
      { value: 'chatgpt', label: 'ChatGPT' },
      { value: 'claude', label: 'Claude' },
      { value: 'notion_ai', label: 'Notion AI' },
      { value: 'automation', label: 'n8n / Zapier / Make' },
      { value: 'dev_tools', label: 'Cline / Lovable' },
      { value: 'workspace', label: 'Google Workspace / M365' },
      { value: 'communication', label: 'Slack / Discord / CRM' },
      { value: 'other', label: 'Other' }
    ],
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    }
  },
  {
    id: 'focusAreas',
    type: 'multiselect',
    label: "Which areas are you most excited to 10×? (pick 2–3)",
    options: [
      { value: 'workflow', label: 'Daily workflow automation' },
      { value: 'marketing', label: 'Marketing & content creation' },
      { value: 'data', label: 'Data / reporting / dashboards' },
      { value: 'documentation', label: 'Team documentation / knowledge base' },
      { value: 'client_comms', label: 'Lead nurturing / client comms' },
      { value: 'build_tools', label: 'Building your own GPT or mini-app' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select at least one focus area'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'sampleData',
    type: 'select',
    label: "Do you have sample data or existing processes to use in training?",
    options: [
      { value: 'yes', label: 'Yes ✅' },
      { value: 'no', label: 'No 🚫' }
    ],
    validation: {
      required: true,
      knockout: true,
      errorMessage: 'This is required to proceed'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'dwyConfirmation',
    type: 'select',
    label: "Are you comfortable co-building (DWY), not DFY?",
    description: "DWY = Done With You, DFY = Done For You",
    options: [
      { value: 'yes', label: 'Yes ✅' },
      { value: 'no', label: 'No 🚫' }
    ],
    validation: {
      required: true,
      knockout: true,
      errorMessage: 'This is required to proceed'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'preferredFormat',
    type: 'select',
    label: "Preferred format",
    options: [
      { value: 'virtual', label: 'Virtual (Zoom)' },
      { value: 'in_person', label: 'In-person (Metro Manila)' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select a format'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    }
  },

  // PART C: Outcomes & Commitment
  {
    id: 'successMetrics',
    type: 'multiselect',
    label: "In 30 days, what would 'success' look like for you?",
    description: "Pick up to 3",
    options: [
      { value: 'workflows', label: '2–3 working AI workflows running weekly' },
      { value: 'time_saved', label: 'Measurable hours saved' },
      { value: 'accuracy', label: 'Improved accuracy / consistency' },
      { value: 'capabilities', label: 'New internal capabilities unlocked' },
      { value: 'processes', label: 'Less chaos, clearer processes' },
      { value: 'other', label: 'Other' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select at least one success metric'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    }
  },
  {
    id: 'budgetReadiness',
    type: 'select',
    label: "Budget readiness (in ₱ or $)",
    options: [
      { value: 'ready', label: 'Ready to invest (₱60k–₱120k range) ✅' },
      { value: 'payment_plan', label: 'Want payment plan ⚠️' },
      { value: 'exploring', label: 'Just exploring 🚫' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'additionalInfo',
    type: 'multiline',
    label: "Anything else you want me to know before reviewing your fit?",
    placeholder: 'Share any additional context...',
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    }
  },

  // SECTION 4 — Confirmations
  {
    id: 'confirmations',
    type: 'checkbox',
    label: "Confirm these (required)",
    options: [
      { 
        value: 'dwy_understood', 
        label: 'I understand this is a 1:1 done-with-you (DWY) sprint, not a done-for-you service.' 
      },
      { 
        value: 'time_commitment', 
        label: 'I can commit 4–6 hours/week for calls + homework.' 
      },
      { 
        value: 'start_timeline', 
        label: "I'm comfortable starting within 30 days." 
      },
      { 
        value: 'deposit', 
        label: '100% deposit required to lock dates.' 
      }
    ],
    validation: {
      required: true,
      knockout: true,
      errorMessage: 'All confirmations are required to proceed'
    },
    conditionalLogic: {
      showIf: { questionId: 'sprintType', value: 'ai_onboarding' }
    },
    scoring: {
      weight: 2
    }
  }
];

// Thank you message configuration
export const thankYouConfig = {
  title: "🎯 You're a strong fit for the AI onboarding sprint",
  subtitle: "Next step: Book your 10-min fit check",
  message: "You'll learn to integrate AI into your workflow, co-build 2–3 live automations, and install your own 30-day impact scoreboard.",
  ctaText: "Book Your Vibe Check",
  ctaLink: "https://calendly.com/troyenzo/30min"
};
