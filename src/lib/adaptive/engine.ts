import { ADAPTIVE_CONFIG } from './config';

interface DifficultyResult {
  difficulty: number;
  momentum: number;
}

export class AdaptiveDifficultyEngine {
  calculateNextDifficulty(
    currentDifficulty: number,
    isCorrect: boolean,
    currentStreak: number,
    momentum: number
  ): DifficultyResult {
    const {
      MIN_DIFFICULTY,
      MAX_DIFFICULTY,
      MOMENTUM_DECAY,
      HYSTERESIS_THRESHOLD,
      MIN_STREAK_FOR_INCREASE,
    } = ADAPTIVE_CONFIG;

    let newMomentum = isCorrect
      ? Math.min(momentum + 1, 5)
      : Math.max(momentum - 1.5, -5);

    let newDifficulty = currentDifficulty;

    if (isCorrect) {
      if (currentStreak >= MIN_STREAK_FOR_INCREASE && newMomentum >= HYSTERESIS_THRESHOLD) {
        newDifficulty = Math.min(currentDifficulty + 1, MAX_DIFFICULTY);
        newMomentum = 0;
      } else {
        newMomentum *= MOMENTUM_DECAY;
      }
    } else {
      newDifficulty = MIN_DIFFICULTY;
      newMomentum = 0;
    }

    return { difficulty: newDifficulty, momentum: newMomentum };
  }

  shouldResetStreak(lastAnswerAt: Date | null): boolean {
    if (!lastAnswerAt) return false;

    const timeSinceLastAnswer = Date.now() - lastAnswerAt.getTime();
    return timeSinceLastAnswer > ADAPTIVE_CONFIG.INACTIVITY_THRESHOLD_MS;
  }
}

export const adaptiveEngine = new AdaptiveDifficultyEngine();
