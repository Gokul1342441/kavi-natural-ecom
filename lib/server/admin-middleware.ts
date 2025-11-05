import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from './middleware';
import { StatusCode } from './status.code';
import logger from './logger';

export function verifySuperAdmin(request: NextRequest) {
  const authResult = verifyAuthToken(request);
  
  if (authResult.error) {
    logger.warn({ error: authResult.error }, 'Authentication failed during admin verification');
    return { 
      error: authResult.error, 
      status: authResult.status,
      response: NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    };
  }

  const { user: tokenUser } = authResult;
  
  if (tokenUser.role !== 'SUPER_ADMIN') {
    logger.warn({ userId: tokenUser.userId }, 'Unauthorized admin access attempt');
    return { 
      error: 'Only SUPER_ADMIN users can perform this action', 
      status: StatusCode.FORBIDDEN,
      response: NextResponse.json(
        { error: 'Only SUPER_ADMIN users can perform this action' },
        { status: StatusCode.FORBIDDEN }
      )
    };
  }

  return { 
    admin: tokenUser, 
    status: StatusCode.OK 
  };
}
