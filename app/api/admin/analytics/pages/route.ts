import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const supabase = supabaseAdmin();
    const startDate = subDays(new Date(), days - 1);
    
    // Get page views with session info
    const { data, error } = await supabase
      .from('page_views')
      .select('page_path, session_id')
      .gte('created_at', startDate.toISOString());

    if (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }

    // Group by page path
    const pageStats = new Map<string, Set<string>>();
    
    data?.forEach(view => {
      if (!pageStats.has(view.page_path)) {
        pageStats.set(view.page_path, new Set());
      }
      pageStats.get(view.page_path)?.add(view.session_id);
    });

    // Convert to sorted array
    const pages = Array.from(pageStats.entries())
      .map(([path, sessions]) => ({
        path,
        views: data?.filter(v => v.page_path === path).length || 0,
        visitors: sessions.size
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10); // Top 10 pages

    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error('Analytics pages error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
