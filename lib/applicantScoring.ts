// Z21 Applicant Scoring Algorithm
// Focus: Investment Readiness + Willingness

export interface ScoringFactors {
  revenue: string;
  aiFamiliarity: number;
  timeline: string;
  timeCommitment: string;
}

export interface ScoreBreakdown {
  totalScore: number;
  tier: 'STRONG_FIT' | 'GOOD_FIT' | 'MAYBE' | 'NOT_NOW';
  revenueScore: number;
  aiFamiliarityScore: number;
  timelineScore: number;
  commitmentScore: number;
  reasoning: string;
}


export function calculateApplicantScore(factors: ScoringFactors): ScoreBreakdown {
  // Revenue Score (50 points max)
  const revenueScore = scoreRevenue(factors.revenue);
  
  // AI Familiarity Score (25 points max)
  const aiFamiliarityScore = scoreAIFamiliarity(factors.aiFamiliarity);
  
  // Timeline Score (15 points max)
  const timelineScore = scoreTimeline(factors.timeline);
  
  // Time Commitment Score (10 points max)
  const commitmentScore = scoreCommitment(factors.timeCommitment);
  
  const totalScore = revenueScore + aiFamiliarityScore + timelineScore + commitmentScore;
  
  // Determine tier
  const tier = getTier(totalScore);
  
  // Generate reasoning
  const reasoning = generateReasoning(totalScore, {
    revenueScore,
    aiFamiliarityScore,
    timelineScore,
    commitmentScore
  });
  
  return {
    totalScore: Math.round(totalScore),
    tier,
    revenueScore,
    aiFamiliarityScore,
    timelineScore,
    commitmentScore,
    reasoning
  };
}

function scoreRevenue(revenue: string): number {
  // Investment readiness - most important factor
  const revenueNum = parseRevenueString(revenue);
  
  if (revenueNum >= 10000) return 50;      // $10k+ = Strong buyer signal
  if (revenueNum >= 5000) return 40;       // $5k-$10k = Good signal
  if (revenueNum >= 2000) return 30;       // $2k-$5k = Minimum threshold
  if (revenueNum >= 1000) return 20;       // $1k-$2k = Borderline
  if (revenueNum > 0) return 15;           // <$1k = Early stage
  return 5;                                 // $0 = Pre-revenue (rare case)
}

function scoreAIFamiliarity(familiarity: number): number {
  // AI readiness - second priority
  if (familiarity >= 8) return 25;         // 8-10 = Ready to implement
  if (familiarity >= 6) return 20;         // 6-7 = Good baseline
  if (familiarity >= 5) return 15;         // 5 = Minimum acceptable
  if (familiarity >= 3) return 8;          // 3-4 = Too beginner
  return 3;                                 // <3 = Not ready
}

function scoreTimeline(timeline: string): number {
  // Urgency signal - third priority
  const days = parseTimelineString(timeline);
  
  if (days <= 7) return 15;                // <7 days = Urgent = Committed
  if (days <= 14) return 12;               // 7-14 days = Soon
  if (days <= 30) return 8;                // 15-30 days = Normal
  if (days <= 60) return 4;                // 30-60 days = Low urgency
  return 2;                                 // >60 days = Not urgent
}

function scoreCommitment(commitment: string): number {
  // Time availability - lowest weight
  const hours = parseCommitmentString(commitment);
  
  if (hours >= 10) return 10;              // 10+ hours = Full commitment
  if (hours >= 5) return 7;                // 5-10 hours = Good
  if (hours >= 3) return 5;                // 3-5 hours = Realistic
  return 3;                                 // <3 hours = Limited
}

function getTier(score: number): ScoreBreakdown['tier'] {
  if (score >= 90) return 'STRONG_FIT';    // 90-100: Take immediately
  if (score >= 70) return 'GOOD_FIT';      // 70-89: Qualified
  if (score >= 50) return 'MAYBE';         // 50-69: Needs review
  return 'NOT_NOW';                        // <50: Politely decline
}

function generateReasoning(
  totalScore: number,
  scores: Omit<ScoreBreakdown, 'totalScore' | 'tier' | 'reasoning'>
): string {
  const parts: string[] = [];
  
  // Revenue reasoning
  if (scores.revenueScore >= 30) {
    parts.push('✅ Strong investment capacity');
  } else if (scores.revenueScore >= 20) {
    parts.push('⚠️ Moderate investment capacity');
  } else {
    parts.push('❌ Limited investment capacity');
  }
  
  // AI familiarity reasoning
  if (scores.aiFamiliarityScore >= 20) {
    parts.push('✅ Ready for AI implementation');
  } else if (scores.aiFamiliarityScore >= 15) {
    parts.push('⚠️ Basic AI knowledge');
  } else {
    parts.push('❌ May need foundational training');
  }
  
  // Timeline reasoning
  if (scores.timelineScore >= 12) {
    parts.push('✅ High urgency (committed)');
  } else if (scores.timelineScore >= 8) {
    parts.push('⚠️ Moderate urgency');
  } else {
    parts.push('❌ Low urgency signal');
  }
  
  return parts.join(' • ');
}

// Helper functions to parse strings
function parseRevenueString(revenue: string): number {
  const cleaned = revenue.toLowerCase().replace(/[^0-9k]/g, '');
  if (cleaned.includes('k')) {
    const num = parseFloat(cleaned.replace('k', ''));
    return num * 1000;
  }
  return parseInt(cleaned) || 0;
}

function parseTimelineString(timeline: string): number {
  const lower = timeline.toLowerCase();
  if (lower.includes('asap') || lower.includes('immediately')) return 1;
  if (lower.includes('week')) return 7;
  if (lower.includes('2 weeks') || lower.includes('two weeks')) return 14;
  if (lower.includes('month')) return 30;
  if (lower.includes('2 months') || lower.includes('two months')) return 60;
  if (lower.includes('3+ months')) return 90;
  return 30; // Default
}

function parseCommitmentString(commitment: string): number {
  const match = commitment.match(/(\d+)/);
  return match ? parseInt(match[0]) : 5;
}

// Color coding for tiers
export function getTierColor(tier: ScoreBreakdown['tier']): {
  bg: string;
  text: string;
  border: string;
} {
  switch (tier) {
    case 'STRONG_FIT':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500'
      };
    case 'GOOD_FIT':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500'
      };
    case 'MAYBE':
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500'
      };
    case 'NOT_NOW':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500'
      };
  }
}

export function getTierLabel(tier: ScoreBreakdown['tier']): string {
  switch (tier) {
    case 'STRONG_FIT': return '🔥 STRONG FIT';
    case 'GOOD_FIT': return '✅ GOOD FIT';
    case 'MAYBE': return '⚠️ MAYBE';
    case 'NOT_NOW': return '❌ NOT NOW';
  }
}
