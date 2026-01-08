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

// AI Onboarding Vibe-Check Questions - 1:1 DWY Program
export const ctaQuestions: Question[] = [
  // SECTION 1 — Who Are You?
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
    label: "What do you do in one line?",
    placeholder: 'e.g., "I run a marketing agency helping B2B SaaS companies scale."',
    validation: {
      required: true,
      minLength: 10,
      errorMessage: 'Please describe what you do'
    }
  },
  {
    id: 'socialHandle',
    type: 'text',
    label: "What is your main social handle or website?",
    placeholder: '@username or website.com',
    description: "We'll scan your context before the call",
    validation: {
      required: true,
      minLength: 3,
      errorMessage: 'Please provide your social handle or website'
    }
  },
  {
    id: 'phone',
    type: 'phone',
    label: "What's your phone number?",
    placeholder: '912 345 6789',
    description: 'Include country code (e.g., +63 for Philippines)',
    validation: {
      required: true,
      pattern: '^[+]?[0-9]{10,15}$',
      errorMessage: 'Please enter a valid phone number'
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

  // SECTION 2 — Experience & Context
  {
    id: 'experienceLevel',
    type: 'select',
    label: "How long have you been building your business/career?",
    options: [
      { value: '0-6', label: '0–6 months' },
      { value: '6-24', label: '6–24 months' },
      { value: '2-5', label: '2–5 years' },
      { value: '5+', label: '5+ years' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    }
  },
  {
    id: 'stuckAreas',
    type: 'multiselect',
    label: "Where are you most stuck right now?",
    description: "Pick up to 3",
    options: [
      { value: 'manual_tasks', label: 'Too many manual, repetitive tasks' },
      { value: 'no_system', label: 'No clear workflow/system to follow' },
      { value: 'content_slow', label: 'Content/marketing takes too long to produce' },
      { value: 'reporting_mess', label: 'Reporting & dashboards are a mess' },
      { value: 'scattered_knowledge', label: 'Knowledge is scattered (Drive/Discord/Notion)' },
      { value: 'followups', label: 'Follow-ups and client comms are inconsistent' },
      { value: 'new_to_ai', label: "I'm new to AI and don't know where to start" }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select at least one area'
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'monthlyRevenue',
    type: 'select',
    label: "What's your current monthly business revenue?",
    options: [
      { value: 'pre_revenue', label: 'Pre-revenue / student' },
      { value: '<2k', label: '<$2k' },
      { value: '2k-10k', label: '$2k–$10k' },
      { value: '10k-50k', label: '$10k–$50k' },
      { value: '50k+', label: '$50k+' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    },
    scoring: {
      weight: 2
    }
  },

  // SECTION 3 — Goals & Readiness
  {
    id: 'sprintGoals',
    type: 'multiselect',
    label: "What are your top goals for this sprint (4–6 weeks)?",
    description: "Pick up to 3",
    options: [
      { value: 'workflows', label: 'Install 2–3 working AI workflows I can run weekly' },
      { value: 'save_time', label: 'Save 5–10 hours/week by automating busywork' },
      { value: 'playbook', label: 'Build a clear prompt + workflow playbook' },
      { value: 'dashboard', label: 'Stand up a simple KPI dashboard & scorecard' },
      { value: 'tighten_ops', label: 'Tighten my ops (onboarding, docs, knowledge base)' },
      { value: 'other', label: 'Other' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select at least one goal'
    },
    scoring: {
      weight: 2
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
    scoring: {
      weight: 2
    }
  },
  {
    id: 'startTimeline',
    type: 'select',
    label: "Timeline to start",
    options: [
      { value: 'within_14', label: 'Within 14 days' },
      { value: '15-30', label: '15–30 days' },
      { value: '>30', label: 'More than 30 days' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select a timeline'
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
    ]
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
    scoring: {
      weight: 2
    }
  },
  {
    id: 'sampleData',
    type: 'select',
    label: "Do you have sample data or existing processes we can use during training?",
    description: "Masked/redacted is fine",
    options: [
      { value: 'yes', label: 'Yes (required for DWY)' },
      { value: 'no', label: 'No (not ready yet)' }
    ],
    validation: {
      required: true,
      knockout: true,
      errorMessage: 'Sample data is required to proceed'
    },
    scoring: {
      weight: 2
    }
  },
  {
    id: 'workflowOwner',
    type: 'select',
    label: "Who will own the workflows after we build them?",
    options: [
      { value: 'me', label: "Me (I'll run them weekly)" },
      { value: 'team', label: 'Someone on my team (in the room)' },
      { value: 'not_sure', label: 'Not sure / no owner yet' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    },
    scoring: {
      weight: 2
    }
  },

  // PART D: Investment & Final Commitment
  {
    id: 'investmentReadiness',
    type: 'select',
    label: "Finally, just so we're aligned on investment...",
    description: "The 1:1 AI Onboarding Sprint is $600 upfront (4 weeks, 8 live calls, all materials delivered on day 1)",
    options: [
      { value: 'ready', label: 'Ready to invest $600 upfront' },
      { value: 'need_budget', label: 'Need to check budget first' },
      { value: 'not_ready', label: 'Not ready to invest right now' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
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
