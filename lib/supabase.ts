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
  
  // Basic Info
  name: string;
  work_description: string;
  social_handle?: string | null; // NEW
  phone?: string | null; // NEW
  email: string;
  referral_source: string;
  
  // Path Choice
  sprint_type: 'ai_onboarding' | 'personal_branding';
  
  // Experience & Context
  experience_level?: string | null; // NEW: 0-6, 6-24, 2-5, 5+
  stuck_areas?: any | null; // NEW: JSONB array
  monthly_revenue?: string | null; // NEW
  
  // Goals & Readiness
  sprint_goals?: any | null; // NEW: JSONB array
  time_commitment?: string | null;
  start_timeline?: string | null;
  ai_readiness?: number | null; // 0-10 scale
  tool_stack?: any | null; // JSONB array
  focus_areas?: any | null; // JSONB array
  sample_data?: string | null;
  workflow_owner?: string | null; // NEW: me, team, not_sure
  investment_readiness?: string | null; // NEW: ready, installment, tight
  
  // Scoring & Qualification
  fit_score?: number | null;
  has_knockout?: boolean;
  qualification_status?: 'strong_fit' | 'conditional' | 'not_qualified' | null;
  
  // Tracking
  source_url?: string;
  metadata?: Record<string, any>;
}
