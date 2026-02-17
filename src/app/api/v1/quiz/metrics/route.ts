import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { handleRouteError } from '@/lib/api/route-error';
import { getUserMetrics } from '@/lib/services/metrics.service';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyToken(extractTokenFromHeader(authHeader));

    const metrics = await getUserMetrics(userId);

    return NextResponse.json(metrics);
  } catch (error) {
    return handleRouteError('Metrics error', error);
  }
}
