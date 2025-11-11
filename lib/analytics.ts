import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

// Generate or retrieve session ID
function getSessionId(): string {
  const SESSION_KEY = 'analytics_session_id';
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  
  if (typeof window === 'undefined') return '';
  
  const stored = sessionStorage.getItem(SESSION_KEY);
  const now = Date.now();
  
  if (stored) {
    const { id, timestamp } = JSON.parse(stored);
    if (now - timestamp < SESSION_DURATION) {
      // Update timestamp
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, timestamp: now }));
      return id;
    }
  }
  
  // Generate new session
  const id = uuidv4();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, timestamp: now }));
  return id;
}

// Hash function for privacy-friendly IP tracking
async function hashString(str: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto) return '';
  
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Track a page view
export async function trackPageView(path: string) {
  // Don't track in development or admin pages
  if (process.env.NODE_ENV === 'development') return;
  if (path.startsWith('/admin')) return;
  
  try {
    const sessionId = getSessionId();
    const referrer = document.referrer || null;
    const userAgent = navigator.userAgent;
    
    // Get IP hash (you'd need a server endpoint for real IP)
    // For now, we'll use a placeholder
    const ipHash = await hashString(sessionId + userAgent);
    
    await supabase.from('page_views').insert({
      page_path: path,
      session_id: sessionId,
      referrer,
      user_agent: userAgent,
      ip_hash: ipHash,
      country: null // Could use a geolocation service
    });
  } catch (error) {
    // Silently fail - don't interrupt user experience
    console.error('Analytics tracking failed:', error);
  }
}

// Calculate bounce rate (simplified)
export function calculateBounceRate(sessions: any[]): number {
  if (!sessions.length) return 0;
  
  const singlePageSessions = sessions.filter(s => s.page_count === 1).length;
  return Math.round((singlePageSessions / sessions.length) * 100);
}

// Format numbers with K/M suffixes
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Get percentage change
export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
