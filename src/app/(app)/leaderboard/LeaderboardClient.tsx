'use client';

import { useState } from 'react';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';

export function LeaderboardClient() {
  const [activeTab, setActiveTab] = useState<'score' | 'streak'>('score');
  const { leaderboard: scoreBoard, isLoading: scoreLoading } = useLeaderboard('score', 50);
  const { leaderboard: streakBoard, isLoading: streakLoading } = useLeaderboard('streak', 50);

  const isLoading = activeTab === 'score' ? scoreLoading : streakLoading;
  const data = activeTab === 'score' ? scoreBoard : streakBoard;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'score' ? 'default' : 'outline'}
          onClick={() => setActiveTab('score')}
        >
          Top Scores
        </Button>
        <Button
          variant={activeTab === 'streak' ? 'default' : 'outline'}
          onClick={() => setActiveTab('streak')}
        >
          Top Streaks
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : data ? (
        <LeaderboardTable
          entries={data.leaderboard}
          currentUserRank={data.currentUserRank}
          type={activeTab}
          title={activeTab === 'score' ? 'Top Scores' : 'Top Streaks'}
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No leaderboard data available
          </CardContent>
        </Card>
      )}
    </div>
  );
}
