// Analytics placeholder functions
// Replace with actual implementations in production

declare global {
  interface Window {
    fathom?: {
      (...args: unknown[]): void;
      q?: unknown[];
      trackGoal?: (id: string, value: number) => void;
      trackPageview?: (options?: { url: string }) => void;
    };
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const initAnalytics = () => {
  // Initialize Fathom Analytics
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FATHOM_SITE_ID) {
    window.fathom = window.fathom || function(...args: unknown[]) {
      (window.fathom!.q = window.fathom!.q || []).push(args);
    };
    
    const script = document.createElement('script');
    script.src = 'https://cdn.usefathom.com/script.js';
    script.setAttribute('data-site', process.env.NEXT_PUBLIC_FATHOM_SITE_ID);
    script.setAttribute('defer', 'defer');
    document.head.appendChild(script);
  }

  // Initialize Meta Pixel
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_META_PIXEL) {
    const initFbPixel = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod(...arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `;
    
    const script = document.createElement('script');
    script.innerHTML = initFbPixel;
    document.head.appendChild(script);
    
    if (window.fbq) {
      window.fbq('init', process.env.NEXT_PUBLIC_META_PIXEL);
      window.fbq('track', 'PageView');
    }
  }

  // YouTube tracking placeholder
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_YOUTUBE_TRACKING) {
    // YouTube tracking implementation would go here
    console.log('YouTube tracking initialized');
  }
};

export const trackEvent = (eventName: string, eventData?: Record<string, unknown>) => {
  // Fathom tracking
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FATHOM_SITE_ID) {
    if (window.fathom?.trackGoal) {
      const value = typeof eventData?.value === 'number' ? eventData.value : 0;
      window.fathom.trackGoal(eventName, value);
    }
  }

  // Meta Pixel tracking
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_META_PIXEL) {
    if (window.fbq) {
      window.fbq('track', eventName, eventData);
    }
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Track Event:', eventName, eventData);
  }
};

export const trackPageView = (url?: string) => {
  // Fathom
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FATHOM_SITE_ID) {
    if (window.fathom?.trackPageview) {
      window.fathom.trackPageview({ url: url || window.location.pathname });
    }
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_META_PIXEL) {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }
};
