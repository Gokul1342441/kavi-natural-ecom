import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { StatusCode } from './status.code';

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

export function verifyAuthToken(request: NextRequest) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return { error: 'No token provided', status: StatusCode.UNAUTHORIZED };
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { error: 'Invalid or expired token', status: StatusCode.UNAUTHORIZED };
  }
  
  return { user: decoded, status: StatusCode.OK };
}