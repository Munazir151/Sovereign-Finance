export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type UserRole = 'admin' | 'viewer';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  account: string;
}

export interface KpiData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  balanceChange: number;
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
}

export interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface InsightData {
  message: string;
  metric: string;
  value: string;
}
