'use client';

import { X, Download } from 'lucide-react';
import { generateIntakePDF } from '@/lib/pdfGenerator';

interface IntakeData {
  id: string;
  full_name: string;
  business_name: string;
  email: string;
  website_link?: string;
  business_description: string;
  target_customers: string;
  current_tools?: any;
  lead_contact_method: string;
  follow_up_process: string;
  top_priorities: string;
  success_definition: string;
  ai_familiarity: string;
  preferred_schedule?: any;
  timezone: string;
  team_members?: string;
  existing_workflows?: string;
  case_study_consent: string;
  additional_notes?: string;
  created_at: string;
}

interface Props {
  intake: IntakeData | null;
  onClose: () => void;
}

export default function IntakeDetailModal({ intake, onClose }: Props) {
  if (!intake) return null;

  const handleDownloadPDF = () => {
    try {
      generateIntakePDF(intake);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const renderField = (label: string, value: string | undefined | null) => {
    if (!value) return null;
    return (
      <div className="mb-3">
        <p className="text-xs text-zinc-400 mb-1">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    );
  };

  const renderArrayField = (label: string, value: any) => {
    if (!value) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : JSON.stringify(value);
    return renderField(label, displayValue);
  };

  const aiFamiliarityBadge = (level: string) => {
    const colors: Record<string, string> = {
      newbie: 'bg-zinc-500/10 text-zinc-400',
      beginner: 'bg-blue-500/10 text-blue-400',
      intermediate: 'bg-green-500/10 text-green-400',
      advanced: 'bg-purple-500/10 text-purple-400',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[level.toLowerCase()] || colors.beginner}`}>
        {level}
      </span>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">{intake.full_name}</h2>
            <p className="text-sm text-zinc-400">{intake.business_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Section 1: About You & Business */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📧</span> About You & Business
            </h3>
            <div className="space-y-3 bg-zinc-800/30 rounded-lg p-4">
              {renderField('Full Name', intake.full_name)}
              {renderField('Business Name', intake.business_name)}
              {renderField('Email', intake.email)}
              {renderField('Website', intake.website_link)}
              {renderField('Business Description', intake.business_description)}
              {renderField('Target Customers', intake.target_customers)}
            </div>
          </div>

          {/* Section 2: Current Setup */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🛠️</span> Current Setup
            </h3>
            <div className="space-y-3 bg-zinc-800/30 rounded-lg p-4">
              {renderArrayField('Current Tools', intake.current_tools)}
              {renderField('Lead Contact Method', intake.lead_contact_method)}
              {renderField('Follow-up Process', intake.follow_up_process)}
            </div>
          </div>

          {/* Section 3: Goals */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Goals
            </h3>
            <div className="space-y-3 bg-zinc-800/30 rounded-lg p-4">
              {renderField('Top Priorities', intake.top_priorities)}
              {renderField('Success Definition', intake.success_definition)}
              <div className="mb-3">
                <p className="text-xs text-zinc-400 mb-1">AI Familiarity</p>
                {aiFamiliarityBadge(intake.ai_familiarity)}
              </div>
            </div>
          </div>

          {/* Section 4: Logistics */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📅</span> Logistics
            </h3>
            <div className="space-y-3 bg-zinc-800/30 rounded-lg p-4">
              {renderArrayField('Preferred Schedule', intake.preferred_schedule)}
              {renderField('Timezone', intake.timezone)}
              {renderField('Team Members', intake.team_members)}
              {renderField('Existing Workflows', intake.existing_workflows)}
            </div>
          </div>

          {/* Section 5: Additional */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📝</span> Additional
            </h3>
            <div className="space-y-3 bg-zinc-800/30 rounded-lg p-4">
              {renderField('Case Study Consent', intake.case_study_consent)}
              {renderField('Additional Notes', intake.additional_notes)}
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>ℹ️</span> Submission Info
            </h3>
            <div className="space-y-3 bg-zinc-800/30 rounded-lg p-4">
              {renderField(
                'Submitted',
                new Date(intake.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
