'use client';

import * as React from 'react';
import { Bell, Search, Sun, Moon, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/utils';
import type { Notification } from '@/types';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data.notifications);
        setUnreadCount(json.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  async function markAllAsRead() {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      if (res.ok) {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/candidates?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <header className="flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 shadow-sm transition-colors duration-200 sticky top-0 z-30">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-80 max-w-lg hidden md:block">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search candidates by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2 rounded-xl text-sm placeholder-slate-400 text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </form>
      <div className="md:hidden" /> {/* spacing placeholder */}

      {/* Nav Controls: Theme, Notifications, Avatar */}
      <div className="flex items-center gap-5">
        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Notifications Dropdown */}
        <Dropdown
          trigger={
            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          }
          className="w-80"
        >
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="text-xs text-blue-600 hover:text-blue-500 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Mark read
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <DropdownItem
                  key={notif.id}
                  onClick={() => notif.link && router.push(notif.link)}
                  className="px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 flex flex-col items-start gap-1"
                >
                  <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {notif.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </DropdownItem>
              ))
            )}
          </div>
        </Dropdown>

        {/* User Profile Info & Dropdown */}
        {user && (
          <div className="flex items-center gap-3">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-none">
                {user.title || 'Recruiter'}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}