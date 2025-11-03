import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendOnboardingNotification } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received onboarding intake:', body);
    
    // Validate basic required fields
    const requiredFields = [
      'fullName', 
      'businessName', 
      'email', 
      'businessDescription', 
      'targetCustomers',
      'currentTools',
      'leadContactMethod',
      'followUpProcess',
      'topPriorities',
      'successDefinition',
      'aiFamiliarity',
      'preferredSchedule',
      'timezone',
      'caseStudyConsent'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get source URL
    const sourceUrl = request.headers.get('referer') || '';

    // Prepare data for Supabase (converting camelCase to snake_case)
    const intakeData = {
      // Section 1
      full_name: body.fullName,
      business_name: body.businessName,
      email: body.email,
      website_link: body.websiteLink || null,
      business_description: body.businessDescription,
      target_customers: body.targetCustomers,
      
      // Section 2
      current_tools: body.currentTools ? JSON.parse(body.currentTools) : null,
      lead_contact_method: body.leadContactMethod,
      follow_up_process: body.followUpProcess,
      
      // Section 3
      top_priorities: body.topPriorities,
      success_definition: body.successDefinition,
      ai_familiarity: body.aiFamiliarity,
      
      // Section 4
      preferred_schedule: body.preferredSchedule ? JSON.parse(body.preferredSchedule) : null,
      timezone: body.timezone,
      team_members: body.teamMembers || null,
      existing_workflows: body.existingWorkflows || null,
      
      // Section 5
      case_study_consent: body.caseStudyConsent,
      additional_notes: body.additionalNotes || null,
      
      // Metadata
      source_url: sourceUrl,
      metadata: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        user_agent: request.headers.get('user-agent') || '',
        submitted_at: new Date().toISOString()
      }
    };

    // Insert into Supabase
    console.log('Inserting intake data into Supabase');
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from('onboarding_intake')
      .insert([intakeData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // Check for duplicate email
      if (error.code === '23505' && error.message.includes('email')) {
        return NextResponse.json(
          { error: 'This email has already submitted an intake form. Please check your inbox or contact support.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to save your intake form. Please try again.',
          details: error.message
        },
        { status: 500 }
      );
    }

    console.log('Successfully inserted intake data:', data);

    // Send email notification (don't block on failure)
    try {
      await sendOnboardingNotification(data);
    } catch (emailError) {
      console.error('Email notification failed (non-blocking):', emailError);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Intake form submitted successfully!',
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

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { status: 'OK', message: 'Onboarding intake endpoint is running' },
    { status: 200 }
  );
}
