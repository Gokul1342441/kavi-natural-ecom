import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { hashPassword, generateToken } from '@/lib/server/auth';
import { StatusCode } from '@/lib/server/status.code';
import { signupSchema } from '@/lib/validations/auth.validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input with Zod
    const validationResult = signupSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.format();
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
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: StatusCode.CONFLICT }
      );
    }
    
    const existingUserByMobile = await prisma.user.findUnique({
      where: { mobile },
    });

    if (existingUserByMobile) {
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

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
        token,
      },
      { status: StatusCode.CREATED }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}