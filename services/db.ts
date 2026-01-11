
import { Transaction } from '../types';

/**
 * CLIENT-SIDE DB SERVICE
 * This file runs in the browser. It calls our Next.js API routes.
 */

const API_BASE = '/api/transactions';
const DEALERS_API = '/api/dealers';

export const db = {
  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to load data');
    return res.json();
  },

  saveTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'totalAmount'>): Promise<Transaction> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (!res.ok) throw new Error('Failed to save data');
    return res.json();
  },

  updatePaymentStatus: async (id: string, isPaid: boolean): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaid }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return db.getTransactions();
  },

  updateTransaction: async (id: string, data: Omit<Transaction, 'id' | 'createdAt' | 'totalAmount'>): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return db.getTransactions();
  },

  deleteTransaction: async (id: string): Promise<Transaction[]> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete');
    return db.getTransactions();
  },

  // Dealers
  getDealers: async (): Promise<{ id: string; name: string; createdAt: number }[]> => {
    const res = await fetch(DEALERS_API);
    if (!res.ok) throw new Error('Failed to load dealers');
    return res.json();
  },

  addDealer: async (name: string): Promise<{ id: string; name: string; createdAt: number }> => {
    const res = await fetch(DEALERS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to add dealer');
    return res.json();
  },

  updateDealer: async (id: string, name: string): Promise<void> => {
    const res = await fetch(DEALERS_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    });
    if (!res.ok) throw new Error('Failed to update dealer');
  }
};
