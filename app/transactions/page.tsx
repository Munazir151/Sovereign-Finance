'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import TransactionTable from '@/components/transactions/TransactionTable';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import { Transaction } from '@/lib/types';
import { useDashboard } from '@/lib/DashboardContext';
import { motion } from 'framer-motion';

export default function TransactionsPage() {
  const { transactions, isAdmin, setRole, addTransaction, updateTransaction, deleteTransaction } = useDashboard();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);

  const handleSave = (t: Transaction) => {
    if (editTxn) updateTransaction(t);
    else addTransaction(t);
  };

  const handleEdit = (t: Transaction) => {
    setEditTxn(t);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const openAdd = () => {
    setEditTxn(null);
    setModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Header
        title="Transactions"
        subtitle={`${transactions.length} total records • ${isAdmin ? 'Admin Mode' : 'Viewer Mode'}`}
        actions={
          <div className="flex items-center gap-2">
            {/* Role Toggle */}
            <div className="role-toggle">
              <button
                className={`role-toggle-btn ${isAdmin ? 'active' : ''}`}
                onClick={() => setRole('admin')}
                id="role-admin-btn"
              >
                Admin
              </button>
              <button
                className={`role-toggle-btn ${!isAdmin ? 'active' : ''}`}
                onClick={() => setRole('viewer')}
                id="role-viewer-btn"
              >
                Viewer
              </button>
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={openAdd} id="add-txn-btn">
                + Add Transaction
              </button>
            )}
          </div>
        }
      />
      <div className="page-content">
        <TransactionTable
          transactions={transactions}
          isAdmin={isAdmin}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false); setEditTxn(null); }}
        onSave={handleSave}
        editTransaction={editTxn}
      />
    </motion.div>
  );
}
