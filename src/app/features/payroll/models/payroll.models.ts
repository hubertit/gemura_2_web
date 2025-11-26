export interface Employee {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  department: string;
  baseSalary: number;
  bankName?: string;
  bankAccount?: string;
  hireDate: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Advance {
  id: string;
  personId: string;
  personName: string;
  personType: 'employee' | 'supplier';
  amount: number;
  remainingBalance: number;
  reason: string;
  date: Date;
  status: 'pending' | 'partial' | 'cleared';
  deductions: AdvanceDeduction[];
}

export interface AdvanceDeduction {
  id: string;
  advanceId: string;
  payrollId: string;
  amount: number;
  date: Date;
}

export interface ProductDebt {
  id: string;
  personId: string;
  personName: string;
  personType: 'employee' | 'supplier';
  products: ProductDebtItem[];
  totalAmount: number;
  remainingBalance: number;
  date: Date;
  status: 'pending' | 'partial' | 'cleared';
}

export interface ProductDebtItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PayrollRecord {
  id: string;
  personId: string;
  personName: string;
  personType: 'employee' | 'supplier';
  period: string; // e.g., "2025-11" for monthly, "2025-11-1" for first half
  periodStart: Date;
  periodEnd: Date;
  grossAmount: number;
  deductions: PayrollDeduction[];
  totalDeductions: number;
  netAmount: number;
  status: 'draft' | 'approved' | 'paid';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  paymentMethod?: 'bank' | 'cash' | 'mobile';
  notes?: string;
  createdAt: Date;
}

export interface PayrollDeduction {
  type: 'advance' | 'product_debt' | 'tax' | 'other';
  description: string;
  amount: number;
  referenceId?: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalSuppliers: number;
  pendingPayroll: number;
  totalAdvances: number;
  totalProductDebts: number;
  monthlyPayrollAmount: number;
}

export type PaymentCycle = 'monthly' | 'bi-weekly' | '15-days';

