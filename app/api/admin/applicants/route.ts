import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Normalize DB row -> UI shape
interface DBRow {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  work_description?: string | null;
  business_description?: string | null;
  fit_score?: number | null;
  fit_tier?: string | null;
  score?: number | null;
  score_breakdown?: unknown;
  qualification_status?: string | null;
  monthly_revenue?: string | null;
  ai_readiness?: number | null;
  start_timeline?: string | null;
  time_commitment?: string | null;
  sprint_goals?: unknown;
  focus_areas?: unknown;
  tool_stack?: unknown;
  sample_data?: unknown;
  workflow_owner?: string | null;
  investment_readiness?: string | null;
  stuck_areas?: unknown;
  experience_level?: string | null;
  created_at?: string;
}

function mapApplicant(row: DBRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    business_description: row.work_description ?? row.business_description ?? '',
    score: row.fit_score ?? row.score ?? 0,
    fit_score: row.fit_score ?? 0,
    fit_tier: row.fit_tier,
    score_breakdown: row.score_breakdown,
    qualification_status: row.qualification_status ?? null,
    answers: {
      businessName: row.name,
      monthlyRevenue: row.monthly_revenue,
      aiReadiness: row.ai_readiness,
      startTimeline: row.start_timeline,
      timeCommitment: row.time_commitment,
      sprintGoals: row.sprint_goals,
      focusAreas: row.focus_areas,
      toolStack: row.tool_stack,
      sampleData: row.sample_data,
      workflowOwner: row.workflow_owner,
      investmentReadiness: row.investment_readiness,
      stuckAreas: row.stuck_areas,
      experienceLevel: row.experience_level
    },
    created_at: row.created_at
  };
}

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from('cta_responses')
      .select(`
        id, 
        name, 
        email,
        phone,
        work_description, 
        fit_score,
        fit_tier,
        score_breakdown,
        qualification_status,
        monthly_revenue,
        ai_readiness,
        start_timeline,
        time_commitment,
        sprint_goals,
        focus_areas,
        tool_stack,
        sample_data,
        workflow_owner,
        investment_readiness,
        stuck_areas,
        experience_level,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      throw error;
    }

    const normalized = (data || []).map(mapApplicant);
    return NextResponse.json({ applicants: normalized });
  } catch (error: unknown) {
    const message = (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string')
      ? (error as { message: string }).message
      : 'Failed to load applicants';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
