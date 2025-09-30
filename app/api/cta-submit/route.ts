import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, CTAResponse } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'currentRole', 'biggestChallenge', 'timeCommitment', 'specificGoal', 'urgency'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get the source URL from headers
    const sourceUrl = request.headers.get('referer') || '';

    // Prepare data for Supabase (converting camelCase to snake_case)
    const ctaData: CTAResponse = {
      name: body.name,
      email: body.email,
      current_role: body.currentRole,
      biggest_challenge: body.biggestChallenge,
      time_commitment: body.timeCommitment,
      specific_goal: body.specificGoal,
      urgency: body.urgency,
      source_url: sourceUrl,
      metadata: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        user_agent: request.headers.get('user-agent') || '',
        submitted_at: new Date().toISOString()
      }
    };

    // Insert into Supabase
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from('cta_responses')
      .insert([ctaData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // Check if it's a duplicate email error
      if (error.code === '23505' && error.message.includes('email')) {
        return NextResponse.json(
          { error: 'This email has already been registered. Please check your inbox for next steps.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to save your response. Please try again.' },
        { status: 500 }
      );
    }

    // Optional: Send a welcome email here using your preferred email service
    // await sendWelcomeEmail(body.email, body.name);

    // Optional: Add to email marketing list (ConvertKit, Mailchimp, etc.)
    // await addToEmailList(body.email, body.name);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your response has been recorded successfully!',
        data: { id: data.id }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method to check the health of the endpoint
export async function GET() {
  return NextResponse.json(
    { status: 'OK', message: 'CTA submission endpoint is running' },
    { status: 200 }
  );
}
