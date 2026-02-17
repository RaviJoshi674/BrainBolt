import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { handleRouteError } from '@/lib/api/route-error';
import { submitAnswer } from '@/lib/services/answer.service';
import { submitAnswerSchema } from '@/lib/utils/validation';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyToken(extractTokenFromHeader(authHeader));

    const body = await req.json();

    const validatedData = submitAnswerSchema.parse({
      ...body,
      userId,
    });

    const response = await submitAnswer(validatedData);

    return NextResponse.json(response);
  } catch (error) {
    return handleRouteError('Submit answer error', error);
  }
}
