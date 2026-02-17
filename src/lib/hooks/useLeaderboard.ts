'use client';

import useSWR from 'swr';
import { apiClient } from '../api/client';
import { LeaderboardResponse } from '../types';

export function useLeaderboard(type: 'score' | 'streak', limit = 50) {
  const fetcher = type === 'score' 
    ? () => apiClient.getScoreLeaderboard(limit)
    : () => apiClient.getStreakLeaderboard(limit);

  const { data, error, mutate } = useSWR<LeaderboardResponse>(
    `/leaderboard/${type}`,
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  );

  return {
    leaderboard: data,
    isLoading: !error && !data,
    error,
    refetch: mutate,
  };
}
