import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { verifyAuthToken } from '@/lib/server/middleware';
import { StatusCode } from '@/lib/server/status.code';
import { profileUpdateSchema } from '@/lib/validations/profile.validation';

export async function GET(request: NextRequest) {
  try {
    // Verify token and get user info
    const authResult = verifyAuthToken(request);

    if (authResult.error) {
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: StatusCode.NOT_FOUND }
      );
    }

    return NextResponse.json(
      {
        message: 'Profile fetched successfully',
        user,
      },
      { status: StatusCode.OK }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = verifyAuthToken(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { user: tokenUser } = authResult;
    const body = await request.json();
    
    // Validate input with Zod
    const validationResult = profileUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.format();
      return NextResponse.json(
        { error: errorMessages },
        { status: StatusCode.BAD_REQUEST }
      );
    }
    
    const { name, mobile, address } = validationResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: tokenUser.userId },
      data: {
        ...(name && { name }),
        ...(mobile && { mobile }),
        ...(address && { address }),
      },
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

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: StatusCode.OK }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}