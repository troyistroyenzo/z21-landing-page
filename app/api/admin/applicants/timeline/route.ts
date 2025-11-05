import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const supabase = supabaseAdmin();
    
    // Get all applicants from the past X days
    const startDate = subDays(new Date(), days);
    const { data, error } = await supabase
      .from('cta_responses')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[admin/applicants/timeline] Error:', error);
      throw error;
    }

    // Group by date
    const grouped = new Map<string, number>();
    
    // Initialize all dates with 0
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
      grouped.set(date, 0);
    }

    // Count applicants per date
    data?.forEach(applicant => {
      const date = format(new Date(applicant.created_at), 'yyyy-MM-dd');
      grouped.set(date, (grouped.get(date) || 0) + 1);
    });

    // Convert to array format for charting
    const timeline = Array.from(grouped.entries()).map(([date, count]) => ({
      date,
      count,
      displayDate: format(new Date(date), 'MMM dd')
    }));

    return NextResponse.json({ timeline });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch timeline';
    console.error('[admin/applicants/timeline] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
