import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'unknown' } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Get source URL from headers
    const sourceUrl = request.headers.get('referer') || '';

    // Save to Supabase
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          source,
          metadata: {
            source_url: sourceUrl,
            user_agent: request.headers.get('user-agent') || '',
            timestamp: new Date().toISOString()
          }
        }
      ])
      .select()
      .single();

    if (error) {
      // Check for duplicate email
      if (error.code === '23505' && error.message.includes('unique')) {
        // Email already exists - this is okay, just return success
        console.log(`Email already subscribed: ${email}`);
        return NextResponse.json(
          { 
            message: 'You\'re already subscribed! Check your inbox for our latest updates.',
            alreadySubscribed: true 
          },
          { status: 200 }
        );
      }
      
      console.error('Subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`New subscriber: ${email} from ${source}`);

    // Optional: Send welcome email via Resend
    // await sendWelcomeEmail(email);

    // Optional: Add to ConvertKit/Beehiiv
    // await addToEmailService(email);
    
    return NextResponse.json(
      { 
        message: 'Successfully subscribed! Check your inbox for AI resources.',
        data: { id: data.id }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
