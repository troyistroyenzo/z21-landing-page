'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineData {
  date: string;
  count: number;
  displayDate: string;
}

export default function ApplicantsChart() {
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchTimeline();
  }, [days]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applicants/timeline?days=${days}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTimeline(json.timeline || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Applicants Over Time</h3>
        <p className="text-red-400 text-sm">Error loading chart: {error}</p>
      </div>
    );
  }

  const totalApplicants = timeline.reduce((sum, item) => sum + item.count, 0);
  const averagePerDay = timeline.length > 0 ? (totalApplicants / timeline.length).toFixed(1) : '0';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Applicants Over Time</h3>
          <div className="flex gap-4 mt-2 text-sm text-zinc-400">
            <span>Total: <span className="text-white font-semibold">{totalApplicants}</span></span>
            <span>Avg/day: <span className="text-white font-semibold">{averagePerDay}</span></span>
          </div>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-zinc-400">Loading chart...</div>
        </div>
      ) : timeline.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-zinc-400">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis 
              dataKey="displayDate" 
              stroke="#71717a"
              tick={{ fill: '#a1a1aa' }}
              tickLine={{ stroke: '#52525b' }}
            />
            <YAxis 
              stroke="#71717a"
              tick={{ fill: '#a1a1aa' }}
              tickLine={{ stroke: '#52525b' }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#a1a1aa' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#22d3ee" 
              strokeWidth={2}
              dot={{ fill: '#22d3ee', r: 4 }}
              activeDot={{ r: 6 }}
              name="Applicants"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
