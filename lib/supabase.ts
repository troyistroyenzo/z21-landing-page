import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side Supabase client (for public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for protected operations)
export const supabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Database types for CTA Responses
export interface CTAResponse {
  id?: string;
  created_at?: string;
  
  // Basic Info (Q1-Q5)
  name: string;
  work_description: string;
  profile_link: string;
  email: string;
  referral_source: string;
  
  // Path Choice (Q6)
  sprint_type: 'ai_onboarding' | 'personal_branding';
  
  // AI Onboarding Path (Q7-Q20) - Optional, depends on sprint_type
  ai_motivation?: string | null;
  role_description?: string | null;
  time_commitment?: string | null;
  start_timeline?: string | null;
  ai_readiness?: number | null; // 0-10 scale
  tool_stack?: any | null; // JSONB array
  focus_areas?: any | null; // JSONB array
  sample_data?: string | null; // 'yes' or 'no'
  dwy_confirmation?: string | null; // 'yes' or 'no'
  preferred_format?: string | null;
  success_metrics?: any | null; // JSONB array
  budget_readiness?: string | null;
  additional_info?: string | null;
  confirmations?: any | null; // JSONB array
  
  // Scoring & Qualification
  fit_score?: number | null;
  has_knockout?: boolean;
  qualification_status?: 'strong_fit' | 'conditional' | 'not_qualified' | null;
  
  // Tracking
  source_url?: string;
  metadata?: Record<string, any>;
}
