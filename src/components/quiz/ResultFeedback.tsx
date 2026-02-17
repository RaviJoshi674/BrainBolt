'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SubmitAnswerResponse } from '@/lib/types';

interface ResultFeedbackProps {
  result: SubmitAnswerResponse;
  onContinue: () => void;
}

export function ResultFeedback({ result, onContinue }: ResultFeedbackProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      onContinue();
    }, 2500);

    return () => clearTimeout(timer);
  }, [result, onContinue]);

  if (!show) return null;

  return (
    <Card
      className={`w-full max-w-3xl mx-auto animate-fade-in ${
        result.correct ? 'border-success' : 'border-destructive'
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {result.correct ? (
            <CheckCircle2 className="w-12 h-12 text-success flex-shrink-0" />
          ) : (
            <XCircle className="w-12 h-12 text-destructive flex-shrink-0" />
          )}
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${result.correct ? 'text-success' : 'text-destructive'}`}>
              {result.correct ? 'Correct!' : 'Incorrect'}
            </h3>
            <div className="mt-2 space-y-1">
              {result.correct && (
                <>
                  <p className="text-sm text-muted-foreground">
                    +{result.scoreDelta} points • Streak: {result.newStreak}
                  </p>
                  {result.newDifficulty > result.newDifficulty - 1 && (
                    <p className="text-sm font-medium text-primary">
                      Difficulty increased to {result.newDifficulty}!
                    </p>
                  )}
                </>
              )}
              {!result.correct && (
                <>
                  <p className="text-sm text-muted-foreground">Streak reset to 0</p>
                  {result.newDifficulty < result.newDifficulty + 1 && (
                    <p className="text-sm text-muted-foreground">
                      Difficulty adjusted to {result.newDifficulty}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
