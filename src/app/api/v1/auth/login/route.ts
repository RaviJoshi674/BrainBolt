import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { verifyPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { handleRouteError } from '@/lib/api/route-error';
import { loginSchema } from '@/lib/utils/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      token,
    });
  } catch (error) {
    return handleRouteError('Login error', error);
  }
}
