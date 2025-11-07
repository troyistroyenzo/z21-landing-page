import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { searchQuery, resultsCount, userSession } = await request.json();

    if (!searchQuery) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from('resource_searches')
      .insert({
        search_query: searchQuery,
        results_count: resultsCount || 0,
        user_session: userSession || null
      });

    if (error) {
      console.error('[search/log] Error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const message = error?.message || 'Failed to log search';
    console.error('[search/log] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
