export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'tool' | 'article' | 'video' | 'prompt-library' | 'course' | 'forum';
  category: string;
  tags: string[];
  featured?: boolean;
  thumbnail?: string;
  createdAt: string;
}

export const resourceCategories = [
  'All',
  'Getting Started',
  'Tools & Apps',
  'Prompts & Templates',
  'Learning Resources',
  'Communities',
  'Advanced'
];

export const resources: Resource[] = [
  {
    id: 'chat-z-ai',
    title: 'Z.AI Chat',
    description: 'Free AI chatbot tools for various use cases - no login required',
    url: 'https://chat.z.ai/',
    type: 'tool',
    category: 'Getting Started',
    tags: ['free', 'chat', 'beginner-friendly', 'no-signup'],
    featured: true,
    createdAt: '2025-11-03'
  },
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    description: 'OpenAI\'s powerful conversational AI - free tier available',
    url: 'https://chat.openai.com/',
    type: 'tool',
    category: 'Tools & Apps',
    tags: ['free-tier', 'chat', 'OpenAI', 'popular'],
    featured: true,
    createdAt: '2025-11-03'
  },
  {
    id: 'claude-ai',
    title: 'Claude',
    description: 'Anthropic\'s AI assistant with strong coding and analysis capabilities',
    url: 'https://claude.ai/',
    type: 'tool',
    category: 'Tools & Apps',
    tags: ['free-tier', 'coding', 'analysis', 'Anthropic'],
    featured: true,
    createdAt: '2025-11-03'
  },
  {
    id: 'perplexity',
    title: 'Perplexity AI',
    description: 'AI-powered search engine with real-time information',
    url: 'https://www.perplexity.ai/',
    type: 'tool',
    category: 'Tools & Apps',
    tags: ['free', 'search', 'research', 'real-time'],
    createdAt: '2025-11-03'
  },
  {
    id: 'awesome-chatgpt-prompts',
    title: 'Awesome ChatGPT Prompts',
    description: 'Curated collection of prompt examples for various use cases',
    url: 'https://github.com/f/awesome-chatgpt-prompts',
    type: 'prompt-library',
    category: 'Prompts & Templates',
    tags: ['free', 'prompts', 'github', 'community'],
    featured: true,
    createdAt: '2025-11-03'
  },
  {
    id: 'learn-prompting',
    title: 'Learn Prompting',
    description: 'Free open-source course on prompt engineering',
    url: 'https://learnprompting.org/',
    type: 'course',
    category: 'Learning Resources',
    tags: ['free', 'course', 'prompt-engineering', 'beginner'],
    createdAt: '2025-11-03'
  },
  {
    id: 'midjourney-guide',
    title: 'Midjourney Beginner\'s Guide',
    description: 'Comprehensive guide to creating AI art with Midjourney',
    url: 'https://docs.midjourney.com/docs/quick-start',
    type: 'article',
    category: 'Learning Resources',
    tags: ['free', 'AI-art', 'tutorial', 'creative'],
    createdAt: '2025-11-03'
  },
  {
    id: 'huggingface',
    title: 'Hugging Face',
    description: 'Open-source AI model repository and community',
    url: 'https://huggingface.co/',
    type: 'tool',
    category: 'Advanced',
    tags: ['free', 'open-source', 'models', 'community'],
    createdAt: '2025-11-03'
  },
  {
    id: 'reddit-localllama',
    title: 'r/LocalLLaMA',
    description: 'Reddit community for running AI models locally',
    url: 'https://www.reddit.com/r/LocalLLaMA/',
    type: 'forum',
    category: 'Communities',
    tags: ['free', 'community', 'local-ai', 'reddit'],
    createdAt: '2025-11-03'
  },
  {
    id: 'ai-tools-directory',
    title: 'There\'s An AI For That',
    description: 'Comprehensive directory of AI tools for every use case',
    url: 'https://theresanaiforthat.com/',
    type: 'tool',
    category: 'Getting Started',
    tags: ['free', 'directory', 'discovery', 'tools'],
    createdAt: '2025-11-03'
  },
  {
    id: 'google-bard',
    title: 'Google Gemini (Bard)',
    description: 'Google\'s AI chatbot with internet access and image generation',
    url: 'https://gemini.google.com/',
    type: 'tool',
    category: 'Tools & Apps',
    tags: ['free', 'Google', 'chat', 'internet-access'],
    createdAt: '2025-11-03'
  },
  {
    id: 'prompt-engineering-guide',
    title: 'Prompt Engineering Guide',
    description: 'Comprehensive guide by DAIR.AI on prompt engineering techniques',
    url: 'https://www.promptingguide.ai/',
    type: 'course',
    category: 'Learning Resources',
    tags: ['free', 'technical', 'guide', 'advanced'],
    createdAt: '2025-11-03'
  }
];

// Helper function to filter resources
export function filterResources(
  category?: string,
  type?: string,
  searchQuery?: string
): Resource[] {
  let filtered = [...resources];

  if (category && category !== 'All') {
    filtered = filtered.filter(r => r.category === category);
  }

  if (type) {
    filtered = filtered.filter(r => r.type === type);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

// Get featured resources
export function getFeaturedResources(): Resource[] {
  return resources.filter(r => r.featured);
}
