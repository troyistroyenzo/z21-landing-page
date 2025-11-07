import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Public API endpoint - uses anon key for read-only access
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at'; // created_at, click_count, last_clicked_at
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Create public client for read-only access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let query = supabase
      .from('ai_resources')
      .select('*', { count: 'exact' });

    // Apply filters
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    if (sortBy === 'trending') {
      // Trending: Recently clicked items (last 7 days) with high click count
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query
        .gte('last_clicked_at', sevenDaysAgo)
        .order('click_count', { ascending: false });
    } else if (sortBy === 'engagement') {
      // Sort by engagement score (clicks * 2 + views * 0.5)
      query = query.order('engagement_score', { ascending: false });
    } else {
      query = query.order(sortBy, { ascending: order === 'asc' });
    }

    // Pagination
    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('[resources] Error:', error);
      throw error;
    }

    // Note: View count tracking could be added here if needed
    // For now, we'll track clicks when users actually click on resources

    return NextResponse.json({
      resources: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error) || 'Failed to fetch resources';
    console.error('[resources] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
