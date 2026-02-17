'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, LayoutDashboard, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer } from './PageContainer';

const navItems = [
  { href: '/', label: 'Home', icon: Brain },
  { href: '/quiz', label: 'Quiz', icon: Zap },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <PageContainer className="py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            BrainBolt
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}
