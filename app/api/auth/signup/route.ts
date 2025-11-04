import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { hashPassword, generateToken } from '@/lib/server/auth';
import { StatusCode } from '@/lib/server/status.code';
import { signupSchema } from '@/lib/validations/auth.validation';
import logger from '@/lib/server/logger';

export async function POST(request: NextRequest) {
  logger.info('Signup attempt');
  try {
    const body = await request.json();
    const validationResult = signupSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.format();
      logger.warn({ validation: errorMessages }, 'Signup validation failed');
      return NextResponse.json(
        { error: errorMessages },
        { status: StatusCode.BAD_REQUEST }
      );
    }
    const { name, email, mobile, address, password, role } = validationResult.data;

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      logger.warn({ email }, 'Email already exists during signup');
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: StatusCode.CONFLICT }
      );
    }
    
    const existingUserByMobile = await prisma.user.findUnique({
      where: { mobile },
    });

    if (existingUserByMobile) {
      logger.warn({ mobile }, 'Mobile number already exists during signup');
      return NextResponse.json(
        { error: 'User with this mobile number already exists' },
        { status: StatusCode.CONFLICT }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        address,
        password: hashedPassword,
        role,
      },
    });

    const token = generateToken(user.id, user.email, user.role);

    const { password: _, ...userWithoutPassword } = user;

    logger.info({ userId: user.id }, 'User created successfully');
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
        token,
      },
      { status: StatusCode.CREATED }
    );
  } catch (error) {
    logger.error({ err: error }, 'Signup error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}