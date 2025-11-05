import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const nodeEnv = process.env.NODE_ENV || 'unknown';

    // Important: never return actual keys, only presence booleans
    return NextResponse.json({
      ok: true,
      env: {
        hasUrl,
        hasAnon,
        hasService,
        nodeEnv
      },
      hint: hasService
        ? 'Service role key is present on server'
        : 'Service role key missing. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (server-only) and restart dev server.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Debug route failed' },
      { status: 500 }
    );
  }
}
