'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view when pathname or search params change
    const path = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(path);
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
