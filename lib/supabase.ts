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

// Database types (you can expand this based on your Supabase schema)
export interface CTAResponse {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  current_role: string;
  biggest_challenge: string;
  time_commitment: string;
  specific_goal: string;
  urgency: string;
  source_url?: string;
  metadata?: Record<string, any>;
}
