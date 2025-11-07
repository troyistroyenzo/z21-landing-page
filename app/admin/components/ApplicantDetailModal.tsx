'use client';

import { X, DollarSign, Brain, Clock, Users, TrendingUp, Mail, Phone, Globe, Calendar } from 'lucide-react';
import { getTierColor, getTierLabel } from '@/lib/applicantScoring';

interface ApplicantData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business_description: string;
  fit_score?: number;
  fit_tier?: 'STRONG_FIT' | 'GOOD_FIT' | 'MAYBE' | 'NOT_NOW';
  score_breakdown?: {
    revenueScore: number;
    aiFamiliarityScore: number;
    timelineScore: number;
    commitmentScore: number;
    reasoning: string;
  };
  answers: {
    websiteLink?: string;
    experienceLevel?: string;
    stuckAreas?: string[] | string;
    monthlyRevenue?: string;
    sprintGoals?: string[] | string;
    timeCommitment?: string;
    startTimeline?: string;
    aiReadiness?: number;
    toolStack?: string[] | string;
    focusAreas?: string[] | string;
    sampleData?: string;
    workflowOwner?: string;
    investmentReadiness?: string;
  };
  created_at: string;
}

interface ApplicantDetailModalProps {
  applicant: ApplicantData | null;
  onClose: () => void;
}

export default function ApplicantDetailModal({ applicant, onClose }: ApplicantDetailModalProps) {
  if (!applicant) return null;

  // Handle cases where scoring data doesn't exist yet (before migration is run)
  const hasScoringData = applicant.fit_tier && applicant.fit_score !== undefined && applicant.score_breakdown;
  const tierColors = hasScoringData 
    ? getTierColor(applicant.fit_tier!) 
    : { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500' };
  const tierLabel = hasScoringData ? getTierLabel(applicant.fit_tier!) : '⏳ Not Yet Scored';
  const breakdown = applicant.score_breakdown || {
    revenueScore: 0,
    aiFamiliarityScore: 0,
    timelineScore: 0,
    commitmentScore: 0,
    reasoning: 'Scoring data not available. Please run the database migration and backfill scores.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white truncate">{applicant.name}</h2>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${tierColors.bg} ${tierColors.text} border ${tierColors.border} whitespace-nowrap`}>
                {tierLabel}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">{applicant.business_description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Score Breakdown */}
          <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Fit Score Analysis
              </h3>
              <span className="text-3xl font-bold text-accent">{applicant.fit_score ?? 0}/100</span>
            </div>

            {!hasScoringData && (
              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Scoring data not yet available. Run the database migration to enable intelligent scoring.
                </p>
              </div>
            )}

            {/* Score Bars */}
            <div className="space-y-4 mb-4">
              <ScoreBar
                label="Investment Readiness"
                score={breakdown.revenueScore}
                maxScore={50}
                icon={<DollarSign className="w-4 h-4" />}
                color="emerald"
              />
              <ScoreBar
                label="AI Familiarity"
                score={breakdown.aiFamiliarityScore}
                maxScore={25}
                icon={<Brain className="w-4 h-4" />}
                color="blue"
              />
              <ScoreBar
                label="Timeline Urgency"
                score={breakdown.timelineScore}
                maxScore={15}
                icon={<Clock className="w-4 h-4" />}
                color="yellow"
              />
              <ScoreBar
                label="Time Commitment"
                score={breakdown.commitmentScore}
                maxScore={10}
                icon={<Users className="w-4 h-4" />}
                color="purple"
              />
            </div>

            {/* Reasoning */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
              <p className="text-sm text-zinc-300">{breakdown.reasoning}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={<Mail />} label="Email" value={applicant.email} />
            {applicant.phone && <InfoCard icon={<Phone />} label="Phone" value={applicant.phone} />}
            {applicant.answers?.websiteLink && (
              <InfoCard icon={<Globe />} label="Website" value={applicant.answers.websiteLink} />
            )}
            <InfoCard
              icon={<Calendar />}
              label="Applied"
              value={new Date(applicant.created_at).toLocaleDateString()}
            />
          </div>

          {/* All User Responses */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Complete Application Responses</h3>

            {/* Experience Level */}
            {applicant.answers?.experienceLevel && (
              <ResponseCard
                label="Experience Level"
                value={applicant.answers.experienceLevel}
                badge
              />
            )}

            {/* Stuck Areas */}
            {applicant.answers?.stuckAreas && (
              <ResponseCard
                label="Where They're Stuck"
                value={Array.isArray(applicant.answers.stuckAreas)
                  ? applicant.answers.stuckAreas.join(', ')
                  : JSON.stringify(applicant.answers.stuckAreas)}
              />
            )}

            {/* Monthly Revenue */}
            {applicant.answers?.monthlyRevenue && (
              <ResponseCard
                label="Monthly Revenue"
                value={applicant.answers.monthlyRevenue}
                badge
              />
            )}

            {/* Sprint Goals */}
            {applicant.answers?.sprintGoals && (
              <ResponseCard
                label="Sprint Goals"
                value={Array.isArray(applicant.answers.sprintGoals)
                  ? applicant.answers.sprintGoals.join(', ')
                  : JSON.stringify(applicant.answers.sprintGoals)}
              />
            )}

            {/* Time Commitment */}
            {applicant.answers?.timeCommitment && (
              <ResponseCard
                label="Time Commitment (hours/week)"
                value={applicant.answers.timeCommitment}
                badge
              />
            )}

            {/* Start Timeline */}
            {applicant.answers?.startTimeline && (
              <ResponseCard
                label="Start Timeline"
                value={applicant.answers.startTimeline}
                badge
              />
            )}

            {/* AI Readiness */}
            {applicant.answers?.aiReadiness !== undefined && (
              <ResponseCard
                label="AI Readiness (0-10)"
                value={`${applicant.answers.aiReadiness}/10`}
                badge
              />
            )}

            {/* Tool Stack */}
            {applicant.answers?.toolStack && (
              <ResponseCard
                label="Current Tool Stack"
                value={Array.isArray(applicant.answers.toolStack)
                  ? applicant.answers.toolStack.join(', ')
                  : JSON.stringify(applicant.answers.toolStack)}
              />
            )}

            {/* Focus Areas */}
            {applicant.answers?.focusAreas && (
              <ResponseCard
                label="Focus Areas to 10×"
                value={Array.isArray(applicant.answers.focusAreas)
                  ? applicant.answers.focusAreas.join(', ')
                  : JSON.stringify(applicant.answers.focusAreas)}
              />
            )}

            {/* Sample Data */}
            {applicant.answers?.sampleData && (
              <ResponseCard
                label="Has Sample Data?"
                value={applicant.answers.sampleData}
                badge
              />
            )}

            {/* Workflow Owner */}
            {applicant.answers?.workflowOwner && (
              <ResponseCard
                label="Workflow Owner"
                value={applicant.answers.workflowOwner}
              />
            )}

            {/* Investment Readiness */}
            {applicant.answers?.investmentReadiness && (
              <ResponseCard
                label="Investment Readiness"
                value={applicant.answers.investmentReadiness}
                badge
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors font-medium"
          >
            Close
          </button>
          <a
            href={`mailto:${applicant.email}`}
            className="flex-1 px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium text-center"
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  maxScore,
  icon,
  color
}: {
  label: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  color: string;
}) {
  const percentage = (score / maxScore) * 100;
  
  // Map color names to actual hex values
  const colorMap: Record<string, string> = {
    emerald: '#10b981',
    blue: '#3b82f6',
    yellow: '#eab308',
    purple: '#a855f7'
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-medium text-white">
          {score}/{maxScore}
        </span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: colorMap[color] || '#10b981'
          }}
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center gap-2 text-zinc-400 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-white text-sm truncate">{value}</p>
    </div>
  );
}

function ResponseCard({
  label,
  value,
  multiline,
  badge
}: {
  label: string;
  value: string;
  multiline?: boolean;
  badge?: boolean;
}) {
  return (
    <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
      <h4 className="text-sm font-medium text-zinc-400 mb-2">{label}</h4>
      {badge ? (
        <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-lg text-sm capitalize">
          {value}
        </span>
      ) : multiline ? (
        <p className="text-white text-sm whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-white text-sm">{value}</p>
      )}
    </div>
  );
}
