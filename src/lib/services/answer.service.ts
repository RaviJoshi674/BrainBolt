import { prisma } from '../db/client';
import { getUserState, getRecentAccuracy } from './user.service';
import { getQuestionWithAnswer } from './question.service';
import { invalidateUserCache, updateLeaderboardCache } from '../cache/strategies';
import { adaptiveEngine } from '../adaptive/engine';
import { calculateScore } from '../adaptive/scoring';
import { verifyAnswer } from '../utils/hash';
import { ConflictError, NotFoundError } from '../utils/errors';
import { SubmitAnswerRequest, SubmitAnswerResponse } from '../types';

export async function submitAnswer(
  req: SubmitAnswerRequest
): Promise<SubmitAnswerResponse> {
  const existing = await prisma.answerLog.findUnique({
    where: { idempotencyKey: req.answerIdempotencyKey },
  });

  if (existing) {
    return buildResponseFromLog(existing);
  }

  const userState = await getUserState(req.userId);
  const currentStateVersion = Number(userState.stateVersion);

  if (currentStateVersion !== req.stateVersion) {
    throw new ConflictError('State version mismatch. Please refresh and try again.');
  }

  const question = await getQuestionWithAnswer(req.questionId);
  if (!question) {
    throw new NotFoundError('Question not found');
  }

  const isCorrect = verifyAnswer(question.correctAnswerHash, req.answer);

  const recentAccuracy = await getRecentAccuracy(req.userId, 10);

  const scoreDelta = isCorrect
    ? calculateScore(userState.currentDifficulty, userState.streak, recentAccuracy)
    : 0;

  const newStreak = isCorrect ? userState.streak + 1 : 0;

  const { difficulty: newDifficulty, momentum: newMomentum } =
    adaptiveEngine.calculateNextDifficulty(
      userState.currentDifficulty,
      isCorrect,
      newStreak,
      Number(userState.momentum)
    );

  const result = await prisma.$transaction(async (tx) => {
    await tx.answerLog.create({
      data: {
        userId: req.userId,
        questionId: req.questionId,
        sessionId: req.sessionId,
        difficulty: userState.currentDifficulty,
        answerHash: require('../utils/hash').hashAnswer(req.answer),
        isCorrect,
        scoreDelta,
        streakAtAnswer: userState.streak,
        momentumAtAnswer: userState.momentum,
        idempotencyKey: req.answerIdempotencyKey,
      },
    });

    const updatedState = await tx.userState.update({
      where: {
        userId: req.userId,
        stateVersion: currentStateVersion,
      },
      data: {
        currentDifficulty: newDifficulty,
        momentum: newMomentum,
        streak: newStreak,
        maxStreak: Math.max(userState.maxStreak, newStreak),
        totalScore: userState.totalScore + BigInt(scoreDelta),
        totalQuestions: userState.totalQuestions + 1,
        correctAnswers: userState.correctAnswers + (isCorrect ? 1 : 0),
        lastQuestionId: req.questionId,
        lastAnswerAt: new Date(),
        stateVersion: currentStateVersion + 1,
      },
    });

    const user = await tx.user.findUnique({
      where: { id: req.userId },
      select: { username: true },
    });

    await tx.leaderboardScore.upsert({
      where: { userId: req.userId },
      create: {
        userId: req.userId,
        username: user!.username,
        totalScore: updatedState.totalScore,
      },
      update: {
        totalScore: updatedState.totalScore,
        updatedAt: new Date(),
      },
    });

    await tx.leaderboardStreak.upsert({
      where: { userId: req.userId },
      create: {
        userId: req.userId,
        username: user!.username,
        maxStreak: updatedState.maxStreak,
        currentStreak: updatedState.streak,
      },
      update: {
        maxStreak: updatedState.maxStreak,
        currentStreak: updatedState.streak,
        updatedAt: new Date(),
      },
    });

    return {
      updatedState,
      username: user!.username,
    };
  });

  await invalidateUserCache(req.userId);

  await updateLeaderboardCache(
    req.userId,
    result.username,
    Number(result.updatedState.totalScore),
    result.updatedState.maxStreak
  );

  const [scoreRank, streakRank] = await Promise.all([
    getLeaderboardRank(req.userId, 'score'),
    getLeaderboardRank(req.userId, 'streak'),
  ]);

  return {
    correct: isCorrect,
    newDifficulty,
    newStreak,
    scoreDelta,
    totalScore: Number(result.updatedState.totalScore),
    stateVersion: Number(result.updatedState.stateVersion),
    leaderboardRankScore: scoreRank,
    leaderboardRankStreak: streakRank,
  };
}

async function buildResponseFromLog(log: any): Promise<SubmitAnswerResponse> {
  const userState = await prisma.userState.findUnique({
    where: { userId: log.userId },
  });

  const [scoreRank, streakRank] = await Promise.all([
    getLeaderboardRank(log.userId, 'score'),
    getLeaderboardRank(log.userId, 'streak'),
  ]);

  return {
    correct: log.isCorrect,
    newDifficulty: userState!.currentDifficulty,
    newStreak: userState!.streak,
    scoreDelta: log.scoreDelta,
    totalScore: Number(userState!.totalScore),
    stateVersion: Number(userState!.stateVersion),
    leaderboardRankScore: scoreRank,
    leaderboardRankStreak: streakRank,
  };
}

async function getLeaderboardRank(userId: string, type: 'score' | 'streak'): Promise<number> {
  if (type === 'score') {
    const rank = await prisma.$queryRaw<Array<{ rank: bigint }>>`
      SELECT COUNT(*) + 1 as rank
      FROM leaderboard_score
      WHERE total_score > (
        SELECT total_score FROM leaderboard_score WHERE user_id = ${userId}
      )
    `;
    return Number(rank[0]?.rank || 0);
  } else {
    const rank = await prisma.$queryRaw<Array<{ rank: bigint }>>`
      SELECT COUNT(*) + 1 as rank
      FROM leaderboard_streak
      WHERE max_streak > (
        SELECT max_streak FROM leaderboard_streak WHERE user_id = ${userId}
      )
      OR (max_streak = (SELECT max_streak FROM leaderboard_streak WHERE user_id = ${userId})
          AND current_streak > (SELECT current_streak FROM leaderboard_streak WHERE user_id = ${userId}))
    `;
    return Number(rank[0]?.rank || 0);
  }
}
