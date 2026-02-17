import redis from './redis';
import { CACHE_KEYS, CACHE_TTL } from './keys';
import { prisma } from '../db/client';
import { UserState } from '@prisma/client';

function serializeUserState(state: UserState): string {
  return JSON.stringify({
    ...state,
    totalScore: Number(state.totalScore),
    totalQuestions: Number(state.totalQuestions),
    correctAnswers: Number(state.correctAnswers),
    stateVersion: Number(state.stateVersion),
  });
}

export async function getUserStateFromCache(userId: string): Promise<UserState | null> {
  try {
    const cached = await redis.get(CACHE_KEYS.USER_STATE(userId));
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        ...parsed,
        totalScore: BigInt(parsed.totalScore),
        totalQuestions: Number(parsed.totalQuestions),
        correctAnswers: Number(parsed.correctAnswers),
        stateVersion: Number(parsed.stateVersion),
        lastAnswerAt: parsed.lastAnswerAt ? new Date(parsed.lastAnswerAt) : null,
        updatedAt: new Date(parsed.updatedAt),
      } as UserState;
    }

    const state = await prisma.userState.findUnique({
      where: { userId },
    });

    if (state) {
      await redis.setEx(
        CACHE_KEYS.USER_STATE(userId),
        CACHE_TTL.USER_STATE,
        serializeUserState(state)
      );
    }

    return state;
  } catch (error) {
    console.error('Cache error, falling back to DB:', error);
    return await prisma.userState.findUnique({ where: { userId } });
  }
}

export async function invalidateUserCache(userId: string): Promise<void> {
  try {
    await Promise.all([
      redis.del(CACHE_KEYS.USER_STATE(userId)),
      redis.del(CACHE_KEYS.USER_RANK_SCORE(userId)),
      redis.del(CACHE_KEYS.USER_RANK_STREAK(userId)),
      redis.del(CACHE_KEYS.RECENT_ANSWERS(userId)),
    ]);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

export async function getQuestionPoolFromCache(difficulty: number): Promise<string[]> {
  try {
    const cached = await redis.get(CACHE_KEYS.QUESTION_POOL(difficulty));
    if (cached) {
      return JSON.parse(cached);
    }

    const questions = await prisma.question.findMany({
      where: { difficulty },
      select: { id: true },
    });

    const questionIds = questions.map((q) => q.id);

    await redis.setEx(
      CACHE_KEYS.QUESTION_POOL(difficulty),
      CACHE_TTL.QUESTION_POOL,
      JSON.stringify(questionIds)
    );

    return questionIds;
  } catch (error) {
    console.error('Cache error, falling back to DB:', error);
    const questions = await prisma.question.findMany({
      where: { difficulty },
      select: { id: true },
    });
    return questions.map((q) => q.id);
  }
}

export async function updateLeaderboardCache(
  userId: string,
  username: string,
  score: number,
  streak: number
): Promise<void> {
  try {
    await Promise.all([
      redis.zAdd('leaderboard:score', { score, value: `${userId}:${username}` }),
      redis.zAdd('leaderboard:streak', { score: streak, value: `${userId}:${username}` }),
    ]);
  } catch (error) {
    console.error('Leaderboard cache update error:', error);
  }
}

export async function getUserRankFromCache(
  userId: string,
  type: 'score' | 'streak'
): Promise<number> {
  try {
    const key = type === 'score' ? 'leaderboard:score' : 'leaderboard:streak';
    const rank = await redis.zRevRank(key, userId);
    return rank !== null ? rank + 1 : -1;
  } catch (error) {
    console.error('Rank fetch error:', error);
    return -1;
  }
}
