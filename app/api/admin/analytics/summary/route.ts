import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const supabase = supabaseAdmin();
    const now = new Date();
    const startDate = subDays(now, days);
    const prevStartDate = subDays(now, days * 2);
    const prevEndDate = subDays(now, days);

    // Current period data
    const { data: currentData, error: currentError } = await supabase
      .from('page_views')
      .select('session_id, page_path')
      .gte('created_at', startDate.toISOString());

    if (currentError) {
      console.error('Error fetching current analytics:', currentError);
      throw currentError;
    }

    // Previous period data
    const { data: prevData, error: prevError } = await supabase
      .from('page_views')
      .select('session_id, page_path')
      .gte('created_at', prevStartDate.toISOString())
      .lt('created_at', prevEndDate.toISOString());

    if (prevError) {
      console.error('Error fetching previous analytics:', prevError);
      throw prevError;
    }

    // Calculate metrics
    const currentViews = currentData?.length || 0;
    const prevViews = prevData?.length || 0;
    
    const currentSessions = new Set(currentData?.map(d => d.session_id) || []);
    const prevSessions = new Set(prevData?.map(d => d.session_id) || []);
    
    const currentVisitors = currentSessions.size;
    const prevVisitors = prevSessions.size;

    // Calculate bounce rate (sessions with only 1 page view)
    const sessionPageCounts = new Map<string, number>();
    currentData?.forEach(view => {
      const count = sessionPageCounts.get(view.session_id) || 0;
      sessionPageCounts.set(view.session_id, count + 1);
    });
    
    const bouncedSessions = Array.from(sessionPageCounts.values()).filter(count => count === 1).length;
    const bounceRate = currentSessions.size > 0 ? 
      Math.round((bouncedSessions / currentSessions.size) * 100) : 0;

    // Previous bounce rate
    const prevSessionPageCounts = new Map<string, number>();
    prevData?.forEach(view => {
      const count = prevSessionPageCounts.get(view.session_id) || 0;
      prevSessionPageCounts.set(view.session_id, count + 1);
    });
    
    const prevBouncedSessions = Array.from(prevSessionPageCounts.values()).filter(count => count === 1).length;
    const prevBounceRate = prevSessions.size > 0 ? 
      Math.round((prevBouncedSessions / prevSessions.size) * 100) : 0;

    return NextResponse.json({
      visitors: {
        value: currentVisitors,
        change: prevVisitors > 0 ? 
          Math.round(((currentVisitors - prevVisitors) / prevVisitors) * 100) : 100
      },
      pageViews: {
        value: currentViews,
        change: prevViews > 0 ? 
          Math.round(((currentViews - prevViews) / prevViews) * 100) : 100
      },
      bounceRate: {
        value: bounceRate,
        change: bounceRate - prevBounceRate
      },
      days
    });
  } catch (error: any) {
    console.error('Analytics summary error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
