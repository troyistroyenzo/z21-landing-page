'use client';

import { useState, useEffect } from 'react';
import { formatNumber, getPercentageChange } from '@/lib/analytics';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Users,
  Activity,
  ChevronDown
} from 'lucide-react';

interface AnalyticsSummary {
  visitors: { value: number; change: number };
  pageViews: { value: number; change: number };
  bounceRate: { value: number; change: number };
  days: number;
}

interface PageStats {
  path: string;
  views: number;
  visitors: number;
}

interface TimelineData {
  date: string;
  count: number;
  displayDate: string;
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(7);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [pages, setPages] = useState<PageStats[]>([]);
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pages' | 'referrers'>('pages');

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, pagesRes, timelineRes] = await Promise.all([
        fetch(`/api/admin/analytics/summary?days=${days}`),
        fetch(`/api/admin/analytics/pages?days=${days}`),
        fetch(`/api/admin/analytics/timeline?days=${days}`)
      ]);

      const summaryData = await summaryRes.json();
      const pagesData = await pagesRes.json();
      const timelineData = await timelineRes.json();

      setSummary(summaryData);
      setPages(pagesData.pages || []);
      setTimeline(timelineData.timeline || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxValue = Math.max(...timeline.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Web Analytics</h1>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-zinc-900 rounded-lg px-4 py-2">
            <button
              onClick={() => setDays(Math.max(7, days - 7))}
              className="p-1 hover:bg-zinc-800 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 min-w-[100px] text-center">
              Last {days} Days
            </span>
            <button
              onClick={() => setDays(Math.min(90, days + 7))}
              className="p-1 hover:bg-zinc-800 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Visitors */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Visitors</span>
              <Users className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">
                {loading ? '-' : formatNumber(summary?.visitors.value || 0)}
              </span>
              {summary && summary.visitors.change !== 0 && (
                <span 
                  className={`flex items-center text-sm ${
                    summary.visitors.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {summary.visitors.change > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(summary.visitors.change)}%
                </span>
              )}
            </div>
          </div>

          {/* Page Views */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Page Views</span>
              <Eye className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">
                {loading ? '-' : formatNumber(summary?.pageViews.value || 0)}
              </span>
              {summary && summary.pageViews.change !== 0 && (
                <span 
                  className={`flex items-center text-sm ${
                    summary.pageViews.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {summary.pageViews.change > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(summary.pageViews.change)}%
                </span>
              )}
            </div>
          </div>

          {/* Bounce Rate */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Bounce Rate</span>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">
                {loading ? '-' : `${summary?.bounceRate.value || 0}%`}
              </span>
              {summary && summary.bounceRate.change !== 0 && (
                <span 
                  className={`flex items-center text-sm ${
                    summary.bounceRate.change < 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {summary.bounceRate.change > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(summary.bounceRate.change)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Page Views</h3>
          <div className="h-64 flex items-end gap-1">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Loading...
              </div>
            ) : timeline.length > 0 ? (
              timeline.map((data, index) => (
                <div
                  key={data.date}
                  className="flex-1 flex flex-col items-center gap-2"
                  title={`${data.displayDate}: ${data.count} views`}
                >
                  <div 
                    className="w-full bg-blue-600 rounded-t hover:bg-blue-500 transition-colors relative"
                    style={{ 
                      height: `${(data.count / maxValue) * 100}%`,
                      minHeight: data.count > 0 ? '2px' : '0'
                    }}
                  />
                  {index % Math.ceil(timeline.length / 7) === 0 && (
                    <span className="text-xs text-gray-500 mt-2">
                      {data.displayDate}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pages Table */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pages</h3>
              <span className="text-sm text-gray-400">VISITORS</span>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
            ) : pages.length > 0 ? (
              <div className="space-y-2">
                {pages.map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between py-2 px-3 hover:bg-zinc-800 rounded"
                  >
                    <span className="text-sm truncate flex-1 mr-4">
                      {page.path}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        {page.views} views
                      </span>
                      <span className="text-sm font-medium">
                        {formatNumber(page.visitors)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No page data available
              </div>
            )}
          </div>

          {/* Referrers Table */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Referrers</h3>
              <span className="text-sm text-gray-400">VISITORS</span>
            </div>
            <div className="text-center text-gray-500 py-8">
              <p>Referrer tracking coming soon</p>
              <p className="text-sm mt-2">
                This will show where your traffic comes from
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
