import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { handleRouteError } from '@/lib/api/route-error';
import { getUserState } from '@/lib/services/user.service';
import { selectQuestion, getRecentQuestionIds } from '@/lib/services/question.service';
import { NextQuestionResponse } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const { userId } = verifyToken(extractTokenFromHeader(authHeader));

    const state = await getUserState(userId);

    const recentQuestionIds = await getRecentQuestionIds(userId, 5);

    const question = await selectQuestion(state.currentDifficulty, recentQuestionIds);

    const response: NextQuestionResponse = {
      questionId: question.id,
      difficulty: question.difficulty,
      prompt: question.prompt,
      choices: question.choices as string[],
      sessionId: state.sessionId || '',
      stateVersion: Number(state.stateVersion),
      currentScore: Number(state.totalScore),
      currentStreak: state.streak,
      maxStreak: state.maxStreak,
      momentum: Number(state.momentum),
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleRouteError('Next question error', error);
  }
}
