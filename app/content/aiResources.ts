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
  'ML Frameworks',
  'Inference & Serving',
  'Benchmarks & Evals',
  'Prompts & Templates',
  'Learning Resources',
  'Research Papers',
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
    id: 'yupp-ai',
    title: 'Yupp.ai',
    description: 'Every AI for everyone. Check out the best answers from all the latest AIs for free. Win rewards. Shape the future of AI.',
    url: 'https://yupp.ai/',
    type: 'tool',
    category: 'Tools & Apps',
    tags: ['free', 'ai-comparison', 'rewards', 'multi-ai'],
    featured: true,
    createdAt: '2025-11-04'
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
  },
  // ML Frameworks & Libraries
  {
    id: 'huggingface-hub',
    title: 'Hugging Face Hub',
    description: 'The central place to host, discover, and use models & datasets with clear APIs and docs.',
    url: 'https://huggingface.co/docs/hub/en/index',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['models', 'datasets', 'hub', 'open-source'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'transformers',
    title: '🤗 Transformers',
    description: 'The de-facto Python library to load, fine-tune, and serve hundreds of pretrained Transformer models.',
    url: 'https://github.com/huggingface/transformers',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['python', 'models', 'fine-tuning', 'github'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'hf-datasets',
    title: '🤗 Datasets',
    description: 'Easy programmatic access to thousands of datasets (streaming, filters, loaders).',
    url: 'https://huggingface.co/docs/datasets/en/index',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['datasets', 'python', 'streaming', 'data-loading'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'peft',
    title: '🤗 PEFT',
    description: 'Parameter-efficient fine-tuning (e.g., LoRA/QLoRA) to adapt big models cheaply.',
    url: 'https://github.com/huggingface/peft',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['fine-tuning', 'lora', 'efficient', 'github'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'accelerate',
    title: '🤗 Accelerate',
    description: 'Minimal code changes to scale PyTorch training across GPUs/TPUs, mixed precision, FSDP.',
    url: 'https://github.com/huggingface/accelerate',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['pytorch', 'training', 'distributed', 'gpu'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'dspy',
    title: 'DSPy',
    description: 'Declarative "programming-not-prompting" framework that compiles LLM pipelines and optimizes prompts/weights.',
    url: 'https://github.com/stanfordnlp/dspy',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['framework', 'optimization', 'stanford', 'github'],
    createdAt: '2025-11-05'
  },
  {
    id: 'langchain',
    title: 'LangChain',
    description: 'Widely used framework for LLM apps/agents; integrations and agent orchestration (LangGraph).',
    url: 'https://github.com/langchain-ai/langchain',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['framework', 'agents', 'orchestration', 'github'],
    createdAt: '2025-11-05'
  },
  {
    id: 'llamaindex',
    title: 'LlamaIndex',
    description: 'Data framework to connect your data to LLMs (RAG pipelines, loaders, indices).',
    url: 'https://github.com/run-llama/llama_index',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['rag', 'data', 'indexing', 'github'],
    createdAt: '2025-11-05'
  },
  {
    id: 'openai-cookbook',
    title: 'OpenAI Cookbook',
    description: 'Practical recipes and patterns for building with OpenAI APIs (code samples, eval how-tos).',
    url: 'https://github.com/openai/openai-cookbook',
    type: 'tool',
    category: 'ML Frameworks',
    tags: ['openai', 'recipes', 'examples', 'github'],
    createdAt: '2025-11-05'
  },
  // Inference & Serving
  {
    id: 'vllm',
    title: 'vLLM',
    description: 'High-throughput, memory-efficient LLM server (PagedAttention, continuous batching) for fast inference at scale.',
    url: 'https://github.com/vllm-project/vllm',
    type: 'tool',
    category: 'Inference & Serving',
    tags: ['inference', 'server', 'performance', 'github'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'llamacpp',
    title: 'llama.cpp',
    description: 'Lightweight C/C++ inference to run quantized LLMs across CPUs/GPUs and edge devices.',
    url: 'https://github.com/ggml-org/llama.cpp',
    type: 'tool',
    category: 'Inference & Serving',
    tags: ['inference', 'cpp', 'quantization', 'edge'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'ollama',
    title: 'Ollama',
    description: 'Simple local model runner/manager with CLI & GUI; easy model pulls and serving.',
    url: 'https://ollama.com/',
    type: 'tool',
    category: 'Inference & Serving',
    tags: ['local', 'cli', 'models', 'easy'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'lm-studio',
    title: 'LM Studio',
    description: 'Free desktop app to browse, download and run local LLMs with GPU offload and dev SDKs.',
    url: 'https://lmstudio.ai/',
    type: 'tool',
    category: 'Inference & Serving',
    tags: ['desktop', 'local', 'gpu', 'free'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'open-webui',
    title: 'Open WebUI',
    description: 'Polished, self-hosted chat UI; runs offline; supports Ollama & OpenAI-compatible APIs; built-in RAG.',
    url: 'https://github.com/open-webui/open-webui',
    type: 'tool',
    category: 'Inference & Serving',
    tags: ['ui', 'self-hosted', 'rag', 'github'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'text-gen-webui',
    title: 'text-generation-webui',
    description: 'Popular local web UI supporting many backends (llama.cpp, Transformers, vLLM) and chat/instruct modes.',
    url: 'https://github.com/oobabooga/text-generation-webui',
    type: 'tool',
    category: 'Inference & Serving',
    tags: ['ui', 'local', 'multi-backend', 'github'],
    featured: true,
    createdAt: '2025-11-05'
  },
  // Benchmarks & Evaluations
  {
    id: 'lmsys-arena',
    title: 'LMSYS Chatbot Arena',
    description: 'Crowd-sourced, pairwise "arena" with Elo ratings—practical head-to-head model quality signals.',
    url: 'https://lmarena.ai/',
    type: 'tool',
    category: 'Benchmarks & Evals',
    tags: ['benchmark', 'leaderboard', 'elo', 'comparison'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'open-llm-leaderboard',
    title: 'Open LLM Leaderboard',
    description: 'Hugging Face\'s reproducible open-model leaderboard (harder tasks, updated methodology).',
    url: 'https://huggingface.co/collections/open-llm-leaderboard/open-llm-leaderboard-2',
    type: 'tool',
    category: 'Benchmarks & Evals',
    tags: ['leaderboard', 'evaluation', 'open-source', 'hf'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'stanford-helm',
    title: 'Stanford HELM',
    description: '"Living" benchmark emphasizing transparency; broad, scenario-based evaluation & leaderboards.',
    url: 'https://crfm.stanford.edu/helm/',
    type: 'tool',
    category: 'Benchmarks & Evals',
    tags: ['benchmark', 'stanford', 'evaluation', 'transparency'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'lm-eval-harness',
    title: 'lm-evaluation-harness',
    description: 'Unified framework for evaluating LLMs on many tasks; backbone for multiple leaderboards.',
    url: 'https://github.com/EleutherAI/lm-evaluation-harness',
    type: 'tool',
    category: 'Benchmarks & Evals',
    tags: ['evaluation', 'framework', 'eleuther', 'github'],
    featured: true,
    createdAt: '2025-11-05'
  },
  {
    id: 'mmlu',
    title: 'MMLU Benchmark',
    description: '57-task knowledge & reasoning exam across many subjects; common high-level benchmark.',
    url: 'https://arxiv.org/abs/2009.03300',
    type: 'article',
    category: 'Benchmarks & Evals',
    tags: ['benchmark', 'reasoning', 'knowledge', 'paper'],
    createdAt: '2025-11-05'
  },
  {
    id: 'gsm8k',
    title: 'GSM8K Benchmark',
    description: 'Grade-school math word-problem set; standard for testing arithmetic reasoning.',
    url: 'https://arxiv.org/abs/2110.14168',
    type: 'article',
    category: 'Benchmarks & Evals',
    tags: ['benchmark', 'math', 'reasoning', 'paper'],
    createdAt: '2025-11-05'
  },
  {
    id: 'bbh',
    title: 'BIG-Bench Hard (BBH)',
    description: 'Hard subset of BIG-bench used to stress reasoning; widely cited in LLM evals.',
    url: 'https://github.com/suzgunmirac/BIG-Bench-Hard',
    type: 'tool',
    category: 'Benchmarks & Evals',
    tags: ['benchmark', 'reasoning', 'hard', 'github'],
    createdAt: '2025-11-05'
  },
  {
    id: 'truthfulqa',
    title: 'TruthfulQA',
    description: 'Measures whether models avoid common human falsehoods—useful for evaluating truthfulness.',
    url: 'https://arxiv.org/abs/2109.07958',
    type: 'article',
    category: 'Benchmarks & Evals',
    tags: ['benchmark', 'truthfulness', 'safety', 'paper'],
    createdAt: '2025-11-05'
  },
  // Research Papers
  {
    id: 'attention-paper',
    title: 'Attention Is All You Need',
    description: 'The Transformer paper—foundation of modern LLMs and sequence modeling. Essential reading.',
    url: 'https://arxiv.org/abs/1706.03762',
    type: 'article',
    category: 'Research Papers',
    tags: ['paper', 'transformer', 'foundational', 'arxiv'],
    createdAt: '2025-11-05'
  },
  {
    id: 'chinchilla-paper',
    title: 'Training Compute-Optimal LLMs (Chinchilla)',
    description: 'Shows data-vs-params tradeoff; compute-optimal scaling guidance widely referenced.',
    url: 'https://arxiv.org/abs/2203.15556',
    type: 'article',
    category: 'Research Papers',
    tags: ['paper', 'scaling', 'optimization', 'arxiv'],
    createdAt: '2025-11-05'
  },
  {
    id: 'scaling-laws-paper',
    title: 'Scaling Laws for Neural Language Models',
    description: 'Early empirical scaling laws (loss vs parameters/data/compute); frames modern model scaling.',
    url: 'https://arxiv.org/abs/2001.08361',
    type: 'article',
    category: 'Research Papers',
    tags: ['paper', 'scaling', 'laws', 'arxiv'],
    createdAt: '2025-11-05'
  },
  {
    id: 'rag-paper',
    title: 'Retrieval-Augmented Generation (RAG)',
    description: 'Pioneering method that augments generation with non-parametric retrieval—core to production LLM apps.',
    url: 'https://arxiv.org/abs/2005.11401',
    type: 'article',
    category: 'Research Papers',
    tags: ['paper', 'rag', 'retrieval', 'arxiv'],
    createdAt: '2025-11-05'
  },
  {
    id: 'cot-paper',
    title: 'Chain-of-Thought Prompting',
    description: 'Shows that reasoning improves when models generate intermediate steps; key prompting idea.',
    url: 'https://arxiv.org/abs/2201.11903',
    type: 'article',
    category: 'Research Papers',
    tags: ['paper', 'prompting', 'reasoning', 'arxiv'],
    createdAt: '2025-11-05'
  },
  {
    id: 'constitutional-ai-paper',
    title: 'Constitutional AI',
    description: 'Anthropic\'s approach to align assistants via AI-guided feedback and principles.',
    url: 'https://arxiv.org/abs/2212.08073',
    type: 'article',
    category: 'Research Papers',
    tags: ['paper', 'alignment', 'safety', 'anthropic'],
    createdAt: '2025-11-05'
  },
  // Advanced Tools
  {
    id: 'epoch-ai',
    title: 'Epoch AI — ML Trends',
    description: 'Interactive charts on compute, models, and infrastructure trends across AI. Great for context.',
    url: 'https://epoch.ai/trends',
    type: 'tool',
    category: 'Advanced',
    tags: ['trends', 'analytics', 'research', 'data'],
    createdAt: '2025-11-05'
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
