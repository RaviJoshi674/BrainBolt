import { getUserState, getRecentAccuracy, getDifficultyHistogram } from './user.service';
import { prisma } from '../db/client';
import { MetricsResponse } from '../types';
import { calculateAccuracy } from '../adaptive/scoring';

export async function getUserMetrics(userId: string): Promise<MetricsResponse> {
  const state = await getUserState(userId);

  const recentAnswers = await prisma.answerLog.findMany({
    where: { userId },
    orderBy: { answeredAt: 'desc' },
    take: 10,
    select: {
      isCorrect: true,
      difficulty: true,
    },
  });

  const last10Accuracy = await getRecentAccuracy(userId, 10);
  const last10AvgDifficulty =
    recentAnswers.length > 0
      ? recentAnswers.reduce((sum, a) => sum + a.difficulty, 0) / recentAnswers.length
      : 0;

  const difficultyHistogram = await getDifficultyHistogram(userId);

  const accuracy = calculateAccuracy(state.correctAnswers, state.totalQuestions);

  return {
    currentDifficulty: state.currentDifficulty,
    streak: state.streak,
    maxStreak: state.maxStreak,
    totalScore: Number(state.totalScore),
    accuracy,
    totalQuestions: state.totalQuestions,
    difficultyHistogram,
    recentPerformance: {
      last10Accuracy,
      last10AvgDifficulty: Math.round(last10AvgDifficulty * 10) / 10,
    },
  };
}
