import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const supabase = supabaseAdmin();

    // First get the current click count
    const { data: currentData, error: fetchError } = await supabase
      .from('ai_resources')
      .select('click_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('[resources/click] Fetch error:', fetchError);
      throw fetchError;
    }

    const currentClickCount = currentData?.click_count || 0;

    // Then update with incremented value
    const { data, error } = await supabase
      .from('ai_resources')
      .update({
        click_count: currentClickCount + 1,
        last_clicked_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[resources/click] Update error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      clickCount: data?.click_count || 0
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to track click';
    console.error('[resources/click] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
