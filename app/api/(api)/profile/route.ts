import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { verifyAuthToken } from '@/lib/server/middleware';
import { StatusCode } from '@/lib/server/status.code';
import logger from '@/lib/server/logger';

export async function GET(request: NextRequest) {
  logger.info('Profile fetch attempt');
  try {
    const authResult = verifyAuthToken(request);

    if (authResult.error) {
      logger.warn({ error: authResult.error }, 'Authentication failed during profile fetch');
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { user: tokenUser } = authResult;

    const user = await prisma.user.findUnique({
      where: { id: tokenUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      logger.warn({ userId: tokenUser.userId }, 'User not found during profile fetch');
      return NextResponse.json(
        { error: 'User not found' },
        { status: StatusCode.NOT_FOUND }
      );
    }

    logger.info({ userId: user.id }, 'Profile fetched successfully');
    return NextResponse.json(
      {
        message: 'Profile fetched successfully',
        user,
      },
      { status: StatusCode.OK }
    );
  } catch (error) {
    logger.error({ err: error }, 'Profile fetch error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}