'use client';

import { useState, useEffect } from 'react';
import { Eye, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface AnalyticsSummary {
  pageViews: { value: number; change: number };
  visitors: { value: number; change: number };
}

interface AnalyticsCardProps {
  onViewAnalytics?: () => void;
}

export default function AnalyticsCard({ onViewAnalytics }: AnalyticsCardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/admin/analytics/summary?days=7');
      const data = await response.json();
      setSummary({
        pageViews: data.pageViews || { value: 0, change: 0 },
        visitors: data.visitors || { value: 0, change: 0 }
      });
    } catch (error) {
      console.error('Failed to fetch analytics summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Web Analytics</h3>
        </div>
        <button
          onClick={onViewAnalytics}
          className="text-blue-500 hover:text-blue-400 transition-colors"
          title="View full analytics"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-16 bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-16 bg-zinc-800 rounded-lg animate-pulse" />
        </div>
      ) : summary ? (
        <div className="space-y-4">
          {/* Page Views */}
          <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-400 mb-1">Page Views</p>
              <p className="text-2xl font-bold">
                {summary.pageViews.value.toLocaleString()}
              </p>
            </div>
            {summary.pageViews.change !== 0 && (
              <div className={`flex items-center gap-1 ${
                summary.pageViews.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {summary.pageViews.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(summary.pageViews.change)}%
                </span>
              </div>
            )}
          </div>

          {/* Visitors */}
          <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-400 mb-1">Visitors</p>
              <p className="text-2xl font-bold">
                {summary.visitors.value.toLocaleString()}
              </p>
            </div>
            {summary.visitors.change !== 0 && (
              <div className={`flex items-center gap-1 ${
                summary.visitors.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {summary.visitors.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(summary.visitors.change)}%
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No analytics data available</p>
          <button
            onClick={onViewAnalytics}
            className="text-blue-500 hover:underline text-sm mt-2 inline-block"
          >
            View full analytics →
          </button>
        </div>
      )}
    </div>
  );
}
