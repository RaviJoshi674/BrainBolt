export const CACHE_KEYS = {
  USER_STATE: (userId: string) => `user:state:${userId}`,
  QUESTION_POOL: (difficulty: number) => `questions:diff:${difficulty}`,
  LEADERBOARD_SCORE: 'leaderboard:score:top100',
  LEADERBOARD_STREAK: 'leaderboard:streak:top100',
  USER_RANK_SCORE: (userId: string) => `user:rank:score:${userId}`,
  USER_RANK_STREAK: (userId: string) => `user:rank:streak:${userId}`,
  RECENT_ANSWERS: (userId: string) => `user:recent:${userId}`,
};

export const CACHE_TTL = {
  USER_STATE: 300,
  QUESTION_POOL: 3600,
  LEADERBOARD: 10,
  USER_RANK: 30,
  RECENT_ANSWERS: 300,
};
