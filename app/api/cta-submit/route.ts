import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface CTAFormData {
  [key: string]: string;
}

// Calculate fit score based on scoring rules
function calculateFitScore(formData: CTAFormData): { 
  score: number; 
  hasKnockout: boolean; 
  status: 'strong_fit' | 'conditional' | 'not_qualified' 
} {
  let score = 0;
  let hasKnockout = false;

  // Q9: Time commitment (weight: 2)
  if (formData.timeCommitment === '4-6') score += 2;
  else if (formData.timeCommitment === '2-3') score += 1;

  // Q10: Start timeline (weight: 2)
  if (formData.startTimeline === 'within_14') score += 2;
  else if (formData.startTimeline === '15-30') score += 1;

  // Q11: AI readiness (weight: 2)
  const aiReadiness = parseInt(formData.aiReadiness || '0');
  if (aiReadiness >= 8) score += 2;
  else if (aiReadiness >= 5) score += 1;

  // Q13: Focus areas (weight: 2)
  try {
    const focusAreas = JSON.parse(formData.focusAreas || '[]');
    if (focusAreas.length > 0) score += 2;
  } catch (e) {
    // Invalid JSON, skip scoring
  }

  // Q14: Sample data (weight: 2, knockout if 'no')
  if (formData.sampleData === 'yes') score += 2;
  else if (formData.sampleData === 'no') hasKnockout = true;

  // Q15: DWY confirmation (weight: 2, knockout if 'no')
  if (formData.dwyConfirmation === 'yes') score += 2;
  else if (formData.dwyConfirmation === 'no') hasKnockout = true;

  // Q18: Budget readiness (weight: 2)
  if (formData.budgetReadiness === 'ready') score += 2;
  else if (formData.budgetReadiness === 'payment_plan') score += 1;

  // Q20: Confirmations (weight: 2, knockout if not all 4 checked)
  try {
    const confirmations = JSON.parse(formData.confirmations || '[]');
    if (confirmations.length === 4) score += 2;
    else hasKnockout = true;
  } catch (e) {
    hasKnockout = true;
  }

  // Determine qualification status
  let status: 'strong_fit' | 'conditional' | 'not_qualified';
  if (hasKnockout) {
    status = 'not_qualified';
  } else if (score >= 8) {
    status = 'strong_fit';
  } else if (score >= 6) {
    status = 'conditional';
  } else {
    status = 'not_qualified';
  }

  return { score, hasKnockout, status };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    // Validate basic required fields
    const basicFields = ['name', 'workDescription', 'profileLink', 'email', 'referralSource', 'sprintType'];
    for (const field of basicFields) {
      if (!body[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get the source URL from headers
    const sourceUrl = request.headers.get('referer') || '';

    // Calculate fit score for AI Onboarding applicants
    let fitScore = null;
    let hasKnockout = false;
    let qualificationStatus = null;

    if (body.sprintType === 'ai_onboarding') {
      const scoring = calculateFitScore(body);
      fitScore = scoring.score;
      hasKnockout = scoring.hasKnockout;
      qualificationStatus = scoring.status;
    }

    // Prepare data for Supabase (converting camelCase to snake_case)
    const ctaData: any = {
      // Basic Info
      name: body.name,
      work_description: body.workDescription,
      profile_link: body.profileLink,
      email: body.email,
      referral_source: body.referralSource,
      
      // Path Choice
      sprint_type: body.sprintType,
      
      // AI Onboarding fields (only if sprint type is ai_onboarding)
      ...(body.sprintType === 'ai_onboarding' && {
        ai_motivation: body.aiMotivation || null,
        role_description: body.roleDescription || null,
        time_commitment: body.timeCommitment || null,
        start_timeline: body.startTimeline || null,
        ai_readiness: body.aiReadiness ? parseInt(body.aiReadiness) : null,
        tool_stack: body.toolStack ? JSON.parse(body.toolStack) : null,
        focus_areas: body.focusAreas ? JSON.parse(body.focusAreas) : null,
        sample_data: body.sampleData || null,
        dwy_confirmation: body.dwyConfirmation || null,
        preferred_format: body.preferredFormat || null,
        success_metrics: body.successMetrics ? JSON.parse(body.successMetrics) : null,
        budget_readiness: body.budgetReadiness || null,
        additional_info: body.additionalInfo || null,
        confirmations: body.confirmations ? JSON.parse(body.confirmations) : null,
      }),
      
      // Scoring
      fit_score: fitScore,
      has_knockout: hasKnockout,
      qualification_status: qualificationStatus,
      
      // Tracking
      source_url: sourceUrl,
      metadata: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        user_agent: request.headers.get('user-agent') || '',
        submitted_at: new Date().toISOString()
      }
    };

    // Insert into Supabase
    console.log('Attempting to insert data into Supabase:', ctaData);
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from('cta_responses')
      .insert([ctaData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Check if it's a duplicate email error
      if (error.code === '23505' && error.message.includes('email')) {
        return NextResponse.json(
          { error: 'This email has already been registered. Please check your inbox for next steps.' },
          { status: 400 }
        );
      }
      
      // Return detailed error for debugging
      return NextResponse.json(
        { 
          error: 'Failed to save your response. Please try again.',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log('Successfully inserted data:', data);

    // TODO: Send email notification for strong fit candidates
    // if (qualificationStatus === 'strong_fit') {
    //   await sendStrongFitNotification(data);
    // }

    // TODO: Send confirmation email to applicant
    // await sendConfirmationEmail(body.email, body.name, qualificationStatus);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your response has been recorded successfully!',
        data: { 
          id: data.id,
          qualificationStatus,
          fitScore 
        }
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
