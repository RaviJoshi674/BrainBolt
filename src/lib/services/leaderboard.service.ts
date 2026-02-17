import { prisma } from '../db/client';
import { LeaderboardEntry, LeaderboardResponse } from '../types';

export async function getScoreLeaderboard(
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string
): Promise<LeaderboardResponse> {
  const leaderboard = await prisma.leaderboardScore.findMany({
    orderBy: [{ totalScore: 'desc' }, { updatedAt: 'asc' }],
    take: limit,
    skip: offset,
    select: {
      userId: true,
      username: true,
      totalScore: true,
      updatedAt: true,
    },
  });

  const total = await prisma.leaderboardScore.count();

  const entries: LeaderboardEntry[] = leaderboard.map((entry, index) => ({
    rank: offset + index + 1,
    userId: entry.userId,
    username: entry.username,
    score: Number(entry.totalScore),
    updatedAt: entry.updatedAt.toISOString(),
  }));

  let currentUserRank: number | undefined;
  if (currentUserId) {
    const rank = await prisma.$queryRaw<Array<{ rank: bigint }>>`
      SELECT COUNT(*) + 1 as rank
      FROM leaderboard_score
      WHERE total_score > (
        SELECT total_score FROM leaderboard_score WHERE user_id = ${currentUserId}
      )
    `;
    currentUserRank = Number(rank[0]?.rank || 0);
  }

  return {
    leaderboard: entries,
    currentUserRank,
    total,
  };
}

export async function getStreakLeaderboard(
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string
): Promise<LeaderboardResponse> {
  const leaderboard = await prisma.leaderboardStreak.findMany({
    orderBy: [{ maxStreak: 'desc' }, { currentStreak: 'desc' }, { updatedAt: 'asc' }],
    take: limit,
    skip: offset,
    select: {
      userId: true,
      username: true,
      maxStreak: true,
      updatedAt: true,
    },
  });

  const total = await prisma.leaderboardStreak.count();

  const entries: LeaderboardEntry[] = leaderboard.map((entry, index) => ({
    rank: offset + index + 1,
    userId: entry.userId,
    username: entry.username,
    score: entry.maxStreak,
    updatedAt: entry.updatedAt.toISOString(),
  }));

  let currentUserRank: number | undefined;
  if (currentUserId) {
    const rank = await prisma.$queryRaw<Array<{ rank: bigint }>>`
      SELECT COUNT(*) + 1 as rank
      FROM leaderboard_streak
      WHERE max_streak > (
        SELECT max_streak FROM leaderboard_streak WHERE user_id = ${currentUserId}
      )
      OR (max_streak = (SELECT max_streak FROM leaderboard_streak WHERE user_id = ${currentUserId})
          AND current_streak > (SELECT current_streak FROM leaderboard_streak WHERE user_id = ${currentUserId}))
    `;
    currentUserRank = Number(rank[0]?.rank || 0);
  }

  return {
    leaderboard: entries,
    currentUserRank,
    total,
  };
}
