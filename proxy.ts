import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server/logger';

export function proxy(request: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  
  // Log the request
  logger.info({
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') || 'unknown',
  }, 'API request received');
  
  const response = NextResponse.next();
  
  // Add timing and request ID headers
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  response.headers.set('X-Request-ID', requestId);
  
  return response;
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
};
