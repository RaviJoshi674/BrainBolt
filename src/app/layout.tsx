import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrainBolt - Adaptive Infinite Quiz Platform',
  description: 'Challenge yourself with adaptive difficulty quizzes that evolve with your performance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeToggle />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
