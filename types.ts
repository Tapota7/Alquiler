
export interface Tenant {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  startDate: string;
  monthlyRent: number;
  paymentDay: number; // e.g., 5th of every month
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE'
}

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  date: string; // ISO date
  monthYear: string; // format "YYYY-MM"
  status: PaymentStatus;
  concept: string;
}


export interface OwnerProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  theme?: 'light' | 'dark';
}

export interface ReminderConfig {
  enabled: boolean;
  daysBeforeDue: number;
  messageTemplate: string;
  autoSend: boolean;
}

export interface NotificationHistory {
  id: string;
  tenantId: string;
  type: 'reminder' | 'payment_receipt' | 'custom';
  message: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

export interface FilterCriteria {
  status?: PaymentStatus[];
  dateRange?: { start: string; end: string };
  amountRange?: { min: number; max: number };
  searchQuery?: string;
}
