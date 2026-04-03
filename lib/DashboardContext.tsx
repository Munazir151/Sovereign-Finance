'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Transaction, UserRole } from '@/lib/types';
import { mockTransactions } from '@/lib/data';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DashboardContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: number) => void;
  isAdmin: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (o: boolean) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (o: boolean) => void;
  globalCategoryFilter: string | null;
  setGlobalCategoryFilter: (category: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalCategoryFilter, setGlobalCategoryFilter] = useState<string | null>(null);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const addTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    showToast(`Transaction added: ${t.description}`, 'success');
  }, [showToast]);

  const updateTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => prev.map(x => x.id === t.id ? t : x));
    showToast(`Transaction updated: ${t.description}`, 'success');
  }, [showToast]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast(`Transaction deleted`, 'error');
  }, [showToast]);

  return (
    <DashboardContext.Provider value={{
      role,
      setRole,
      isAdmin: role === 'admin',
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      toasts,
      showToast,
      removeToast,
      isMobileMenuOpen,
      setMobileMenuOpen,
      isSidebarCollapsed,
      setSidebarCollapsed,
      globalCategoryFilter,
      setGlobalCategoryFilter
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
