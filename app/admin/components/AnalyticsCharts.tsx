'use client';

import { BarChart3, Clock, DollarSign, Brain } from 'lucide-react';

interface ApplicantData {
  monthlyRevenue?: string;
  aiReadiness?: number;
  startTimeline?: string;
  fit_tier?: string;
}

interface AnalyticsChartsProps {
  applicants: ApplicantData[];
}

export default function AnalyticsCharts({ applicants }: AnalyticsChartsProps) {
  // Calculate revenue distribution
  const revenueDistribution = {
    'Pre-revenue': applicants.filter(a => a.monthlyRevenue === 'pre_revenue' || a.monthlyRevenue === '<2k').length,
    '$2k-$10k': applicants.filter(a => a.monthlyRevenue === '2k-10k').length,
    '$10k-$50k': applicants.filter(a => a.monthlyRevenue === '10k-50k').length,
    '$50k+': applicants.filter(a => a.monthlyRevenue === '50k+').length,
  };

  // Calculate AI familiarity distribution
  const aiFamiliarityDist = {
    'Beginner (0-3)': applicants.filter(a => a.aiReadiness && a.aiReadiness <= 3).length,
    'Intermediate (4-6)': applicants.filter(a => a.aiReadiness && a.aiReadiness > 3 && a.aiReadiness <= 6).length,
    'Advanced (7-8)': applicants.filter(a => a.aiReadiness && a.aiReadiness > 6 && a.aiReadiness <= 8).length,
    'Expert (9-10)': applicants.filter(a => a.aiReadiness && a.aiReadiness > 8).length,
  };

  // Calculate timeline urgency
  const timelineUrgency = {
    'Within 14 days': applicants.filter(a => a.startTimeline === 'within_14').length,
    '15-30 days': applicants.filter(a => a.startTimeline === '15-30').length,
    '30+ days': applicants.filter(a => a.startTimeline === '>30').length,
  };

  // Calculate fit tier distribution
  const fitTierDist = {
    'STRONG FIT': applicants.filter(a => a.fit_tier === 'STRONG_FIT').length,
    'GOOD FIT': applicants.filter(a => a.fit_tier === 'GOOD_FIT').length,
    'MAYBE': applicants.filter(a => a.fit_tier === 'MAYBE').length,
    'NOT NOW': applicants.filter(a => a.fit_tier === 'NOT_NOW').length,
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Applicant Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Distribution - Pie Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold">Revenue Distribution</h4>
          </div>
          <PieChartComponent
            data={revenueDistribution}
            colors={['#ef4444', '#f59e0b', '#10b981', '#22c55e']}
          />
        </div>

        {/* AI Familiarity - Bar Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold">AI Familiarity Levels</h4>
          </div>
          <BarChartComponent
            data={aiFamiliarityDist}
            color="#3b82f6"
          />
        </div>

        {/* Timeline Urgency - Donut Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h4 className="font-bold">Timeline Urgency</h4>
          </div>
          <DonutChartComponent
            data={timelineUrgency}
            colors={['#22c55e', '#f59e0b', '#ef4444']}
          />
        </div>

        {/* Fit Tier Distribution */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold">Fit Tier Distribution</h4>
          </div>
          <BarChartComponent
            data={fitTierDist}
            color="#a855f7"
          />
        </div>
      </div>
    </div>
  );
}

function PieChartComponent({ data, colors }: { data: Record<string, number>; colors: string[] }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return <p className="text-zinc-500 text-sm text-center py-8">No data available</p>;
  }

  const entries = Object.entries(data);
  let currentAngle = 0;

  return (
    <div className="space-y-4">
      {/* Pie Chart SVG */}
      <div className="flex justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          <circle cx="100" cy="100" r="80" fill="#18181b" />
          {entries.map(([label, value], index) => {
            if (value === 0) return null;
            
            const percentage = (value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            currentAngle = endAngle;
            
            return (
              <path
                key={label}
                d={path}
                fill={colors[index % colors.length]}
                opacity="0.9"
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {entries.map(([label, value], index) => {
          if (value === 0) return null;
          const percentage = ((value / total) * 100).toFixed(1);
          
          return (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-zinc-400">{label}</span>
              </div>
              <span className="text-sm font-medium text-white">
                {value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarChartComponent({ data, color }: { data: Record<string, number>; color: string }) {
  const maxValue = Math.max(...Object.values(data), 1);
  
  if (maxValue === 0) {
    return <p className="text-zinc-500 text-sm text-center py-8">No data available</p>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([label, value]) => {
        const percentage = (value / maxValue) * 100;
        
        return (
          <div key={label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">{label}</span>
              <span className="text-sm font-medium text-white">{value}</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChartComponent({ data, colors }: { data: Record<string, number>; colors: string[] }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return <p className="text-zinc-500 text-sm text-center py-8">No data available</p>;
  }

  const entries = Object.entries(data);
  let currentAngle = 0;

  return (
    <div className="space-y-4">
      {/* Donut Chart SVG */}
      <div className="flex justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          <circle cx="100" cy="100" r="80" fill="#18181b" />
          {entries.map(([label, value], index) => {
            if (value === 0) return null;
            
            const percentage = (value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            currentAngle = endAngle;
            
            return (
              <path
                key={label}
                d={path}
                fill={colors[index % colors.length]}
                opacity="0.9"
              />
            );
          })}
          {/* Inner circle to create donut effect */}
          <circle cx="100" cy="100" r="50" fill="#09090b" />
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-2xl font-bold"
            transform="rotate(90 100 100)"
          >
            {total}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {entries.map(([label, value], index) => {
          if (value === 0) return null;
          const percentage = ((value / total) * 100).toFixed(1);
          
          return (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-zinc-400">{label}</span>
              </div>
              <span className="text-sm font-medium text-white">
                {value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
