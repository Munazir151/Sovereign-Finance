'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { ChartDataPoint, SpendingCategory } from '@/lib/types';
import { useDashboard } from '@/lib/DashboardContext';
import { useRouter } from 'next/navigation';

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
        <p style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-on-surface)', fontFamily: 'var(--font-headline)', letterSpacing: '-0.02em' }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color ?? p.stroke, display: 'inline-block' }} />
            <span style={{ fontSize: '0.82rem', color: 'var(--color-on-surface-variant)', textTransform: 'capitalize' }}>{p.name}:</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              ${(p.value ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function IncomeExpenseBarChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Income vs Expenses</div>
          <div className="card-subtitle">6-month comparison</div>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 4, left: -10, bottom: 0 }} barSize={18} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-container-high)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatK} tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-container)' }} />
            <Bar dataKey="income" name="income" fill="#006c49" radius={[4,4,0,0]} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
            <Bar dataKey="expenses" name="expenses" fill="#ff5250" radius={[4,4,0,0]} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BalanceLineChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Portfolio Balance</div>
          <div className="card-subtitle">Net balance over time</div>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4edea3" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-container-high)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatK} tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="balance" stroke="#4edea3" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} activeDot={{ r: 6, fill: '#4edea3' }} name="balance" isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SpendingDonutChart({ categories }: { categories: SpendingCategory[] }) {
  const { setGlobalCategoryFilter } = useDashboard();
  const router = useRouter();

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Spending Distribution</div>
          <div className="card-subtitle">Click a slice to filter table</div>
        </div>
      </div>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              dataKey="amount"
              paddingAngle={2}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {categories.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  onClick={() => {
                    setGlobalCategoryFilter(entry.name);
                    router.push('/transactions');
                  }}
                  style={{ cursor: 'pointer', outline: 'none' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
