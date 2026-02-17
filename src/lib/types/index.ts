export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Question {
  id: string;
  difficulty: number;
  prompt: string;
  choices: string[];
  tags: string[];
}

export interface UserState {
  userId: string;
  currentDifficulty: number;
  momentum: number;
  streak: number;
  maxStreak: number;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  lastQuestionId: string | null;
  lastAnswerAt: string | null;
  stateVersion: number;
  sessionId: string | null;
}

export interface NextQuestionResponse {
  questionId: string;
  difficulty: number;
  prompt: string;
  choices: string[];
  sessionId: string;
  stateVersion: number;
  currentScore: number;
  currentStreak: number;
  maxStreak: number;
  momentum: number;
}

export interface SubmitAnswerRequest {
  userId: string;
  sessionId: string;
  questionId: string;
  answer: string;
  stateVersion: number;
  answerIdempotencyKey: string;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  newDifficulty: number;
  newStreak: number;
  scoreDelta: number;
  totalScore: number;
  stateVersion: number;
  leaderboardRankScore: number;
  leaderboardRankStreak: number;
  explanation?: string;
}

export interface MetricsResponse {
  currentDifficulty: number;
  streak: number;
  maxStreak: number;
  totalScore: number;
  accuracy: number;
  totalQuestions: number;
  difficultyHistogram: Record<number, number>;
  recentPerformance: {
    last10Accuracy: number;
    last10AvgDifficulty: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  updatedAt: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  currentUserRank?: number;
  total: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
