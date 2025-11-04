import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { comparePassword, generateToken } from '@/lib/server/auth';
import { StatusCode } from '@/lib/server/status.code';
import { loginSchema } from '@/lib/validations/auth.validation';
import logger from '@/lib/server/logger';

export async function POST(request: NextRequest) {
  logger.info('Login attempt');
  try {
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.format();
      logger.warn({ validation: errorMessages }, 'Login validation failed');
      return NextResponse.json(
        { error: errorMessages },
        { status: StatusCode.BAD_REQUEST }
      );
    }
    
    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({where:{ email }});

    if (!user) {
      logger.warn({ email }, 'User not found during login');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      logger.warn({ email }, 'Invalid password during login');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    const token = generateToken(user.id, user.email, user.role);
    const { password: _, ...userWithoutPassword } = user;

    logger.info({ userId: user.id }, 'Login successful');
    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      },
      { status: StatusCode.OK }
    );
  } catch (error) {
    logger.error({ err: error }, 'Login error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}