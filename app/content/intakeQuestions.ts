export interface IntakeQuestion {
  id: string;
  section: number;
  type: 'text' | 'email' | 'multiline' | 'select' | 'multiselect' | 'checkbox' | 'url';
  label: string;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
  };
}

export const intakeQuestions: IntakeQuestion[] = [
  // Section 1 — About You & Your Business
  {
    id: 'fullName',
    section: 1,
    type: 'text',
    label: 'Full Name',
    placeholder: 'Juan Dela Cruz',
    validation: {
      required: true,
      errorMessage: 'Please enter your full name'
    }
  },
  {
    id: 'businessName',
    section: 1,
    type: 'text',
    label: 'Business / Brand Name',
    placeholder: 'Your Company Name',
    validation: {
      required: true,
      errorMessage: 'Please enter your business name'
    }
  },
  {
    id: 'email',
    section: 1,
    type: 'email',
    label: 'Email',
    placeholder: 'you@company.com',
    validation: {
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      errorMessage: 'Please enter a valid email address'
    }
  },
  {
    id: 'websiteLink',
    section: 1,
    type: 'url',
    label: 'Website or Main Social Media Link',
    placeholder: 'https://yourwebsite.com or https://instagram.com/yourhandle',
    validation: {
      required: false
    }
  },
  {
    id: 'businessDescription',
    section: 1,
    type: 'multiline',
    label: 'In one sentence, what does your business do?',
    placeholder: 'Example: We help property agents close more sales through automated client follow-ups.',
    description: 'Keep it concise and clear',
    validation: {
      required: true,
      minLength: 10,
      errorMessage: 'Please describe your business in at least 10 characters'
    }
  },
  {
    id: 'targetCustomers',
    section: 1,
    type: 'text',
    label: 'Who are your main customers or audience?',
    placeholder: 'Ex: home buyers, coaches, e-commerce, clinics, etc.',
    validation: {
      required: true,
      errorMessage: 'Please tell us about your target customers'
    }
  },

  // Section 2 — Your Current Setup
  {
    id: 'currentTools',
    section: 2,
    type: 'multiselect',
    label: 'What tools or platforms do you currently use for daily operations?',
    description: 'Check all that apply',
    options: [
      { label: 'Google Sheets / Excel', value: 'sheets_excel' },
      { label: 'Notion / ClickUp / Asana', value: 'project_management' },
      { label: 'Gmail / Outlook', value: 'email' },
      { label: 'Messenger / WhatsApp / SMS', value: 'messaging' },
      { label: 'CRM (HubSpot, GoHighLevel, etc.)', value: 'crm' },
      { label: 'Other', value: 'other' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select at least one tool'
    }
  },
  {
    id: 'leadContactMethod',
    section: 2,
    type: 'multiline',
    label: 'How do new leads or customers currently contact you?',
    placeholder: 'e.g., Mostly via Facebook Messenger and email',
    description: 'Be specific about your main channels',
    validation: {
      required: true,
      errorMessage: 'Please describe how leads contact you'
    }
  },
  {
    id: 'followUpProcess',
    section: 2,
    type: 'multiline',
    label: 'How are follow-ups or updates handled today?',
    placeholder: 'Manual, automated, handled by team, etc.',
    validation: {
      required: true,
      errorMessage: 'Please describe your follow-up process'
    }
  },

  // Section 3 — Goals for This Onboarding
  {
    id: 'topPriorities',
    section: 3,
    type: 'multiline',
    label: 'What are your top 3 priorities to automate or fix over the next 4 weeks?',
    placeholder: 'Ex: 1) Automate lead replies\n2) Create daily KPI dashboard\n3) Generate reports faster',
    description: 'List your top 3 priorities, one per line',
    validation: {
      required: true,
      minLength: 20,
      errorMessage: 'Please list at least 3 priorities'
    }
  },
  {
    id: 'successDefinition',
    section: 3,
    type: 'multiline',
    label: 'If we finished this onboarding and you said "This was totally worth it," what would we have accomplished?',
    placeholder: 'Describe what success looks like to you...',
    validation: {
      required: true,
      minLength: 20,
      errorMessage: 'Please describe what success looks like'
    }
  },
  {
    id: 'aiFamiliarity',
    section: 3,
    type: 'select',
    label: 'How familiar are you with AI tools (ChatGPT, n8n, etc.)?',
    options: [
      { label: 'Newbie (never used it)', value: 'newbie' },
      { label: 'Beginner (some exposure)', value: 'beginner' },
      { label: 'Intermediate (use it sometimes)', value: 'intermediate' },
      { label: 'Advanced (already build stuff with it)', value: 'advanced' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select your familiarity level'
    }
  },

  // Section 4 — Logistics
  {
    id: 'preferredSchedule',
    section: 4,
    type: 'multiselect',
    label: 'Preferred schedule for our weekly sessions',
    description: 'Select all that apply',
    options: [
      { label: 'Mon–Wed', value: 'mon_wed' },
      { label: 'Thu–Sat', value: 'thu_sat' },
      { label: 'Morning', value: 'morning' },
      { label: 'Afternoon', value: 'afternoon' },
      { label: 'Evening', value: 'evening' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select your preferred schedule'
    }
  },
  {
    id: 'timezone',
    section: 4,
    type: 'text',
    label: 'Time zone / working hours',
    placeholder: 'e.g., GMT+8 / 9am-5pm',
    validation: {
      required: true,
      errorMessage: 'Please provide your timezone'
    }
  },
  {
    id: 'teamMembers',
    section: 4,
    type: 'multiline',
    label: 'Will any team members join our calls? If yes, list names + roles.',
    placeholder: 'e.g., Maria Santos - Operations Manager\nJohn Doe - Marketing Lead',
    validation: {
      required: false
    }
  },
  {
    id: 'existingWorkflows',
    section: 4,
    type: 'multiline',
    label: 'Do you have any existing workflows or SOPs you would like us to review?',
    placeholder: 'Share links or describe your workflows here',
    description: 'You can paste links to documents, or describe them briefly',
    validation: {
      required: false
    }
  },

  // Section 5 — Optional
  {
    id: 'caseStudyConsent',
    section: 5,
    type: 'select',
    label: "Are you open to having your project featured (anonymously) as a case study once it's done?",
    options: [
      { label: 'Yes, no problem', value: 'yes' },
      { label: 'Maybe later', value: 'maybe' },
      { label: 'No, keep it private', value: 'no' }
    ],
    validation: {
      required: true,
      errorMessage: 'Please select an option'
    }
  },
  {
    id: 'additionalNotes',
    section: 5,
    type: 'multiline',
    label: 'Anything else I should know before we start?',
    placeholder: 'Any other context, concerns, or expectations...',
    validation: {
      required: false
    }
  }
];

export const sectionTitles = {
  1: 'About You & Your Business',
  2: 'Your Current Setup',
  3: 'Goals for This Onboarding',
  4: 'Logistics',
  5: 'Optional'
};

export const intakeThankYou = {
  title: '🎉 Intake Form Submitted!',
  subtitle: "We'll review your information and reach out within 24 hours",
  message: "You'll receive a confirmation email shortly. We're excited to start building with you!",
  ctaText: 'Explore Free AI Resources',
  ctaLink: '/ai-resources'
};
