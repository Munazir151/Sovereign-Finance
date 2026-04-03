'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionType, TransactionStatus } from '@/lib/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (t: Transaction) => void;
  editTransaction?: Transaction | null;
}

const categories = [
  'Employment', 'Housing', 'Groceries', 'Investments', 'Entertainment',
  'Freelance', 'Dining', 'Transfer', 'Technology', 'Consulting', 'Travel', 'Utilities', 'Health', 'Other'
];

const accounts = ['Primary Checking', 'Credit Card', 'Investment Portfolio', 'Business Account', 'Savings Account'];

const emptyForm = {
  description: '',
  category: 'Other',
  amount: '',
  type: 'expense' as TransactionType,
  status: 'completed' as TransactionStatus,
  account: 'Primary Checking',
  date: new Date().toISOString().split('T')[0],
};

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  category: z.string(),
  amount: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, 'Amount must be a positive number'),
  type: z.enum(['income', 'expense', 'transfer']),
  status: z.enum(['completed', 'pending', 'failed']),
  account: z.string(),
  date: z.string()
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function AddTransactionModal({ isOpen, onClose, onSave, editTransaction }: AddTransactionModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { ...emptyForm, amount: undefined },
  });

  useEffect(() => {
    if (editTransaction) {
      reset({
        description: editTransaction.description,
        category: editTransaction.category,
        amount: Math.abs(editTransaction.amount),
        type: editTransaction.type as any,
        status: editTransaction.status as any,
        account: editTransaction.account,
        date: editTransaction.date,
      });
    } else {
      reset({ ...emptyForm, amount: undefined });
    }
  }, [editTransaction, isOpen, reset]);

  const onSubmit = (data: TransactionFormData) => {
    const id = editTransaction?.id ?? `TXN-${Date.now().toString().slice(-5)}`;
    const parsedAmount = Number(data.amount);
    const amount = data.type === 'expense' ? -parsedAmount : parsedAmount;
    onSave({ id, amount, description: data.description, category: data.category, type: data.type, status: data.status, account: data.account, date: data.date });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close modal"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="txn-desc-input">Description</label>
              <input
                id="txn-desc-input"
                className="form-input"
                placeholder="e.g. Monthly Salary Deposit"
                {...register('description')}
              />
              {errors.description && <span style={{ color: 'var(--color-danger)', fontSize: '0.78rem' }}>{errors.description.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="txn-type-select">Type</label>
                <select id="txn-type-select" className="form-select" {...register('type')}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="txn-amount-input">Amount (USD)</label>
                <input
                  id="txn-amount-input"
                  className="form-input"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount')}
                />
                {errors.amount && <span style={{ color: 'var(--color-danger)', fontSize: '0.78rem' }}>{errors.amount.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="txn-category-select">Category</label>
                <select id="txn-category-select" className="form-select" {...register('category')}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="txn-account-select">Account</label>
                <select id="txn-account-select" className="form-select" {...register('account')}>
                  {accounts.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="txn-date-input">Date</label>
                <input
                  id="txn-date-input"
                  className="form-input"
                  type="date"
                  {...register('date')}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="txn-status-select">Status</label>
                <select id="txn-status-select" className="form-select" {...register('status')}>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="txn-save-btn">
              {editTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
