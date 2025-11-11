import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { headers } from 'next/headers';
import crypto from 'crypto';

// Hash function for privacy
function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path, session_id, referrer, user_agent } = body;

    if (!page_path || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get real IP from headers (for server-side hashing)
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const ipHash = hashString(ip);

    // Insert page view
    const supabase = supabaseAdmin();
    const { error } = await supabase.from('page_views').insert({
      page_path,
      session_id,
      referrer: referrer || null,
      user_agent: user_agent || null,
      ip_hash: ipHash,
      country: null // Could integrate with geolocation service
    });

    if (error) {
      console.error('Error tracking page view:', error);
      return NextResponse.json(
        { error: 'Failed to track page view' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Track API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
