import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resources } from '@/app/content/aiResources';

export async function GET() {
  try {
    // Early env validation so errors are explicit
    const missing: string[] = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    if (missing.length) {
      const msg = `Missing required env vars: ${missing.join(', ')}. Add to .env.local and restart dev server.`;
      console.error('[admin/stats] Env error:', msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const supabase = supabaseAdmin();

    // Total applicants
    const { count: totalApplicants, error: applicantsErr } = await supabase
      .from('cta_responses')
      .select('*', { count: 'exact', head: true });

    // Qualified leads (fit_score >= 8)
    const { count: qualifiedLeads, error: qualifiedErr } = await supabase
      .from('cta_responses')
      .select('*', { count: 'exact', head: true })
      .gte('fit_score', 8);

    // Newsletter subscribers
    const { count: newsletterSubscribers, error: subsErr } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    if (applicantsErr || qualifiedErr || subsErr) {
      const err = applicantsErr || qualifiedErr || subsErr;
      console.error('[admin/stats] Supabase error:', err);
      throw err;
    }

    return NextResponse.json({
      totalApplicants: totalApplicants ?? 0,
      qualifiedLeads: qualifiedLeads ?? 0,
      newsletterSubscribers: newsletterSubscribers ?? 0,
      resourcesCount: resources.length
    });
  } catch (error: any) {
    // Common causes: missing envs, table not found, permission issues
    const message = error?.message || 'Failed to load stats';
    console.error('[admin/stats] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
