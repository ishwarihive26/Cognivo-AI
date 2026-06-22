'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({
  children,
}: ChatLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');

        // Redirect if no token
        if (!token) {
          router.replace('/login');
          return;
        }

        // Parse user safely
        if (userData) {
          const parsedUser: User = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Authentication error:', error);

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    router.replace('/login');
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <div className="text-3xl animate-spin">
          ⏳
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            🤖 Cognivo AI
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user.name}
              </p>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}