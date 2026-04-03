import { Transaction } from './types';

/**
 * Converts an array of transactions to CSV format and triggers a file download in the browser.
 */
export function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'Sovereign_Finance_Export.csv') {
  if (!transactions.length) return;

  // Define the headers based on the Transaction type
  const headers = ['ID', 'Type', 'Amount', 'Description', 'Category', 'Date', 'Status'];

  // Map transactions to CSV rows
  const rows = transactions.map(txn => {
    return [
      `"${txn.id}"`,
      `"${txn.type}"`,
      `"${txn.amount.toString()}"`,
      `"${txn.description.replace(/"/g, '""')}"`, // Escape internal quotes
      `"${txn.category}"`,
      `"${txn.date}"`,
      `"${txn.status}"`
    ].join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a hidden link and trigger download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Parses transaction data to algorithmically generate a business insight string.
 */
export function generateSmartInsight(transactions: Transaction[]): string {
  if (transactions.length === 0) return "No transaction data available to generate insights.";
  
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return "Your portfolio is completely stabilized with zero recent expenses.";

  const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
  });

  const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
  const topPercentage = ((categoryTotals[topCategory] / totalExpense) * 100).toFixed(1);

  return `Anomaly detected in your spending velocity: **${topCategory}** accounts for ${topPercentage}% of your total expenses. Consider optimizing this allocation.`;
}
