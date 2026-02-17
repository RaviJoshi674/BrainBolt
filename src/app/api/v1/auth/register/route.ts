import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { handleRouteError } from '@/lib/api/route-error';
import { ensureUserState } from '@/lib/services/user.service';
import { registerSchema } from '@/lib/utils/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: validatedData.email }, { username: validatedData.username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    await ensureUserState(user.id);

    const token = signToken({ userId: user.id, email: user.email });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError('Registration error', error);
  }
}
