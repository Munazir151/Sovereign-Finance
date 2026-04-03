'use client';

import Link from 'next/link';
import { Plus, BarChart3, CreditCard, Download } from 'lucide-react';
import { useDashboard } from '@/lib/DashboardContext';
import { exportTransactionsToCSV } from '@/lib/utils';
import { motion } from 'framer-motion';

const actions = [
  { id: 'add', icon: <Plus size={20} />, label: 'Add Transaction', color: '#006c49', bg: 'rgba(110,248,187,0.15)', href: '/transactions' },
  { id: 'analytics', icon: <BarChart3 size={20} />, label: 'View Analytics', color: '#091426', bg: 'rgba(188,199,222,0.2)', href: '/insights' },
  { id: 'accounts', icon: <CreditCard size={20} />, label: 'Accounts', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', href: '#' },
  { id: 'export', icon: <Download size={20} />, label: 'Export Data', color: '#d97706', bg: 'rgba(217,119,6,0.1)', action: 'export' },
];

export default function QuickActions() {
  const { transactions, showToast } = useDashboard();

  const handleAction = (a: any) => {
    if (a.action === 'export') {
      exportTransactionsToCSV(transactions);
      showToast('Successfully exported data to CSV', 'success');
    }
  };

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Quick Actions</div>
      </div>
      <div className="quick-actions">
        {actions.map((a, i) => {
          const btn = (
            <motion.button 
              key={a.id}
              className="quick-action-btn" 
              style={{ width: '100%', height: '100%' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction(a)}
            >
              <div className="quick-action-icon" style={{ background: a.bg, color: a.color }}>
                {a.icon}
              </div>
              <span className="quick-action-label">{a.label}</span>
            </motion.button>
          );
          
          return a.href ? (
            <Link key={a.id} href={a.href} style={{ textDecoration: 'none' }}>
              {btn}
            </Link>
          ) : btn;
        })}
      </div>
    </div>
  );
}
