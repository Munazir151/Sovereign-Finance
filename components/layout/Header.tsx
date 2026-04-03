'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/lib/hooks';

import { useDashboard } from '@/lib/DashboardContext';
import { Bell, Sun, Moon, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const [isDark, setIsDark] = useLocalStorage('sovereign-theme', false);
  const [dateStr, setDateStr] = useState('');
  const { setMobileMenuOpen, isSidebarCollapsed, setSidebarCollapsed } = useDashboard();

  useEffect(() => {
    // Attempt to sync DOM right away
    const html = document.documentElement;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');

    const now = new Date();
    setDateStr(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <div className="page-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="sidebar-toggle-btn" onClick={() => {
            if (window.innerWidth <= 768) {
              setMobileMenuOpen(true);
            } else {
              setSidebarCollapsed(!isSidebarCollapsed);
            }
          }} aria-label="Toggle Sidebar">
            <Menu size={20} />
          </button>
          <span className="top-bar-date">{dateStr}</span>
        </div>
        <div className="top-bar-actions">
          <button className="notification-btn" title="Notifications" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button
            className="dark-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <div className="page-container">
        <div className="page-header">
          <div className="page-header-row">
            <div style={{ flex: 1 }}>
              <h1 className="page-title">{title}</h1>
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header-actions">{actions}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
