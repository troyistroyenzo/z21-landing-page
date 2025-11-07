import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Note: protected routes are handled per-route; middleware focuses on API admin paths
const publicApiRoutes = ['/api/subscribe', '/api/cta-submit', '/api/onboarding-submit'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Content Security Policy - Updated for production compatibility
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://cdn.vercel-insights.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://*.supabase.co wss://*.supabase.co https://raw.githack.com https://cdn.jsdelivr.net",
    "frame-src 'self' https://form.typeform.com https://www.youtube.com https://youtube.com",
    "media-src 'self' https://www.youtube.com https://youtube.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    // If route is explicitly public, skip rate limiting (mark headers and return)
    if (publicApiRoutes.includes(pathname)) {
      response.headers.set('X-RateLimit-Exempt', 'true');
      response.headers.set('X-RateLimit-Limit', 'unlimited');
      response.headers.set('X-RateLimit-Remaining', 'unlimited');
      return response;
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const key = `${ip}:${pathname}`;
    const now = Date.now();
    
    const rateLimitData = rateLimitMap.get(key) || { count: 0, lastReset: now };
    
    // Reset counter if window has passed
    if (now - rateLimitData.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitData.count = 0;
      rateLimitData.lastReset = now;
    }
    
    rateLimitData.count++;
    rateLimitMap.set(key, rateLimitData);
    
    // Check if rate limit exceeded
    if (rateLimitData.count > MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests', 
          message: 'Please try again later' 
        }),
        { 
          status: 429, 
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW / 1000))
          }
        }
      );
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS));
    response.headers.set('X-RateLimit-Remaining', String(MAX_REQUESTS - rateLimitData.count));
    response.headers.set('X-RateLimit-Reset', String(rateLimitData.lastReset + RATE_LIMIT_WINDOW));
  }

  // Authentication check for protected routes
  // Only protect API routes - let AdminAuth component handle page authentication
  if (pathname.startsWith('/api/admin')) {
    // Check for any Supabase auth cookie (they use pattern: sb-{project}-auth-token)
    const cookies = request.cookies.getAll();
    const supabaseAuthCookie = cookies.find(cookie => 
      cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );
    
    // If no Supabase auth cookie found, return 401
    // The AdminAuth component already handles page-level authentication
    if (!supabaseAuthCookie) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Additional admin API check using environment variables (optional)
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()).filter(Boolean) || [];
    if (adminEmails.length > 0) {
      const authTokenValue = supabaseAuthCookie?.value;
      const isAdmin = typeof authTokenValue === 'string' && adminEmails.some(email => authTokenValue.includes(email));
      if (!isAdmin) {
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // CSRF Protection for mutations
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // Check origin header for CSRF protection
    if (origin && host) {
      const allowedOrigins = [
        `https://${host}`,
        `http://localhost:3000`,
        'http://localhost:3001'
      ];
      
      if (!allowedOrigins.includes(origin)) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF validation failed' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
