import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { handleRouteError } from '@/lib/api/route-error';
import { getScoreLeaderboard } from '@/lib/services/leaderboard.service';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let userId: string | undefined;

    try {
      const payload = verifyToken(extractTokenFromHeader(authHeader));
      userId = payload.userId;
    } catch {
      userId = undefined;
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const leaderboard = await getScoreLeaderboard(limit, offset, userId);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return handleRouteError('Score leaderboard error', error);
  }
}
