'use client';

import { useDashboard } from '@/lib/DashboardContext';
import { generateSmartInsight } from '@/lib/utils';
export default function SmartInsight() {
  const { transactions } = useDashboard();
  const insightText = generateSmartInsight(transactions);

  const formatText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: '#4edea3' }}>{part}</strong> : part));
  };

  return (
    <div className="insight-card animate-in animate-delay-4" style={{ opacity: 0 }}>
      <div className="insight-label">✦ Algorithmic Insight</div>
      <div className="insight-text" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p>{formatText(insightText)}</p>
      </div>
      <p className="insight-quote">
        "Compound interest is the eighth wonder of the world. He who understands it, earns it." — Einstein
      </p>
    </div>
  );
}
