import { SCORING_CONFIG } from './config';

export function calculateScore(
  difficulty: number,
  streak: number,
  recentAccuracy: number
): number {
  const { BASE_SCORE, DIFFICULTY_MULTIPLIER, MAX_STREAK_MULTIPLIER, ACCURACY_WEIGHT } =
    SCORING_CONFIG;

  const difficultyScore = BASE_SCORE * Math.pow(DIFFICULTY_MULTIPLIER, difficulty - 1);

  const streakMultiplier = Math.min(1 + streak * 0.1, MAX_STREAK_MULTIPLIER);

  const accuracyBonus = 1 + recentAccuracy * ACCURACY_WEIGHT;

  const finalScore = Math.round(difficultyScore * streakMultiplier * accuracyBonus);

  return finalScore;
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return correct / total;
}
