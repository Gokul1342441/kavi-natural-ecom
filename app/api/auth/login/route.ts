import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { comparePassword, generateToken } from '@/lib/server/auth';
import { StatusCode } from '@/lib/server/status.code';
import { loginSchema } from '@/lib/validations/auth.validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.format();
      return NextResponse.json(
        { error: errorMessages },
        { status: StatusCode.BAD_REQUEST }
      );
    }
    
    const { email, password } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: StatusCode.UNAUTHORIZED }
      );
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      },
      { status: StatusCode.OK }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}