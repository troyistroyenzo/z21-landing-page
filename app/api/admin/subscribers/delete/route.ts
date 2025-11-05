import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('[admin/subscribers/delete] Error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      deleted: ids.length,
      message: `Successfully deleted ${ids.length} subscriber(s)`
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to delete subscribers';
    console.error('[admin/subscribers/delete] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
