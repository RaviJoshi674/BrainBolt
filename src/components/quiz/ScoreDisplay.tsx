'use client';

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Trophy, Zap, Target } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  maxStreak: number;
  difficulty: number;
}

export function ScoreDisplay({ score, streak, maxStreak, difficulty }: ScoreDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-xl font-bold">{formatNumber(score)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Zap className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="text-xl font-bold">{streak}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best Streak</p>
              <p className="text-xl font-bold">{maxStreak}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Target className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Difficulty</p>
              <p className="text-xl font-bold">{difficulty}/10</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
