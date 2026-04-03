'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/lib/types';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2, CreditCard, Briefcase, Home, ShoppingCart, TrendingUp, Film, Laptop, Utensils, ArrowRightLeft, Settings, Building, Plane, Zap, Activity } from 'lucide-react';
import { useDashboard } from '@/lib/DashboardContext';

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Employment': return <Briefcase size={18} />;
    case 'Housing': return <Home size={18} />;
    case 'Groceries': return <ShoppingCart size={18} />;
    case 'Investments': return <TrendingUp size={18} />;
    case 'Entertainment': return <Film size={18} />;
    case 'Freelance': return <Laptop size={18} />;
    case 'Dining': return <Utensils size={18} />;
    case 'Transfer': return <ArrowRightLeft size={18} />;
    case 'Technology': return <Settings size={18} />;
    case 'Consulting': return <Building size={18} />;
    case 'Travel': return <Plane size={18} />;
    case 'Utilities': return <Zap size={18} />;
    case 'Health': return <Activity size={18} />;
    default: return <CreditCard size={18} />;
  }
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Math.abs(n));

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type SortKey = 'date' | 'description' | 'amount' | 'status';
type SortDir = 'asc' | 'desc';

interface TransactionTableProps {
  transactions: Transaction[];
  isAdmin: boolean;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionTable({ transactions, isAdmin, onEdit, onDelete }: TransactionTableProps) {
  const { globalCategoryFilter, setGlobalCategoryFilter } = useDashboard();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown size={14} style={{ opacity: 0.3, display: 'inline', verticalAlign: 'middle' }} />;
    return sortDir === 'asc' ? <ArrowUp size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <ArrowDown size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />;
  };

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        if (globalCategoryFilter && t.category !== globalCategoryFilter) return false;
        
        const q = search.toLowerCase();
        if (q && !t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
        if (filterType !== 'all' && t.type !== filterType) return false;
        if (filterStatus !== 'all' && t.status !== filterStatus) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
        else if (sortKey === 'description') cmp = a.description.localeCompare(b.description);
        else if (sortKey === 'amount') cmp = a.amount - b.amount;
        else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [transactions, search, filterType, filterStatus, sortKey, sortDir, globalCategoryFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, filterStatus, sortKey, sortDir, globalCategoryFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  const paginated = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <>
      <div className="table-toolbar">
        <div className="search-input-wrap">
          <span className="search-icon"><Search size={16} /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="txn-search"
          />
        </div>
        {globalCategoryFilter && (
          <button 
            type="button" 
            className="badge" 
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', cursor: 'pointer', border: 'none' }}
            onClick={() => setGlobalCategoryFilter(null)}
          >
            {globalCategoryFilter} ✕
          </button>
        )}
        <select
          className="filter-select"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          id="txn-filter-type"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          id="txn-filter-status"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <span className="text-muted" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('description')} id="th-desc">
                  Transaction {sortIcon('description')}
                </th>
                <th>Category</th>
                <th onClick={() => handleSort('date')} id="th-date">
                  Date {sortIcon('date')}
                </th>
                <th>Account</th>
                <th onClick={() => handleSort('amount')} id="th-amount">
                  Amount {sortIcon('amount')}
                </th>
                <th onClick={() => handleSort('status')} id="th-status">
                  Status {sortIcon('status')}
                </th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--color-on-surface-variant)' }}>
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Search size={32} opacity={0.5} /></div>
                    No transactions match your filters
                  </td>
                </tr>
              ) : paginated.map((t, idx) => (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.05, 0.5) }}
                >
                  <td>
                    <div className="txn-desc-cell">
                      <div className="txn-icon"><CategoryIcon category={t.category} /></div>
                      <div>
                        <div className="txn-desc-text">{t.description}</div>
                        <div className="txn-desc-id">{t.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>
                      {t.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
                  <td style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.82rem' }}>{t.account}</td>
                  <td>
                    <span className={`txn-amount-${t.type === 'income' ? 'positive' : t.type === 'transfer' ? 'transfer' : 'negative'}`}>
                      {t.type === 'income' ? '+' : t.type === 'transfer' ? '↔' : '−'}{formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${t.status}`}>
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn-icon"
                          title="Edit"
                          onClick={() => onEdit?.(t)}
                          aria-label={`Edit transaction ${t.id}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Delete"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => onDelete?.(t.id)}
                          aria-label={`Delete transaction ${t.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls" style={{ padding: '16px 20px', borderTop: '1px solid var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-on-surface-variant)' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-ghost" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                Previous
              </button>
              <span className="btn" style={{ background: 'var(--color-surface-container-high)', pointerEvents: 'none', padding: '6px 16px', fontSize: '0.85rem' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="btn btn-ghost" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
