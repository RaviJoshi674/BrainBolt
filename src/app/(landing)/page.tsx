import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Brain, Zap, Trophy, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <PageContainer className="py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            BrainBolt
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The adaptive infinite quiz platform that evolves with your performance. Challenge yourself
            and climb the leaderboards!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/auth/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Adaptive Difficulty</CardTitle>
              <CardDescription>
                Questions automatically adjust to your skill level using advanced algorithms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Streak System</CardTitle>
              <CardDescription>
                Build streaks for bonus points and watch your multiplier grow
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <CardTitle>Live Leaderboards</CardTitle>
              <CardDescription>
                Compete globally with real-time score and streak rankings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle>Infinite Questions</CardTitle>
              <CardDescription>
                Never run out of challenges with our extensive question database
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/leaderboard">
            <Button variant="outline" size="lg">
              View Leaderboards
            </Button>
          </Link>
        </div>
      </PageContainer>
    </main>
  );
}
