'use client';

import { KpiData } from '@/lib/types';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

interface KpiCardProps {
  label: string;
  value: number;
  change: number;
  isPrimary?: boolean;
  animationDelay?: number;
}

import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';

function KpiCard({ label, value, change, isPrimary, animationDelay = 0 }: KpiCardProps) {
  const isPositive = change >= 0;
  const tone =
    label.includes('Income') ? 'income' :
    label.includes('Expenses') ? 'expense' :
    label.includes('Savings') ? 'savings' : 'balance';

  return (
    <motion.div
      className={`kpi-card animate-in kpi-tone-${tone}${isPrimary ? ' primary-card' : ''}`}
      style={{ animationDelay: `${animationDelay}ms`, opacity: 0 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="kpi-label">{label}</div>
      <div className="kpi-value"><AnimatedCounter value={Math.abs(value)} /></div>
      <div className="kpi-divider" />
      <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
        <span className="kpi-change-icon">{isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}</span>
        {Math.abs(change)}%
        <span className="kpi-change-note">vs last month</span>
      </span>
    </motion.div>
  );
}

export default function KpiGrid({ data }: { data: KpiData }) {
  return (
    <div className="kpi-grid">
      <KpiCard
        label="Total Balance"
        value={data.totalBalance}
        change={data.balanceChange}
        isPrimary
        animationDelay={0}
      />
      <KpiCard
        label="Total Income"
        value={data.totalIncome}
        change={data.incomeChange}
        animationDelay={60}
      />
      <KpiCard
        label="Total Expenses"
        value={data.totalExpenses}
        change={data.expensesChange}
        animationDelay={120}
      />
      <KpiCard
        label="Net Savings"
        value={data.netSavings}
        change={data.savingsChange}
        animationDelay={180}
      />
    </div>
  );
}
