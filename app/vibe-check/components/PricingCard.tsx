'use client';

import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingCard() {
  const router = useRouter();

  const features = [
    { 
      text: '4 weeks, 8 live 1:1 calls',
      subtext: '($75/call • $150/week)',
      value: null
    },
    { 
      text: '2-3 custom AI workflows built together',
      subtext: null,
      value: '$800+'
    },
    { 
      text: 'Complete workflow playbook & templates',
      subtext: null,
      value: '$600+'
    },
    { 
      text: '30-day KPI scoreboard & tracking',
      subtext: null,
      value: '$500+'
    },
    { 
      text: 'Private Slack/Discord support access',
      subtext: null,
      value: '$500+'
    },
    { 
      text: 'Lifetime access to all materials',
      subtext: null,
      value: '$400+'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-12">
      {/* Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-800 px-8 py-6 text-center">
          <div className="text-sm font-semibold text-zinc-400 tracking-wider uppercase mb-2">
            1:1 AI Onboarding Sprint
          </div>
          <div className="text-xs text-zinc-500 mb-1">BY APPLICATION ONLY</div>
          <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs font-semibold text-accent">
            LIMITED TO 5 SPOTS
          </div>
        </div>

        {/* Price */}
        <div className="px-8 py-10 text-center border-b border-zinc-800">
          <div className="text-6xl font-bold text-white mb-2">
            $600
          </div>
          <div className="text-zinc-400 mb-1">
            TOTAL VALUE: <span className="line-through">$2,800+</span>
          </div>
          <div className="text-sm text-zinc-500">
            4 weeks • 8 calls • Built with you
          </div>
        </div>

        {/* Features */}
        <div className="px-8 py-8 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-zinc-200 text-sm">
                  {feature.text}
                  {feature.value && (
                    <span className="text-zinc-500 ml-2">
                      (Value: {feature.value})
                    </span>
                  )}
                </p>
                {feature.subtext && (
                  <p className="text-zinc-500 text-xs mt-1">{feature.subtext}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-8 py-6 bg-zinc-900/50 border-t border-zinc-800">
          <button
            onClick={() => {
              // Scroll to top where the form button is
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all hover:scale-105 text-sm sm:text-base mb-4"
          >
            APPLY FOR 1:1 SPRINT
          </button>
          
          <div className="text-center text-sm text-zinc-400">
            OR 2 PAYMENTS OF $350{' '}
            <span className="text-accent font-semibold">(SAVE $50)</span>
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-zinc-500 mt-6">
        🔒 Guaranteed safe & secure checkout • Over 20+ successful sprints
      </p>
    </div>
  );
}
