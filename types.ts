
export interface Transaction {
  id: string;
  dealerId: string;
  dealerName?: string; // For display purposes, populated from dealers
  date: string;
  chickenCount: number;
  weightKg: number;
  pricePerKg: number;
  totalAmount: number;
  isPaid: boolean;
  createdAt: number;
  note?: string; // Optional note field
}

export interface Dealer {
  id: string;
  name: string;
  createdAt: number;
}

export interface BusinessStats {
  totalWeight: number;
  totalRevenue: number;
  totalChickens: number;
  pendingAmount: number;
  paidAmount: number;
  transactionCount: number;
}

export type FilterType = 'all' | 'paid' | 'unpaid';

export interface AppState {
  transactions: Transaction[];
  isLoading: boolean;
  filters: {
    search: string;
    status: FilterType;
    startDate: string;
    endDate: string;
    dealerId: string;
  };
}
