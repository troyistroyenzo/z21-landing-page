-- Create ai_resources table
CREATE TABLE IF NOT EXISTS ai_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tool', 'article', 'video', 'prompt-library', 'course', 'forum')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for common queries
CREATE INDEX IF NOT EXISTS idx_ai_resources_category ON ai_resources(category);
CREATE INDEX IF NOT EXISTS idx_ai_resources_featured ON ai_resources(featured);
CREATE INDEX IF NOT EXISTS idx_ai_resources_type ON ai_resources(type);

-- Enable RLS
ALTER TABLE ai_resources ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view resources)
CREATE POLICY "Public can view resources"
  ON ai_resources
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated service role can modify
CREATE POLICY "Service role can modify resources"
  ON ai_resources
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed data from existing aiResources.ts
-- This preserves all 43 existing resources
INSERT INTO ai_resources (id, title, description, url, type, category, tags, featured, created_at) VALUES
('chat-z-ai', 'Z.AI Chat', 'Free AI chatbot tools for various use cases - no login required', 'https://chat.z.ai/', 'tool', 'Getting Started', ARRAY['free', 'chat', 'beginner-friendly', 'no-signup'], true, '2025-11-03'),
('yupp-ai', 'Yupp.ai', 'Every AI for everyone. Check out the best answers from all the latest AIs for free. Win rewards. Shape the future of AI.', 'https://yupp.ai/', 'tool', 'Tools & Apps', ARRAY['free', 'ai-comparison', 'rewards', 'multi-ai'], true, '2025-11-04'),
('chatgpt', 'ChatGPT', 'OpenAI''s powerful conversational AI - free tier available', 'https://chat.openai.com/', 'tool', 'Tools & Apps', ARRAY['free-tier', 'chat', 'OpenAI', 'popular'], true, '2025-11-03'),
('claude-ai', 'Claude', 'Anthropic''s AI assistant with strong coding and analysis capabilities', 'https://claude.ai/', 'tool', 'Tools & Apps', ARRAY['free-tier', 'coding', 'analysis', 'Anthropic'], true, '2025-11-03'),
('perplexity', 'Perplexity AI', 'AI-powered search engine with real-time information', 'https://www.perplexity.ai/', 'tool', 'Tools & Apps', ARRAY['free', 'search', 'research', 'real-time'], false, '2025-11-03'),
('awesome-chatgpt-prompts', 'Awesome ChatGPT Prompts', 'Curated collection of prompt examples for various use cases', 'https://github.com/f/awesome-chatgpt-prompts', 'prompt-library', 'Prompts & Templates', ARRAY['free', 'prompts', 'github', 'community'], true, '2025-11-03'),
('learn-prompting', 'Learn Prompting', 'Free open-source course on prompt engineering', 'https://learnprompting.org/', 'course', 'Learning Resources', ARRAY['free', 'course', 'prompt-engineering', 'beginner'], false, '2025-11-03'),
('midjourney-guide', 'Midjourney Beginner''s Guide', 'Comprehensive guide to creating AI art with Midjourney', 'https://docs.midjourney.com/docs/quick-start', 'article', 'Learning Resources', ARRAY['free', 'AI-art', 'tutorial', 'creative'], false, '2025-11-03'),
('huggingface', 'Hugging Face', 'Open-source AI model repository and community', 'https://huggingface.co/', 'tool', 'Advanced', ARRAY['free', 'open-source', 'models', 'community'], false, '2025-11-03'),
('reddit-localllama', 'r/LocalLLaMA', 'Reddit community for running AI models locally', 'https://www.reddit.com/r/LocalLLaMA/', 'forum', 'Communities', ARRAY['free', 'community', 'local-ai', 'reddit'], false, '2025-11-03'),
('ai-tools-directory', 'There''s An AI For That', 'Comprehensive directory of AI tools for every use case', 'https://theresanaiforthat.com/', 'tool', 'Getting Started', ARRAY['free', 'directory', 'discovery', 'tools'], false, '2025-11-03'),
('google-bard', 'Google Gemini (Bard)', 'Google''s AI chatbot with internet access and image generation', 'https://gemini.google.com/', 'tool', 'Tools & Apps', ARRAY['free', 'Google', 'chat', 'internet-access'], false, '2025-11-03'),
('prompt-engineering-guide', 'Prompt Engineering Guide', 'Comprehensive guide by DAIR.AI on prompt engineering techniques', 'https://www.promptingguide.ai/', 'course', 'Learning Resources', ARRAY['free', 'technical', 'guide', 'advanced'], false, '2025-11-03'),
('huggingface-hub', 'Hugging Face Hub', 'The central place to host, discover, and use models & datasets with clear APIs and docs.', 'https://huggingface.co/docs/hub/en/index', 'tool', 'ML Frameworks', ARRAY['models', 'datasets', 'hub', 'open-source'], true, '2025-11-05'),
('transformers', '🤗 Transformers', 'The de-facto Python library to load, fine-tune, and serve hundreds of pretrained Transformer models.', 'https://github.com/huggingface/transformers', 'tool', 'ML Frameworks', ARRAY['python', 'models', 'fine-tuning', 'github'], true, '2025-11-05'),
('hf-datasets', '🤗 Datasets', 'Easy programmatic access to thousands of datasets (streaming, filters, loaders).', 'https://huggingface.co/docs/datasets/en/index', 'tool', 'ML Frameworks', ARRAY['datasets', 'python', 'streaming', 'data-loading'], true, '2025-11-05'),
('peft', '🤗 PEFT', 'Parameter-efficient fine-tuning (e.g., LoRA/QLoRA) to adapt big models cheaply.', 'https://github.com/huggingface/peft', 'tool', 'ML Frameworks', ARRAY['fine-tuning', 'lora', 'efficient', 'github'], true, '2025-11-05'),
('accelerate', '🤗 Accelerate', 'Minimal code changes to scale PyTorch training across GPUs/TPUs, mixed precision, FSDP.', 'https://github.com/huggingface/accelerate', 'tool', 'ML Frameworks', ARRAY['pytorch', 'training', 'distributed', 'gpu'], true, '2025-11-05'),
('dspy', 'DSPy', 'Declarative "programming-not-prompting" framework that compiles LLM pipelines and optimizes prompts/weights.', 'https://github.com/stanfordnlp/dspy', 'tool', 'ML Frameworks', ARRAY['framework', 'optimization', 'stanford', 'github'], false, '2025-11-05'),
('langchain', 'LangChain', 'Widely used framework for LLM apps/agents; integrations and agent orchestration (LangGraph).', 'https://github.com/langchain-ai/langchain', 'tool', 'ML Frameworks', ARRAY['framework', 'agents', 'orchestration', 'github'], false, '2025-11-05'),
('llamaindex', 'LlamaIndex', 'Data framework to connect your data to LLMs (RAG pipelines, loaders, indices).', 'https://github.com/run-llama/llama_index', 'tool', 'ML Frameworks', ARRAY['rag', 'data', 'indexing', 'github'], false, '2025-11-05'),
('openai-cookbook', 'OpenAI Cookbook', 'Practical recipes and patterns for building with OpenAI APIs (code samples, eval how-tos).', 'https://github.com/openai/openai-cookbook', 'tool', 'ML Frameworks', ARRAY['openai', 'recipes', 'examples', 'github'], false, '2025-11-05'),
('vllm', 'vLLM', 'High-throughput, memory-efficient LLM server (PagedAttention, continuous batching) for fast inference at scale.', 'https://github.com/vllm-project/vllm', 'tool', 'Inference & Serving', ARRAY['inference', 'server', 'performance', 'github'], true, '2025-11-05'),
('llamacpp', 'llama.cpp', 'Lightweight C/C++ inference to run quantized LLMs across CPUs/GPUs and edge devices.', 'https://github.com/ggml-org/llama.cpp', 'tool', 'Inference & Serving', ARRAY['inference', 'cpp', 'quantization', 'edge'], true, '2025-11-05'),
('ollama', 'Ollama', 'Simple local model runner/manager with CLI & GUI; easy model pulls and serving.', 'https://ollama.com/', 'tool', 'Inference & Serving', ARRAY['local', 'cli', 'models', 'easy'], true, '2025-11-05'),
('lm-studio', 'LM Studio', 'Free desktop app to browse, download and run local LLMs with GPU offload and dev SDKs.', 'https://lmstudio.ai/', 'tool', 'Inference & Serving', ARRAY['desktop', 'local', 'gpu', 'free'], true, '2025-11-05'),
('open-webui', 'Open WebUI', 'Polished, self-hosted chat UI; runs offline; supports Ollama & OpenAI-compatible APIs; built-in RAG.', 'https://github.com/open-webui/open-webui', 'tool', 'Inference & Serving', ARRAY['ui', 'self-hosted', 'rag', 'github'], true, '2025-11-05'),
('text-gen-webui', 'text-generation-webui', 'Popular local web UI supporting many backends (llama.cpp, Transformers, vLLM) and chat/instruct modes.', 'https://github.com/oobabooga/text-generation-webui', 'tool', 'Inference & Serving', ARRAY['ui', 'local', 'multi-backend', 'github'], true, '2025-11-05'),
('lmsys-arena', 'LMSYS Chatbot Arena', 'Crowd-sourced, pairwise "arena" with Elo ratings—practical head-to-head model quality signals.', 'https://lmarena.ai/', 'tool', 'Benchmarks & Evals', ARRAY['benchmark', 'leaderboard', 'elo', 'comparison'], true, '2025-11-05'),
('open-llm-leaderboard', 'Open LLM Leaderboard', 'Hugging Face''s reproducible open-model leaderboard (harder tasks, updated methodology).', 'https://huggingface.co/collections/open-llm-leaderboard/open-llm-leaderboard-2', 'tool', 'Benchmarks & Evals', ARRAY['leaderboard', 'evaluation', 'open-source', 'hf'], true, '2025-11-05'),
('stanford-helm', 'Stanford HELM', '"Living" benchmark emphasizing transparency; broad, scenario-based evaluation & leaderboards.', 'https://crfm.stanford.edu/helm/', 'tool', 'Benchmarks & Evals', ARRAY['benchmark', 'stanford', 'evaluation', 'transparency'], true, '2025-11-05'),
('lm-eval-harness', 'lm-evaluation-harness', 'Unified framework for evaluating LLMs on many tasks; backbone for multiple leaderboards.', 'https://github.com/EleutherAI/lm-evaluation-harness', 'tool', 'Benchmarks & Evals', ARRAY['evaluation', 'framework', 'eleuther', 'github'], true, '2025-11-05'),
('mmlu', 'MMLU Benchmark', '57-task knowledge & reasoning exam across many subjects; common high-level benchmark.', 'https://arxiv.org/abs/2009.03300', 'article', 'Benchmarks & Evals', ARRAY['benchmark', 'reasoning', 'knowledge', 'paper'], false, '2025-11-05'),
('gsm8k', 'GSM8K Benchmark', 'Grade-school math word-problem set; standard for testing arithmetic reasoning.', 'https://arxiv.org/abs/2110.14168', 'article', 'Benchmarks & Evals', ARRAY['benchmark', 'math', 'reasoning', 'paper'], false, '2025-11-05'),
('bbh', 'BIG-Bench Hard (BBH)', 'Hard subset of BIG-bench used to stress reasoning; widely cited in LLM evals.', 'https://github.com/suzgunmirac/BIG-Bench-Hard', 'tool', 'Benchmarks & Evals', ARRAY['benchmark', 'reasoning', 'hard', 'github'], false, '2025-11-05'),
('truthfulqa', 'TruthfulQA', 'Measures whether models avoid common human falsehoods—useful for evaluating truthfulness.', 'https://arxiv.org/abs/2109.07958', 'article', 'Benchmarks & Evals', ARRAY['benchmark', 'truthfulness', 'safety', 'paper'], false, '2025-11-05'),
('attention-paper', 'Attention Is All You Need', 'The Transformer paper—foundation of modern LLMs and sequence modeling. Essential reading.', 'https://arxiv.org/abs/1706.03762', 'article', 'Research Papers', ARRAY['paper', 'transformer', 'foundational', 'arxiv'], false, '2025-11-05'),
('chinchilla-paper', 'Training Compute-Optimal LLMs (Chinchilla)', 'Shows data-vs-params tradeoff; compute-optimal scaling guidance widely referenced.', 'https://arxiv.org/abs/2203.15556', 'article', 'Research Papers', ARRAY['paper', 'scaling', 'optimization', 'arxiv'], false, '2025-11-05'),
('scaling-laws-paper', 'Scaling Laws for Neural Language Models', 'Early empirical scaling laws (loss vs parameters/data/compute); frames modern model scaling.', 'https://arxiv.org/abs/2001.08361', 'article', 'Research Papers', ARRAY['paper', 'scaling', 'laws', 'arxiv'], false, '2025-11-05'),
('rag-paper', 'Retrieval-Augmented Generation (RAG)', 'Pioneering method that augments generation with non-parametric retrieval—core to production LLM apps.', 'https://arxiv.org/abs/2005.11401', 'article', 'Research Papers', ARRAY['paper', 'rag', 'retrieval', 'arxiv'], false, '2025-11-05'),
('cot-paper', 'Chain-of-Thought Prompting', 'Shows that reasoning improves when models generate intermediate steps; key prompting idea.', 'https://arxiv.org/abs/2201.11903', 'article', 'Research Papers', ARRAY['paper', 'prompting', 'reasoning', 'arxiv'], false, '2025-11-05'),
('constitutional-ai-paper', 'Constitutional AI', 'Anthropic''s approach to align assistants via AI-guided feedback and principles.', 'https://arxiv.org/abs/2212.08073', 'article', 'Research Papers', ARRAY['paper', 'alignment', 'safety', 'anthropic'], false, '2025-11-05'),
('epoch-ai', 'Epoch AI — ML Trends', 'Interactive charts on compute, models, and infrastructure trends across AI. Great for context.', 'https://epoch.ai/trends', 'tool', 'Advanced', ARRAY['trends', 'analytics', 'research', 'data'], false, '2025-11-05')
ON CONFLICT (id) DO NOTHING;
