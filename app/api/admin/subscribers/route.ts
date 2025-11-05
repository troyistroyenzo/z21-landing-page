import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, source, subscribed_at, metadata')
      .order('subscribed_at', { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    return NextResponse.json({ subscribers: data ?? [] });
  } catch (error: any) {
    const message = error?.message || 'Failed to load subscribers';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
