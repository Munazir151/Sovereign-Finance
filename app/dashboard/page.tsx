'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, TriangleAlert, Search } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import KpiGrid from '@/components/dashboard/KpiGrid';
import BalanceTrendChart from '@/components/dashboard/BalanceTrendChart';
import SpendingBreakdown from '@/components/dashboard/SpendingBreakdown';
import QuickActions from '@/components/dashboard/QuickActions';
import SmartInsight from '@/components/dashboard/SmartInsight';
import { chartData, kpiData, spendingCategories } from '@/lib/data';
import { useDashboard } from '@/lib/DashboardContext';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);

export default function DashboardPage() {
  const { transactions, isAdmin, setRole } = useDashboard();
  const [range, setRange] = useState<'30D' | '90D' | '1Y'>('30D');

  const highestExpense = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce(
      (max, txn) => {
        const amount = Math.abs(txn.amount);
        if (amount > max.amount) {
          return { amount, category: txn.category };
        }
        return max;
      },
      { amount: 0, category: 'N/A' }
    );

  const visibleChartData = useMemo(() => {
    if (range === '30D') return chartData.slice(-3);
    if (range === '90D') return chartData.slice(-4);
    return chartData;
  }, [range]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Header
        title="Dashboard"
        subtitle="Your financial command center for the latest month"
        actions={
          <div className="flex items-center gap-2">
            <div className="role-toggle">
              <button
                className={`role-toggle-btn ${isAdmin ? 'active' : ''}`}
                onClick={() => setRole('admin')}
                id="role-admin-btn"
              >
                Admin
              </button>
              <button
                className={`role-toggle-btn ${!isAdmin ? 'active' : ''}`}
                onClick={() => setRole('viewer')}
                id="role-viewer-btn"
              >
                Viewer
              </button>
            </div>
            <Link className="btn btn-primary" href="/transactions" id="open-transactions-btn">
              Add Transaction
            </Link>
          </div>
        }
      />

      <div className="page-content">
        <div className="dashboard-toolbar-panel">
          <div className="dashboard-toolbar-search">
            <Search size={16} />
            <input
              aria-label="Search dashboard"
              placeholder="Search transactions, insights, categories..."
              readOnly
              value=""
            />
          </div>
          <div className="dashboard-range-switch" role="tablist" aria-label="Dashboard range selector">
            {(['30D', '90D', '1Y'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={`dashboard-range-chip ${range === item ? 'active' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <KpiGrid data={kpiData} />

        <div className="dashboard-grid">
          <BalanceTrendChart data={visibleChartData} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="highest-spend-card" style={{ paddingBottom: '18px' }}>
              <div className="insight-label">Highest Spending</div>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                {highestExpense.category}
              </p>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.03em' }}>
                {formatMoney(highestExpense.amount)}
              </p>
              <p className="insight-quote" style={{ marginTop: '14px' }}>Due in 4 days</p>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Monthly Performance</div>
                  <div className="card-subtitle">Signals compared to last month</div>
                </div>
              </div>
              <div className="metric-row">
                <span className="metric-icon"><TrendingUp size={18} /></span>
                <span className="metric-label">Income Growth</span>
                <span className="metric-value positive">+15%</span>
              </div>
              <div className="metric-row">
                <span className="metric-icon"><TrendingDown size={18} /></span>
                <span className="metric-label">Expense Ratio</span>
                <span className="metric-value positive">-8%</span>
              </div>
              <div className="metric-row">
                <span className="metric-icon"><TriangleAlert size={18} /></span>
                <span className="metric-label">Risk Alerts</span>
                <span className="metric-value negative">1 active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-bottom-grid">
          <SpendingBreakdown categories={spendingCategories} />
          <QuickActions />
          <div style={{ display: 'grid', gap: '20px' }}>
            <SmartInsight />
            <div className="market-momentum-card">
              <div className="market-momentum-overlay" />
              <p className="market-momentum-text">Compounding works when your decisions are consistent.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
