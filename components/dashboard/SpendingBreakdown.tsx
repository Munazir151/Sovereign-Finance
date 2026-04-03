'use client';

import { SpendingCategory } from '@/lib/types';

export default function SpendingBreakdown({ categories }: { categories: SpendingCategory[] }) {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Spending Breakdown</div>
          <div className="card-subtitle">By category, this month</div>
        </div>
      </div>
      <div className="spending-list">
        {categories.slice(0, 7).map((cat, i) => (
          <div key={cat.name} className="spending-item" style={{
            animationDelay: `${i * 50}ms`,
          }}>
            <span className="spending-dot" style={{ background: cat.color }} />
            <span className="spending-name">{cat.name}</span>
            <div className="spending-bar-track" style={{ maxWidth: 80 }}>
              <div
                className="spending-bar-fill"
                style={{ width: `${cat.percentage}%`, background: cat.color }}
              />
            </div>
            <span className="spending-pct">{cat.percentage}%</span>
            <span className="spending-amount">${cat.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
