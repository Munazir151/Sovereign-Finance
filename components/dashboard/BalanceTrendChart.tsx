'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { ChartDataPoint } from '@/lib/types';

const formatK = (v: number) => `$${(v / 1000).toFixed(0)}k`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-surface-container-high)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-md)',
      }}>
        <p style={{ fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-headline)', letterSpacing: '-0.02em', color: 'var(--color-on-surface)' }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--color-on-surface-variant)', textTransform: 'capitalize' }}>{p.name}:</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              ${p.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BalanceTrendChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Balance Trend</div>
          <div className="card-subtitle">Activity for the last 6 months</div>
        </div>
        <span className="badge badge-completed">Live</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#091426" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#091426" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#006c49" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#006c49" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ff5250" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ff5250" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-container-high)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatK}
              tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#091426"
              strokeWidth={2.5}
              fill="url(#balanceGrad)"
              name="balance"
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#006c49"
              strokeWidth={2}
              fill="url(#incomeGrad)"
              name="income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ff5250"
              strokeWidth={2}
              fill="url(#expenseGrad)"
              name="expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
