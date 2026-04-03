'use client';

import { useDashboard } from '@/lib/DashboardContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useDashboard();

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.95 }}
            style={{
              pointerEvents: 'auto',
              background: 'var(--color-surface-container-lowest)',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '300px',
              border: t.type === 'error' ? '1px solid var(--color-danger-bg)' : '1px solid var(--color-surface-container-high)',
            }}
          >
            {t.type === 'success' && <CheckCircle2 color="var(--color-secondary)" size={20} />}
            {t.type === 'error' && <AlertCircle color="var(--color-danger)" size={20} />}
            {t.type === 'info' && <Info color="var(--color-primary-fixed-dim)" size={20} />}
            
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-on-surface)' }}>
              {t.message}
            </span>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                marginLeft: 'auto',
                cursor: 'pointer',
                color: 'var(--color-on-surface-variant)',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
