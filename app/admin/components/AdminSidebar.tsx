'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Upload, 
  Mail,
  BookOpen,
  Sparkles,
  LogOut,
  User
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'applicants', label: 'Applicants', icon: Users },
  { id: 'subscribers', label: 'Subscribers', icon: Mail },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'uploads', label: 'Upload', icon: Upload }
];

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    
    if (!confirm('Are you sure you want to log out?')) return;

    setLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        alert('Logout failed');
        setLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
      setLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900/30 min-h-screen sticky top-0 flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Z21 Admin</h1>
            <p className="text-xs text-zinc-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-800/30 rounded-xl">
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-zinc-500">Logged in</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{loggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
