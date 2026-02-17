'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/types';
import { formatNumber, formatRelativeTime } from '@/lib/utils';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  type: 'score' | 'streak';
  title: string;
}

export function LeaderboardTable({ entries, currentUserRank, type, title }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {currentUserRank && (
            <Badge variant="outline">Your Rank: #{currentUserRank}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                entry.rank <= 3 ? 'bg-accent/50' : 'hover:bg-accent/30'
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                {getRankIcon(entry.rank) || (
                  <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{entry.username}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(entry.updatedAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{formatNumber(entry.score)}</p>
                <p className="text-xs text-muted-foreground">
                  {type === 'score' ? 'points' : 'streak'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
