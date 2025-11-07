import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Email validation schema
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .max(255, 'Email too long')
  .transform(val => val.toLowerCase().trim());

// Name validation schema  
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters')
  .transform(val => val.trim());

// Phone validation schema
export const phoneSchema = z.string()
  .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number')
  .min(10, 'Phone number too short')
  .max(20, 'Phone number too long')
  .transform(val => val.replace(/\D/g, ''));

// URL validation schema
export const urlSchema = z.string()
  .url('Invalid URL')
  .max(2048, 'URL too long')
  .refine(url => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }, 'URL must use http or https protocol');

// Company validation schema
export const companySchema = z.string()
  .min(1, 'Company name is required')
  .max(200, 'Company name too long')
  .transform(val => val.trim());

// Message validation schema
export const messageSchema = z.string()
  .min(10, 'Message too short')
  .max(5000, 'Message too long')
  .transform(val => DOMPurify.sanitize(val.trim()));

// ID validation (for database IDs)
export const idSchema = z.string()
  .uuid('Invalid ID format')
  .or(z.string().regex(/^[a-z0-9\-]+$/, 'Invalid ID format'));

// Pagination schemas
export const pageSchema = z.number()
  .int()
  .min(1)
  .default(1);

export const limitSchema = z.number()
  .int()
  .min(1)
  .max(100)
  .default(20);

// Sort schemas
export const sortBySchema = z.enum(['created_at', 'updated_at', 'name', 'email', 'click_count', 'view_count', 'engagement_score']);
export const orderSchema = z.enum(['asc', 'desc']).default('desc');

// Newsletter subscription schema
export const subscribeSchema = z.object({
  email: emailSchema,
  source: z.string().optional(),
  referrer: z.string().optional()
});

// CTA submission schema
export const ctaSubmissionSchema = z.object({
  email: emailSchema,
  answers: z.record(z.string(), z.any()),
  source: z.string().optional()
});

// Onboarding submission schema
export const onboardingSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  phone: phoneSchema.optional(),
  company: companySchema.optional(),
  website: urlSchema.optional(),
  answers: z.record(z.string(), z.any()),
  source: z.string().optional()
});

// Resource schemas
export const resourceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(1000),
  url: urlSchema,
  type: z.enum(['tool', 'article', 'video', 'prompt-library', 'course', 'forum']),
  category: z.string().min(1).max(100),
  tags: z.array(z.string()).max(10).optional(),
  featured: z.boolean().default(false),
  submitted_by: z.string().max(100).optional()
});

export const resourceUpdateSchema = resourceCreateSchema.partial();

export const resourceQuerySchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  type: z.string().optional(),
  featured: z.boolean().optional(),
  sortBy: z.enum(['created_at', 'click_count', 'view_count', 'engagement_score', 'trending']).default('created_at'),
  order: orderSchema,
  page: pageSchema,
  limit: limitSchema
});

// Admin schemas
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const deleteSchema = z.object({
  id: idSchema
});

// SQL injection prevention
export function sanitizeSqlInput(input: string): string {
  // Remove or escape potentially dangerous SQL characters
  return input
    .replace(/['";\\]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove multi-line comments
    .replace(/\*\//g, '')
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE)\b/gi, '') // Remove SQL keywords
    .trim();
}

// XSS prevention
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}

// Input validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Rate limiting helper (for additional protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { count: 0, resetTime: now + windowMs };
  
  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }
  
  record.count++;
  rateLimitMap.set(identifier, record);
  
  const allowed = record.count <= limit;
  const remaining = Math.max(0, limit - record.count);
  const resetIn = Math.max(0, record.resetTime - now);
  
  return { allowed, remaining, resetIn };
}

// Clean expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime + 60000) { // Remove entries older than 1 minute past reset
      rateLimitMap.delete(key);
    }
  }
}, 300000); // Clean every 5 minutes

// Validate environment variables
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// IP address extraction
export function getClientIp(request: Request | Headers): string {
  const headers = request instanceof Request ? request.headers : request;
  
  return headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         headers.get('x-real-ip') ||
         headers.get('cf-connecting-ip') ||
         headers.get('x-client-ip') ||
         'unknown';
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function validateCSRFToken(token: string | null, storedToken: string | null): boolean {
  if (!token || !storedToken) return false;
  return token === storedToken;
}

// Export all schemas and utilities
export const validators = {
  email: emailSchema,
  name: nameSchema,
  phone: phoneSchema,
  url: urlSchema,
  company: companySchema,
  message: messageSchema,
  id: idSchema,
  subscribe: subscribeSchema,
  ctaSubmission: ctaSubmissionSchema,
  onboarding: onboardingSchema,
  resourceCreate: resourceCreateSchema,
  resourceUpdate: resourceUpdateSchema,
  resourceQuery: resourceQuerySchema,
  adminLogin: adminLoginSchema,
  delete: deleteSchema
};
