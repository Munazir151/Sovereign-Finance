'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Monitor, ArrowRight, Sun, Moon } from 'lucide-react';
import { useKeyPress } from '@/lib/hooks';
import { useDashboard } from '@/lib/DashboardContext';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { transactions } = useDashboard();

  const isCmdK = useKeyPress('k', true);
  const isEscape = useKeyPress('Escape');

  useEffect(() => {
    if (isCmdK) {
      setIsOpen(prev => !prev);
    }
  }, [isCmdK]);

  useEffect(() => {
    if (isEscape) setIsOpen(false);
  }, [isEscape]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    setIsOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const filteredTxns = transactions.filter(t => 
    t.description.toLowerCase().includes(query.toLowerCase()) || 
    t.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{ zIndex: 9999, alignItems: 'flex-start', paddingTop: '10vh' }} onClick={() => setIsOpen(false)}>
        <motion.div 
          className="modal-panel" 
          style={{ maxWidth: 600, background: 'var(--color-surface-glass)', backdropFilter: 'blur(24px)' }}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-glass-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Search size={20} color="var(--color-on-surface-variant)" />
            <input 
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions, switch theme, jump to pages..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--color-on-surface)', fontSize: '1.1rem', outline: 'none' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', background: 'var(--color-surface-container)', padding: '4px 8px', borderRadius: 4 }}>ESC</div>
          </div>

          <div style={{ padding: '12px 0', maxHeight: '50vh', overflowY: 'auto' }}>
            {!query && (
              <>
                <div style={{ padding: '8px 20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-on-surface-variant)' }}>Navigation</div>
                <button className="cp-item" onClick={() => navigateTo('/dashboard')}><Monitor size={16} /> Overview <ArrowRight size={14} className="ml-auto" /></button>
                <button className="cp-item" onClick={() => navigateTo('/transactions')}><Monitor size={16} /> Transactions <ArrowRight size={14} className="ml-auto" /></button>
                <button className="cp-item" onClick={() => navigateTo('/insights')}><Monitor size={16} /> Insights <ArrowRight size={14} className="ml-auto" /></button>
                
                <div style={{ padding: '8px 20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-on-surface-variant)', marginTop: 8 }}>Actions</div>
                <button className="cp-item" onClick={toggleTheme}><Sun size={16} /> Toggle Theme <ArrowRight size={14} className="ml-auto" /></button>
              </>
            )}

            {query && (
              <>
                <div style={{ padding: '8px 20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-on-surface-variant)' }}>Recent Transactions</div>
                {filteredTxns.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>No results found for "{query}"</div>
                ) : (
                  filteredTxns.map(t => (
                    <button key={t.id} className="cp-item" onClick={() => navigateTo('/transactions')}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>{t.description}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-on-surface-variant)' }}>{t.category} • {t.date}</div>
                      </div>
                      <div className={`ml-auto ${t.type === 'income' ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 700 }}>
                        {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
                      </div>
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
