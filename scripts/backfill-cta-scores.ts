// Backfill script to recalculate scores for existing CTA responses
// Run with: npx tsx scripts/backfill-cta-scores.ts
// Make sure your .env.local file is in the project root

import { createClient } from '@supabase/supabase-js';
import { calculateApplicantScore } from '../lib/applicantScoring';

// Next.js automatically loads .env.local - access directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function backfillScores() {
  console.log('🚀 Starting score backfill for cta_responses table...\n');

  // Fetch all applicants from cta_responses
  const { data: applicants, error } = await supabase
    .from('cta_responses')
    .select('*')
    .eq('sprint_type', 'ai_onboarding'); // Only score AI onboarding applicants

  if (error) {
    console.error('❌ Error fetching applicants:', error);
    process.exit(1);
  }

  if (!applicants || applicants.length === 0) {
    console.log('ℹ️ No applicants found to backfill.');
    return;
  }

  console.log(`📊 Found ${applicants.length} applicants to score\n`);

  let updated = 0;
  let failed = 0;
  const skipped = 0;

  for (const applicant of applicants) {
    try {
      // Map form data to scoring factors
      const scoringFactors = {
        revenue: applicant.monthly_revenue || 'pre_revenue',
        aiFamiliarity: applicant.ai_readiness || 0,
        timeline: applicant.start_timeline || '>30',
        timeCommitment: applicant.time_commitment || '<2'
      };

      // Calculate using 100-point algorithm
      const scoreResult = calculateApplicantScore(scoringFactors);

      // Check for knockout conditions
      let hasKnockout = false;
      if (applicant.sample_data === 'no') hasKnockout = true;
      if (applicant.time_commitment === '<2') hasKnockout = true;

      // Determine qualification status
      let qualificationStatus;
      if (hasKnockout) {
        qualificationStatus = 'not_qualified';
      } else if (scoreResult.tier === 'STRONG_FIT' || scoreResult.tier === 'GOOD_FIT') {
        qualificationStatus = 'strong_fit';
      } else if (scoreResult.tier === 'MAYBE') {
        qualificationStatus = 'conditional';
      } else {
        qualificationStatus = 'not_qualified';
      }

      // Update the record
      const { error: updateError } = await supabase
        .from('cta_responses')
        .update({
          fit_score: scoreResult.totalScore,
          fit_tier: scoreResult.tier,
          score_breakdown: {
            revenueScore: scoreResult.revenueScore,
            aiFamiliarityScore: scoreResult.aiFamiliarityScore,
            timelineScore: scoreResult.timelineScore,
            commitmentScore: scoreResult.commitmentScore,
            reasoning: scoreResult.reasoning
          },
          has_knockout: hasKnockout,
          qualification_status: qualificationStatus
        })
        .eq('id', applicant.id);

      if (updateError) {
        console.error(`❌ Failed to update ${applicant.name}:`, updateError.message);
        failed++;
      } else {
        console.log(`✅ Updated ${applicant.name}: ${scoreResult.totalScore}/100 (${scoreResult.tier})`);
        updated++;
      }

    } catch (err) {
      console.error(`❌ Error processing ${applicant.name}:`, err);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📈 BACKFILL COMPLETE');
  console.log('='.repeat(50));
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${applicants.length}`);
  console.log('='.repeat(50) + '\n');
}

// Run the backfill
backfillScores()
  .then(() => {
    console.log('✨ Done! Your applicants now have the new 100-point scores.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
