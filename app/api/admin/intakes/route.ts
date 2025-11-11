import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from('onboarding_intake')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    return NextResponse.json({ intakes: data ?? [] });
  } catch (error: any) {
    const message = error?.message || 'Failed to load intakes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
