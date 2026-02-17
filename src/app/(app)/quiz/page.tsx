'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useQuiz } from '@/lib/hooks/useQuiz';
import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ScoreDisplay } from '@/components/quiz/ScoreDisplay';
import { ResultFeedback } from '@/components/quiz/ResultFeedback';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { question, isLoading, submitAnswer, isSubmitting, lastResponse } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    try {
      await submitAnswer(answer);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <AppHeader />
      <PageContainer className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quiz Challenge</h1>
        </div>

        {question && (
          <>
            <ScoreDisplay
              score={question.currentScore}
              streak={question.currentStreak}
              maxStreak={question.maxStreak}
              difficulty={question.difficulty}
            />

            {showResult && lastResponse ? (
              <ResultFeedback result={lastResponse} onContinue={handleContinue} />
            ) : (
              <QuestionCard
                question={question}
                onAnswer={handleAnswer}
                isSubmitting={isSubmitting}
                selectedAnswer={selectedAnswer}
              />
            )}
          </>
        )}

        {!question && !isLoading && (
          <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No questions available. Please try again later.</p>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </main>
  );
}
