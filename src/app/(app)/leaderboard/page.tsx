import { Suspense } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';
import { LeaderboardClient } from './LeaderboardClient';

export const metadata = {
  title: 'Leaderboards - BrainBolt',
  description: 'View top players by score and streak',
};

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <AppHeader />
      <PageContainer className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Leaderboards</h1>
          <Link href="/quiz">
            <Button>Start Quiz</Button>
          </Link>
        </div>

        <Suspense
          fallback={
            <Card>
              <CardContent className="p-8 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          }
        >
          <LeaderboardClient />
        </Suspense>
      </PageContainer>
    </main>
  );
}
