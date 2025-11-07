import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateAISummary } from '@/lib/openai-summary';
import { sendSubmissionNotification, sendApplicantConfirmation } from '@/lib/resend';
import { calculateApplicantScore } from '@/lib/applicantScoring';

export async function POST(request: NextRequest) {
  try {
    interface CTAFormData {
      [key: string]: string;
    }

    const body = await request.json() as CTAFormData;
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

    // Calculate fit score for AI Onboarding applicants using new 100-point algorithm
    let fitScore = null;
    let fitTier = null;
    let scoreBreakdown = null;
    let hasKnockout = false;
    let qualificationStatus = null;

    if (body.sprintType === 'ai_onboarding') {
      // Map form data to scoring factors
      const scoringFactors = {
        revenue: body.monthlyRevenue || 'pre_revenue',
        aiFamiliarity: parseInt(body.aiReadiness) || 0,
        timeline: body.startTimeline || '>30',
        timeCommitment: body.timeCommitment || '<2'
      };

      // Calculate using new 100-point algorithm
      const scoreResult = calculateApplicantScore(scoringFactors);
      
      fitScore = scoreResult.totalScore;
      fitTier = scoreResult.tier;
      scoreBreakdown = {
        revenueScore: scoreResult.revenueScore,
        aiFamiliarityScore: scoreResult.aiFamiliarityScore,
        timelineScore: scoreResult.timelineScore,
        commitmentScore: scoreResult.commitmentScore,
        reasoning: scoreResult.reasoning
      };

      // Check for knockout conditions
      if (body.sampleData === 'no') hasKnockout = true;
      if (body.timeCommitment === '<2') hasKnockout = true;
      
      // Map tier to qualification status
      if (hasKnockout) {
        qualificationStatus = 'not_qualified';
      } else if (scoreResult.tier === 'STRONG_FIT') {
        qualificationStatus = 'strong_fit';
      } else if (scoreResult.tier === 'GOOD_FIT') {
        qualificationStatus = 'strong_fit';
      } else if (scoreResult.tier === 'MAYBE') {
        qualificationStatus = 'conditional';
      } else {
        qualificationStatus = 'not_qualified';
      }
    }

    // Prepare data for Supabase (converting camelCase to snake_case)
    const ctaData = {
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
      
      // Scoring (new 100-point system)
      fit_score: fitScore,
      fit_tier: fitTier,
      score_breakdown: scoreBreakdown,
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

    // Send confirmation email to applicant (non-blocking)
    try {
      await sendApplicantConfirmation(data);
    } catch (emailError) {
      console.error('Applicant confirmation email failed (non-blocking):', emailError);
    }

    // Auto-add not-qualified leads to newsletter for nurturing
    if (qualificationStatus === 'not_qualified') {
      try {
        await supabase
          .from('newsletter_subscribers')
          .insert([{
            email: data.email,
            source: 'vibe-check-not-qualified',
            metadata: {
              name: data.name,
              qualified_at: new Date().toISOString()
            }
          }])
          .select();
        console.log('Not-qualified lead added to newsletter');
      } catch (subError) {
        // Ignore if already exists (duplicate email constraint)
        console.error('Newsletter subscription failed (non-blocking):', subError);
      }
    }

    // Generate AI summary ONLY for conditional cases (saves ~70% on AI costs)
    // strong_fit and not_qualified are obvious decisions that don't need AI analysis
    try {
      if (qualificationStatus === 'conditional') {
        const aiSummary = await generateAISummary(data);
        await sendSubmissionNotification(data, aiSummary);
      } else {
        // Skip AI for clear fit/not-fit decisions
        const statusMessage = qualificationStatus === 'strong_fit' 
          ? 'Auto-qualified: Strong fit based on scoring criteria'
          : 'Auto-disqualified: Does not meet minimum requirements';
        await sendSubmissionNotification(data, statusMessage);
      }
    } catch (emailError) {
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
