'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Lock, Mail } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const supabase = createClientComponentClient();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
          // Check if user is an admin using environment variable
          const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'yortozne@gmail.com';
          const adminEmails = adminEmailsString.split(',').map(email => email.trim());
          
          if (adminEmails.includes(session.user.email)) {
            setIsAuthenticated(true);
          } else {
            setError('Access denied. Admin privileges required.');
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user?.email) {
        // Check if user is an admin using environment variable
        const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'yortozne@gmail.com';
        const adminEmails = adminEmailsString.split(',').map(email => email.trim());
        
        if (adminEmails.includes(data.user.email)) {
          setIsAuthenticated(true);
        } else {
          setError('Access denied. Admin privileges required.');
          await supabase.auth.signOut();
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      // Call server-side logout route to properly clear cookies
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      console.log('Logout successful');
      
      // Force a hard reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, force redirect and clear
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-accent" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Login</h1>
          <p className="text-zinc-400 text-center mb-6">Sign in with your admin account</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-colors"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-xs text-zinc-500 text-center mt-6">
            Protected area. Authorized personnel only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
        >
          Logout
        </button>
      </div>
      {children}
    </>
  );
}
