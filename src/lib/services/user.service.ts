import { prisma } from '../db/client';
import { getUserStateFromCache, invalidateUserCache } from '../cache/strategies';
import { ADAPTIVE_CONFIG } from '../adaptive/config';
import { adaptiveEngine } from '../adaptive/engine';
import { NotFoundError } from '../utils/errors';
import { randomUUID } from 'crypto';

export async function getUserState(userId: string): Promise<any> {
  let state = await getUserStateFromCache(userId);

  if (!state) {
    state = await prisma.userState.create({
      data: {
        userId,
        currentDifficulty: ADAPTIVE_CONFIG.INITIAL_DIFFICULTY,
        sessionId: randomUUID(),
      },
    });
  }

  if (state.lastAnswerAt && adaptiveEngine.shouldResetStreak(state.lastAnswerAt)) {
    state = await prisma.userState.update({
      where: { userId },
      data: {
        streak: 0,
        momentum: 0,
        lastAnswerAt: null,
        stateVersion: state.stateVersion + 1,
      },
    });
    await invalidateUserCache(userId);
  }

  return state;
}

export async function ensureUserState(userId: string): Promise<void> {
  const existing = await prisma.userState.findUnique({
    where: { userId },
  });

  if (!existing) {
    await prisma.userState.create({
      data: {
        userId,
        currentDifficulty: ADAPTIVE_CONFIG.INITIAL_DIFFICULTY,
        sessionId: randomUUID(),
      },
    });
  }
}

export async function getRecentAccuracy(userId: string, windowSize: number = 10): Promise<number> {
  const recentAnswers = await prisma.answerLog.findMany({
    where: { userId },
    orderBy: { answeredAt: 'desc' },
    take: windowSize,
    select: { isCorrect: true },
  });

  if (recentAnswers.length === 0) return 0;

  const correctCount = recentAnswers.filter((a) => a.isCorrect).length;
  return correctCount / recentAnswers.length;
}

export async function getDifficultyHistogram(userId: string): Promise<Record<number, number>> {
  const answers = await prisma.answerLog.findMany({
    where: { userId },
    select: { difficulty: true },
  });

  const histogram: Record<number, number> = {};
  for (let i = 0; i <= 10; i++) {
    histogram[i] = 0;
  }

  answers.forEach((a) => {
    histogram[a.difficulty] = (histogram[a.difficulty] || 0) + 1;
  });

  return histogram;
}

export async function getUser(userId: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}
