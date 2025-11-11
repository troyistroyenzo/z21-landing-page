import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Math.max(1, parseInt(searchParams.get('days') || '30'));

    const supabase = supabaseAdmin();

    // Query all newsletter subscribers for the past N days
    const startDate = subDays(new Date(), days);
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('subscribed_at')
      .gte('subscribed_at', startDate.toISOString())
      .order('subscribed_at', { ascending: true });

    if (error) {
      console.error('[admin/subscribers/timeline] Supabase error:', error);
      throw error;
    }

    // Initialize a map of dates with zero counts
    const grouped = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const dateKey = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
      grouped.set(dateKey, 0);
    }

    // Count subscribers per day
    data?.forEach((row) => {
      const dateKey = format(new Date(row.subscribed_at as string), 'yyyy-MM-dd');
      grouped.set(dateKey, (grouped.get(dateKey) || 0) + 1);
    });

    // Convert to array format expected by Recharts UI
    const timeline = Array.from(grouped.entries()).map(([date, count]) => ({
      date,
      count,
      displayDate: format(new Date(date), 'MMM dd'),
    }));

    return NextResponse.json({ timeline });
  } catch (err: any) {
    const message = err?.message || 'Failed to fetch subscribers timeline';
    console.error('[admin/subscribers/timeline] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
