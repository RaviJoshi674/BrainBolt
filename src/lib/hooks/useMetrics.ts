'use client';

import useSWR from 'swr';
import { apiClient } from '../api/client';
import { MetricsResponse } from '../types';

export function useMetrics() {
  const { data, error, mutate } = useSWR<MetricsResponse>('/quiz/metrics', () => apiClient.getMetrics(), {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  });

  return {
    metrics: data,
    isLoading: !data && !error,
    error,
    refetch: mutate,
  };
}
