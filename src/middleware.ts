import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type RateLimitWindow = {
  count: number;
  resetAt: number;
};

const GLOBAL_RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000,
};

const ANSWER_RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 1000,
};

const rateLimitStore = globalThis as typeof globalThis & {
  __brainboltRateLimitMap?: Map<string, RateLimitWindow>;
};

const requestCounts = rateLimitStore.__brainboltRateLimitMap || new Map<string, RateLimitWindow>();
rateLimitStore.__brainboltRateLimitMap = requestCounts;

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwardedFor?.split(',')[0].trim() || realIp || 'unknown';
}

function enforceRateLimit(
  request: NextRequest,
  bucket: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const identifier = getClientIdentifier(request);
  const key = `${bucket}:${identifier}`;
  const now = Date.now();
  const current = requestCounts.get(key);

  if (!current || now >= current.resetAt) {
    const resetAt = now + windowMs;
    requestCounts.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  requestCounts.set(key, current);
  return { allowed: true, remaining: maxRequests - current.count, resetAt: current.resetAt };
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAnswerEndpoint = pathname === '/api/v1/quiz/answer';

  const limiter = isAnswerEndpoint ? ANSWER_RATE_LIMIT : GLOBAL_RATE_LIMIT;
  const bucket = isAnswerEndpoint ? 'answer' : 'api';
  const rateLimit = enforceRateLimit(request, bucket, limiter.maxRequests, limiter.windowMs);

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    const tooManyRequestsResponse = NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
    tooManyRequestsResponse.headers.set('Retry-After', String(Math.max(retryAfterSeconds, 1)));
    tooManyRequestsResponse.headers.set('X-RateLimit-Limit', String(limiter.maxRequests));
    tooManyRequestsResponse.headers.set('X-RateLimit-Remaining', '0');
    tooManyRequestsResponse.headers.set('X-RateLimit-Reset', String(rateLimit.resetAt));
    return applySecurityHeaders(tooManyRequestsResponse);
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(limiter.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimit.resetAt));

  return applySecurityHeaders(response);
}

export const config = {
  matcher: '/api/:path*',
};
