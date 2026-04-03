'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, LineChart, HelpCircle } from 'lucide-react';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Overview', href: '/dashboard' },
  { icon: <ReceiptText size={20} />, label: 'Transactions', href: '/transactions' },
  { icon: <LineChart size={20} />, label: 'Insights', href: '/insights' },
];

const bottomItems = [
  { icon: <HelpCircle size={20} />, label: 'Help Center', href: '#' },
];

import { useDashboard } from '@/lib/DashboardContext';
import { useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen, isSidebarCollapsed } = useDashboard();

  useEffect(() => {
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isSidebarCollapsed]);

  return (
    <>
      <nav className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">Sovereign Finance</span>
          <span className="sidebar-brand-sub">Admin Terminal</span>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`sidebar-nav-item ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <hr className="sidebar-divider" />

          {bottomItems.map((item) => (
            <a  key={item.href} href={item.href} className="sidebar-nav-item" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">CA</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Capital Alpha</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
        </div>
      </nav>
      
      {isMobileMenuOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 90 }} 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
