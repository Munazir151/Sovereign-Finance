'use client';

import Header from '@/components/layout/Header';
import { IncomeExpenseBarChart, BalanceLineChart, SpendingDonutChart } from '@/components/insights/InsightCharts';
import { chartData, spendingCategories, kpiData } from '@/lib/data';

import { TrendingUp, DollarSign, PiggyBank, Trophy, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const metrics = [
  { icon: <TrendingUp size={20} />, label: 'Income Growth', value: '+15.2%', trend: 'positive' },
  { icon: <DollarSign size={20} />, label: 'Expense Ratio Optimization', value: '-8.0%', trend: 'positive' },
  { icon: <PiggyBank size={20} />, label: 'Net Savings Rate', value: '50.0%', trend: 'positive' },
  { icon: <Trophy size={20} />, label: 'Portfolio Growth (YTD)', value: '+22.4%', trend: 'positive' },
  { icon: <AlertTriangle size={20} />, label: 'Highest Category (Housing)', value: '36% of spend', trend: 'negative' },
];

const highlights = [
  { label: 'Best Month', value: 'December', sub: '$5,200 income' },
  { label: 'Lowest Expenses', value: 'January', sub: '$2,200 outflow' },
  { label: 'Savings Goal Progress', value: '87%', sub: 'Q2 target: $12,000' },
  { label: 'Active Accounts', value: '4', sub: 'All healthy' },
];

export default function InsightsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Header
        title="Financial Insights"
        subtitle="Deep-dive analytics to architect your financial future."
      />
      <div className="page-content">

        {/* Highlights row */}
        <div className="insights-highlight-grid" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
          {highlights.map(h => (
            <div key={h.label} className="kpi-card animate-in" style={{ opacity: 0 }}>
              <div className="kpi-label">{h.label}</div>
              <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{h.value}</div>
              <div className="card-subtitle" style={{ marginTop: 6 }}>{h.sub}</div>
            </div>
          ))}
        </div>

        {/* Main charts */}
        <div className="insights-grid">
          <IncomeExpenseBarChart data={chartData} />
          <SpendingDonutChart categories={spendingCategories} />
        </div>

        {/* Second row */}
        <div className="insights-bottom-grid">
          <BalanceLineChart data={chartData} />

          {/* Performance Metrics */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Monthly Performance</div>
                <div className="card-subtitle">Key financial indicators</div>
              </div>
            </div>
            <div>
              {metrics.map(m => (
                <div key={m.label} className="metric-row">
                  <span className="metric-icon">{m.icon}</span>
                  <span className="metric-label">{m.label}</span>
                  <span className={`metric-value ${m.trend}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart summary */}
        <div className="insight-card" style={{ marginTop: 24 }}>
          <div className="insight-label">✦ AI Financial Summary</div>
          <p className="insight-text">
            Your portfolio is performing <strong style={{ color: '#4edea3' }}>excellently</strong> this quarter. Net savings are up{' '}
            <strong style={{ color: '#4edea3' }}>12.3%</strong> compared to last month thanks to a significant reduction in transport and dining expenditures.
            Housing remains your highest expenditure at 36% — consider negotiating your rent or exploring refinancing options to unlock further savings capacity.
          </p>
          <p className="insight-quote">
            "The goal isn't more money. The goal is living life on your own terms." — Chris Brogan
          </p>
        </div>
      </div>
    </motion.div>
  );
}
