'use client';

import { useState, useEffect } from 'react';
/**
 * Client hooks call server API routes; no direct supabase usage on the client.
 * This avoids exposing SUPABASE_SERVICE_ROLE_KEY and fixes env errors.
 */

// Types
interface CTAResponse {
  id: string;
  name: string;
  email: string;
  business_description: string;
  ai_summary: string;
  score: number;
  qualification_status: string;
  created_at: string;
  responses: any;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  subscribed_at: string;
  metadata: any;
}

interface AdminStats {
  totalApplicants: number;
  qualifiedLeads: number;
  newsletterSubscribers: number;
  resourcesCount: number;
}

interface Activity {
  id: string;
  type: 'application' | 'subscription';
  title: string;
  description: string;
  timestamp: string;
}

// Custom hooks
export function useApplicants() {
  const [applicants, setApplicants] = useState<CTAResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch('/api/admin/applicants', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch applicants');
        setApplicants(json.applicants || []);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch applicants');
      } finally {
        setLoading(false);
      }
    }

    fetchApplicants();
  }, []);

  return { applicants, loading, error };
}

export function useSubscribers() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const res = await fetch('/api/admin/subscribers', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch subscribers');
        setSubscribers(json.subscribers || []);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch subscribers');
      } finally {
        setLoading(false);
      }
    }

    fetchSubscribers();
  }, []);

  return { subscribers, loading, error };
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalApplicants: 0,
    qualifiedLeads: 0,
    newsletterSubscribers: 0,
    resourcesCount: 43 // Static for now, from aiResources.ts
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch stats');

        setStats({
          totalApplicants: json.totalApplicants ?? 0,
          qualifiedLeads: json.qualifiedLeads ?? 0,
          newsletterSubscribers: json.newsletterSubscribers ?? 0,
          resourcesCount: json.resourcesCount ?? 43
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        // Call our API endpoints instead of Supabase directly
        const [appsRes, subsRes] = await Promise.all([
          fetch('/api/admin/applicants', { cache: 'no-store' }),
          fetch('/api/admin/subscribers', { cache: 'no-store' })
        ]);
        const [appsJson, subsJson] = await Promise.all([appsRes.json(), subsRes.json()]);
        if (!appsRes.ok) throw new Error(appsJson.error || 'Failed to fetch applicants');
        if (!subsRes.ok) throw new Error(subsJson.error || 'Failed to fetch subscribers');

        const recentApplicants = (appsJson.applicants || []).slice(0, 3);
        const recentSubscribers = (subsJson.subscribers || []).slice(0, 3);

        const merged: Activity[] = [];

        recentApplicants.forEach((app: any) => {
          merged.push({
            id: `app-${app.id}`,
            type: 'application',
            title: 'New vibe-check application',
            description: `${app.name} - ${app.business_description?.substring(0, 50)}...`,
            timestamp: app.created_at
          });
        });

        recentSubscribers.forEach((sub: any) => {
          merged.push({
            id: `sub-${sub.id}`,
            type: 'subscription',
            title: 'Newsletter subscription',
            description: `From: ${sub.source}`,
            timestamp: sub.subscribed_at
          });
        });

        merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(merged.slice(0, 5));
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activity');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, []);

  return { activities, loading, error };
}

// Utility functions
export function getQualificationStatus(qualificationStatus: string): 'qualified' | 'review' | 'rejected' {
  if (qualificationStatus === 'strong_fit') return 'qualified';
  if (qualificationStatus === 'conditional') return 'review';
  return 'rejected'; // not_qualified or any other value
}

export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
