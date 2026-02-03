
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
}
