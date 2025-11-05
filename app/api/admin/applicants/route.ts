import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Normalize DB row -> UI shape
function mapApplicant(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    business_description: row.work_description ?? row.business_description ?? '',
    score: row.fit_score ?? row.score ?? 0,
    qualification_status: row.qualification_status ?? null,
    created_at: row.created_at
  };
}

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from('cta_responses')
      .select('id, name, email, work_description, fit_score, qualification_status, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      throw error;
    }

    const normalized = (data || []).map(mapApplicant);
    return NextResponse.json({ applicants: normalized });
  } catch (error: any) {
    const message = error?.message || 'Failed to load applicants';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
