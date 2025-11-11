import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { subDays, format } from 'date-fns';

/**
 * Page Views timeline for Admin Overview
 * Returns [{ date: 'YYYY-MM-DD', displayDate: 'Nov 10', count: number }]
 * 
 * Uses self-hosted analytics via Supabase page_views table
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Math.max(1, parseInt(searchParams.get('days') || '30'));
    
    const supabase = supabaseAdmin();
    const startDate = subDays(new Date(), days - 1);
    
    // Get page views from Supabase
    const { data, error } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching page views timeline:', error);
      throw error;
    }

    // Initialize all days with 0
    const grouped = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const dateKey = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
      grouped.set(dateKey, 0);
    }
    
    // Count views per day
    data?.forEach(view => {
      const dateKey = format(new Date(view.created_at), 'yyyy-MM-dd');
      grouped.set(dateKey, (grouped.get(dateKey) || 0) + 1);
    });

    const timeline = Array.from(grouped.entries()).map(([date, count]) => ({
      date,
      count,
      displayDate: format(new Date(date), 'MMM dd'),
    }));

    return NextResponse.json({ timeline, source: 'supabase' });
  } catch (err: any) {
    const message = err?.message || 'Failed to fetch page views timeline';
    console.error('[admin/page-views/timeline] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
