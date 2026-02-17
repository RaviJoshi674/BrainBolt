'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { NextQuestionResponse } from '@/lib/types';

interface QuestionCardProps {
  question: NextQuestionResponse;
  onAnswer: (answer: string) => void;
  isSubmitting: boolean;
  selectedAnswer: string | null;
}

export function QuestionCard({ question, onAnswer, isSubmitting, selectedAnswer }: QuestionCardProps) {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-500';
    if (difficulty <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-sm">
            Question
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            <div className="flex items-center gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-4 rounded-sm ${
                    i < question.difficulty ? getDifficultyColor(question.difficulty) : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{question.difficulty}/10</span>
          </div>
        </div>
        <CardTitle className="text-2xl leading-relaxed">{question.prompt}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {question.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onAnswer(choice)}
              disabled={isSubmitting}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-primary hover:bg-accent ${
                selectedAnswer === choice
                  ? 'border-primary bg-accent'
                  : 'border-border bg-card'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-base">{choice}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
