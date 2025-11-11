import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const supabase = supabaseAdmin();
    const startDate = subDays(new Date(), days - 1);
    
    // Get page views grouped by day
    const { data, error } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching timeline:', error);
      throw error;
    }

    // Group by date
    const grouped = new Map<string, number>();
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
      grouped.set(date, 0);
    }
    
    // Count views per day
    data?.forEach(view => {
      const date = format(new Date(view.created_at), 'yyyy-MM-dd');
      grouped.set(date, (grouped.get(date) || 0) + 1);
    });

    const timeline = Array.from(grouped.entries()).map(([date, count]) => ({
      date,
      count,
      displayDate: format(new Date(date), 'MMM dd')
    }));

    return NextResponse.json({ timeline, source: 'supabase' });
  } catch (error: any) {
    console.error('Analytics timeline error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}
