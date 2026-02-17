'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { apiClient } from '../api/client';
import { NextQuestionResponse, SubmitAnswerResponse } from '../types';

export function useQuiz() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResponse, setLastResponse] = useState<SubmitAnswerResponse | null>(null);

  const {
    data: question,
    error,
    mutate,
  } = useSWR<NextQuestionResponse>('/quiz/next', () => apiClient.getNextQuestion(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const submitAnswer = async (answer: string) => {
    if (!question || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const idempotencyKey = `${question.questionId}:${Date.now()}:${Math.random()}`;
      
      const response = await apiClient.submitAnswer({
        sessionId: question.sessionId,
        questionId: question.questionId,
        answer,
        stateVersion: question.stateVersion,
        answerIdempotencyKey: idempotencyKey,
      });

      setLastResponse(response);
      
      await mutate();

      return response;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    question,
    isLoading: !error && !question,
    error,
    submitAnswer,
    isSubmitting,
    lastResponse,
    refetch: mutate,
  };
}
