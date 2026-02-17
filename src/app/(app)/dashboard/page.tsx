'use client';

import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useMetrics } from '@/lib/hooks/useMetrics';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { metrics, isLoading: metricsLoading } = useMetrics();
  const { leaderboard: scoreBoard, isLoading: scoreLoading } = useLeaderboard('score', 50);
  const { leaderboard: streakBoard, isLoading: streakLoading } = useLeaderboard('streak', 50);

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

  const scoreRank = scoreBoard?.currentUserRank;
  const streakRank = streakBoard?.currentUserRank;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <AppHeader />
      <PageContainer className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        </div>

        {metricsLoading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Current Difficulty</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{metrics.currentDifficulty}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Score</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{metrics.totalScore}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Accuracy</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  {Math.round(metrics.accuracy * 100)}%
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Questions Answered</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{metrics.totalQuestions}</CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Streak Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Current streak: <span className="font-semibold">{metrics.streak}</span></p>
                  <p>Best streak: <span className="font-semibold">{metrics.maxStreak}</span></p>
                  <p>
                    Recent accuracy (last 10):{' '}
                    <span className="font-semibold">{Math.round(metrics.recentPerformance.last10Accuracy * 100)}%</span>
                  </p>
                  <p>
                    Avg difficulty (last 10):{' '}
                    <span className="font-semibold">{metrics.recentPerformance.last10AvgDifficulty}</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard Standing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    Score rank:{' '}
                    <span className="font-semibold">{scoreLoading ? 'Loading...' : scoreRank ? `#${scoreRank}` : 'Unranked'}</span>
                  </p>
                  <p>
                    Streak rank:{' '}
                    <span className="font-semibold">
                      {streakLoading ? 'Loading...' : streakRank ? `#${streakRank}` : 'Unranked'}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Unable to load performance data. Please try again.
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </main>
  );
}
