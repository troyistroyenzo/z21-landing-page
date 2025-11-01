import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateAISummary } from '@/lib/openai-summary';
import { sendSubmissionNotification } from '@/lib/resend';

interface CTAFormData {
  [key: string]: string;
}

// Calculate fit score based on weighted priorities (Max: 20 points)
function calculateFitScore(formData: CTAFormData): { 
  score: number; 
  hasKnockout: boolean; 
  status: 'strong_fit' | 'conditional' | 'not_qualified' 
} {
  let score = 0;
  let hasKnockout = false;

  // 1. AI KNOWLEDGE (0-5 points + 1 bonus) - HIGHEST PRIORITY
  const aiReadiness = parseInt(formData.aiReadiness || '0');
  if (aiReadiness >= 8) score += 5; // Already using AI daily
  else if (aiReadiness >= 5) score += 3; // Moderate experience
  else if (aiReadiness < 3) hasKnockout = true; // Too beginner

  // Tool stack bonus
  try {
    const tools = JSON.parse(formData.toolStack || '[]');
    if (tools.length >= 3) score += 1; // Bonus for using multiple tools
  } catch (e) {}

  // 2. TIME COMMITMENT (0-4 points)
  if (formData.timeCommitment === '4-6') score += 4;
  else if (formData.timeCommitment === '2-3') score += 2;
  else if (formData.timeCommitment === '<2') hasKnockout = true; // Knockout

  // 3. URGENCY (0-4 points)
  if (formData.startTimeline === 'within_14') score += 4;
  else if (formData.startTimeline === '15-30') score += 2;
  // >30 days = 0 points (not urgent)

  // 4. REVENUE (0-5 points)
  if (formData.monthlyRevenue === '50k+') score += 5;
  else if (formData.monthlyRevenue === '10k-50k') score += 4;
  else if (formData.monthlyRevenue === '2k-10k') score += 3; // Minimum viable
  else if (formData.monthlyRevenue === '<2k') score += 1;
  // Pre-revenue = 0 points

  // 5. BONUS POINTS (0-2)
  // Clear goals
  try {
    const goals = JSON.parse(formData.sprintGoals || '[]');
    if (goals.length >= 2) score += 1;
  } catch (e) {}

  // Sample data ready
  if (formData.sampleData === 'yes') score += 1;
  else if (formData.sampleData === 'no') hasKnockout = true; // Knockout

  // Determine qualification status
  let status: 'strong_fit' | 'conditional' | 'not_qualified';
  if (hasKnockout) {
    status = 'not_qualified';
  } else if (score >= 14) {
    status = 'strong_fit'; // 70%+ score
  } else if (score >= 10) {
    status = 'conditional'; // 50-69% - manual review
  } else {
    status = 'not_qualified'; // <50%
  }

  return { score, hasKnockout, status };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    // Back-compat: map legacy profileLink to socialHandle if present
    if (!body.socialHandle && body.profileLink) {
      body.socialHandle = body.profileLink;
    }
    
    // Validate basic required fields
    const basicFields = ['name', 'workDescription', 'socialHandle', 'email', 'referralSource', 'sprintType'];
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
      social_handle: body.socialHandle || null,
      profile_link: body.socialHandle || body.profileLink || '',
      phone: body.phone || null,
      email: body.email,
      referral_source: body.referralSource,
      
      // Path Choice
      sprint_type: body.sprintType,
      
      // AI Onboarding fields (only if sprint type is ai_onboarding)
      ...(body.sprintType === 'ai_onboarding' && {
        experience_level: body.experienceLevel || null,
        stuck_areas: body.stuckAreas ? JSON.parse(body.stuckAreas) : null,
        monthly_revenue: body.monthlyRevenue || null,
        sprint_goals: body.sprintGoals ? JSON.parse(body.sprintGoals) : null,
        time_commitment: body.timeCommitment || null,
        start_timeline: body.startTimeline || null,
        ai_readiness: body.aiReadiness ? parseInt(body.aiReadiness) : null,
        tool_stack: body.toolStack ? JSON.parse(body.toolStack) : null,
        focus_areas: body.focusAreas ? JSON.parse(body.focusAreas) : null,
        sample_data: body.sampleData || null,
        workflow_owner: body.workflowOwner || null,
        investment_readiness: body.investmentReadiness || null,
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

    // Generate AI summary and send email notification (don't block on failure)
    try {
      const aiSummary = await generateAISummary(data);
      await sendSubmissionNotification(data, aiSummary);
    } catch (emailError) {
      // Log but don't fail the request if email fails
      console.error('Email notification failed (non-blocking):', emailError);
    }

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
