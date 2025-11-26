import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Employee,
  Advance,
  ProductDebt,
  PayrollRecord,
  PayrollSummary,
  PayrollDeduction
} from '../models/payroll.models';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  
  // Mock Employees
  private employees: Employee[] = [
    {
      id: '1',
      name: 'Jean Baptiste Uwimana',
      phone: '+250788123456',
      email: 'jean@gemura.rw',
      role: 'Farm Manager',
      department: 'Operations',
      baseSalary: 450000,
      bankName: 'Bank of Kigali',
      bankAccount: '0001234567890',
      hireDate: new Date('2023-01-15'),
      status: 'active',
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Marie Claire Mukamana',
      phone: '+250788234567',
      email: 'marie@gemura.rw',
      role: 'Accountant',
      department: 'Finance',
      baseSalary: 380000,
      bankName: 'Equity Bank',
      bankAccount: '0002345678901',
      hireDate: new Date('2023-03-01'),
      status: 'active',
      createdAt: new Date('2023-03-01')
    },
    {
      id: '3',
      name: 'Patrick Habimana',
      phone: '+250788345678',
      role: 'Driver',
      department: 'Logistics',
      baseSalary: 180000,
      hireDate: new Date('2023-06-10'),
      status: 'active',
      createdAt: new Date('2023-06-10')
    },
    {
      id: '4',
      name: 'Claudine Uwase',
      phone: '+250788456789',
      role: 'Milk Collector',
      department: 'Operations',
      baseSalary: 150000,
      hireDate: new Date('2024-01-05'),
      status: 'active',
      createdAt: new Date('2024-01-05')
    },
    {
      id: '5',
      name: 'Emmanuel Niyonzima',
      phone: '+250788567890',
      role: 'Security Guard',
      department: 'Security',
      baseSalary: 120000,
      hireDate: new Date('2024-02-20'),
      status: 'active',
      createdAt: new Date('2024-02-20')
    }
  ];

  // Mock Advances
  private advances: Advance[] = [
    {
      id: '1',
      personId: '3',
      personName: 'Patrick Habimana',
      personType: 'employee',
      amount: 50000,
      remainingBalance: 30000,
      reason: 'Medical emergency',
      date: new Date('2025-11-05'),
      status: 'partial',
      deductions: [
        { id: '1', advanceId: '1', payrollId: 'p1', amount: 20000, date: new Date('2025-11-15') }
      ]
    },
    {
      id: '2',
      personId: '4',
      personName: 'Claudine Uwase',
      personType: 'employee',
      amount: 30000,
      remainingBalance: 30000,
      reason: 'School fees',
      date: new Date('2025-11-20'),
      status: 'pending',
      deductions: []
    },
    {
      id: '3',
      personId: 'sup1',
      personName: 'Rwanda Feeds Ltd',
      personType: 'supplier',
      amount: 200000,
      remainingBalance: 100000,
      reason: 'Advance payment for bulk order',
      date: new Date('2025-11-01'),
      status: 'partial',
      deductions: [
        { id: '2', advanceId: '3', payrollId: 'sp1', amount: 100000, date: new Date('2025-11-15') }
      ]
    }
  ];

  // Mock Product Debts
  private productDebts: ProductDebt[] = [
    {
      id: '1',
      personId: '2',
      personName: 'Marie Claire Mukamana',
      personType: 'employee',
      products: [
        { productName: 'Fresh Milk (5L)', quantity: 10, unitPrice: 2500, totalPrice: 25000 },
        { productName: 'Yogurt (500ml)', quantity: 5, unitPrice: 1500, totalPrice: 7500 }
      ],
      totalAmount: 32500,
      remainingBalance: 32500,
      date: new Date('2025-11-18'),
      status: 'pending'
    },
    {
      id: '2',
      personId: '5',
      personName: 'Emmanuel Niyonzima',
      personType: 'employee',
      products: [
        { productName: 'Fresh Milk (5L)', quantity: 4, unitPrice: 2500, totalPrice: 10000 }
      ],
      totalAmount: 10000,
      remainingBalance: 10000,
      date: new Date('2025-11-22'),
      status: 'pending'
    }
  ];

  // Mock Payroll Records
  private payrollRecords: PayrollRecord[] = [
    {
      id: '1',
      personId: '1',
      personName: 'Jean Baptiste Uwimana',
      personType: 'employee',
      period: '2025-10',
      periodStart: new Date('2025-10-01'),
      periodEnd: new Date('2025-10-31'),
      grossAmount: 450000,
      deductions: [],
      totalDeductions: 0,
      netAmount: 450000,
      status: 'paid',
      paidAt: new Date('2025-10-30'),
      paymentMethod: 'bank',
      createdAt: new Date('2025-10-28')
    },
    {
      id: '2',
      personId: '2',
      personName: 'Marie Claire Mukamana',
      personType: 'employee',
      period: '2025-10',
      periodStart: new Date('2025-10-01'),
      periodEnd: new Date('2025-10-31'),
      grossAmount: 380000,
      deductions: [],
      totalDeductions: 0,
      netAmount: 380000,
      status: 'paid',
      paidAt: new Date('2025-10-30'),
      paymentMethod: 'bank',
      createdAt: new Date('2025-10-28')
    }
  ];

  private employeesSubject = new BehaviorSubject<Employee[]>(this.employees);
  private advancesSubject = new BehaviorSubject<Advance[]>(this.advances);
  private productDebtsSubject = new BehaviorSubject<ProductDebt[]>(this.productDebts);
  private payrollSubject = new BehaviorSubject<PayrollRecord[]>(this.payrollRecords);

  // Employee Methods
  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployees$(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id' | 'createdAt'>): Employee {
    const newEmployee: Employee = {
      ...employee,
      id: (this.employees.length + 1).toString(),
      createdAt: new Date()
    };
    this.employees.push(newEmployee);
    this.employeesSubject.next(this.employees);
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updates };
      this.employeesSubject.next(this.employees);
      return this.employees[index];
    }
    return null;
  }

  deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      this.employeesSubject.next(this.employees);
      return true;
    }
    return false;
  }

  // Advance Methods
  getAdvances(): Advance[] {
    return [...this.advances];
  }

  getAdvances$(): Observable<Advance[]> {
    return this.advancesSubject.asObservable();
  }

  getAdvancesByPerson(personId: string, personType: 'employee' | 'supplier'): Advance[] {
    return this.advances.filter(a => a.personId === personId && a.personType === personType);
  }

  getPendingAdvances(personId: string, personType: 'employee' | 'supplier'): Advance[] {
    return this.advances.filter(
      a => a.personId === personId && 
           a.personType === personType && 
           a.status !== 'cleared'
    );
  }

  addAdvance(advance: Omit<Advance, 'id' | 'deductions' | 'status'>): Advance {
    const newAdvance: Advance = {
      ...advance,
      id: (this.advances.length + 1).toString(),
      remainingBalance: advance.amount,
      status: 'pending',
      deductions: []
    };
    this.advances.push(newAdvance);
    this.advancesSubject.next(this.advances);
    return newAdvance;
  }

  deductFromAdvance(advanceId: string, amount: number, payrollId: string): boolean {
    const advance = this.advances.find(a => a.id === advanceId);
    if (!advance || amount > advance.remainingBalance) return false;

    advance.remainingBalance -= amount;
    advance.deductions.push({
      id: (advance.deductions.length + 1).toString(),
      advanceId,
      payrollId,
      amount,
      date: new Date()
    });
    advance.status = advance.remainingBalance === 0 ? 'cleared' : 'partial';
    this.advancesSubject.next(this.advances);
    return true;
  }

  // Product Debt Methods
  getProductDebts(): ProductDebt[] {
    return [...this.productDebts];
  }

  getProductDebts$(): Observable<ProductDebt[]> {
    return this.productDebtsSubject.asObservable();
  }

  getPendingProductDebts(personId: string, personType: 'employee' | 'supplier'): ProductDebt[] {
    return this.productDebts.filter(
      d => d.personId === personId && 
           d.personType === personType && 
           d.status !== 'cleared'
    );
  }

  addProductDebt(debt: Omit<ProductDebt, 'id' | 'status'>): ProductDebt {
    const newDebt: ProductDebt = {
      ...debt,
      id: (this.productDebts.length + 1).toString(),
      status: 'pending'
    };
    this.productDebts.push(newDebt);
    this.productDebtsSubject.next(this.productDebts);
    return newDebt;
  }

  deductFromProductDebt(debtId: string, amount: number): boolean {
    const debt = this.productDebts.find(d => d.id === debtId);
    if (!debt || amount > debt.remainingBalance) return false;

    debt.remainingBalance -= amount;
    debt.status = debt.remainingBalance === 0 ? 'cleared' : 'partial';
    this.productDebtsSubject.next(this.productDebts);
    return true;
  }

  // Payroll Methods
  getPayrollRecords(): PayrollRecord[] {
    return [...this.payrollRecords];
  }

  getPayrollRecords$(): Observable<PayrollRecord[]> {
    return this.payrollSubject.asObservable();
  }

  getPayrollByPeriod(period: string): PayrollRecord[] {
    return this.payrollRecords.filter(p => p.period === period);
  }

  generatePayroll(
    personId: string, 
    personType: 'employee' | 'supplier',
    period: string,
    periodStart: Date,
    periodEnd: Date,
    grossAmount: number
  ): PayrollRecord {
    const person = personType === 'employee' 
      ? this.employees.find(e => e.id === personId)
      : null; // Would get from supplier service

    const personName = person?.name || 'Unknown';
    
    // Calculate deductions
    const deductions: PayrollDeduction[] = [];
    
    // Get pending advances
    const pendingAdvances = this.getPendingAdvances(personId, personType);
    pendingAdvances.forEach(advance => {
      const deductAmount = Math.min(advance.remainingBalance, grossAmount * 0.3); // Max 30% deduction
      if (deductAmount > 0) {
        deductions.push({
          type: 'advance',
          description: `Advance repayment - ${advance.reason}`,
          amount: deductAmount,
          referenceId: advance.id
        });
      }
    });

    // Get pending product debts
    const pendingDebts = this.getPendingProductDebts(personId, personType);
    pendingDebts.forEach(debt => {
      deductions.push({
        type: 'product_debt',
        description: `Product debt - ${debt.products.map(p => p.productName).join(', ')}`,
        amount: debt.remainingBalance,
        referenceId: debt.id
      });
    });

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const netAmount = grossAmount - totalDeductions;

    const payroll: PayrollRecord = {
      id: (this.payrollRecords.length + 1).toString(),
      personId,
      personName,
      personType,
      period,
      periodStart,
      periodEnd,
      grossAmount,
      deductions,
      totalDeductions,
      netAmount,
      status: 'draft',
      createdAt: new Date()
    };

    this.payrollRecords.push(payroll);
    this.payrollSubject.next(this.payrollRecords);
    return payroll;
  }

  approvePayroll(payrollId: string, approvedBy: string): boolean {
    const payroll = this.payrollRecords.find(p => p.id === payrollId);
    if (!payroll || payroll.status !== 'draft') return false;

    payroll.status = 'approved';
    payroll.approvedBy = approvedBy;
    payroll.approvedAt = new Date();
    this.payrollSubject.next(this.payrollRecords);
    return true;
  }

  processPayment(payrollId: string, paymentMethod: 'bank' | 'cash' | 'mobile'): boolean {
    const payroll = this.payrollRecords.find(p => p.id === payrollId);
    if (!payroll || payroll.status !== 'approved') return false;

    // Apply deductions to advances and debts
    payroll.deductions.forEach(deduction => {
      if (deduction.type === 'advance' && deduction.referenceId) {
        this.deductFromAdvance(deduction.referenceId, deduction.amount, payrollId);
      } else if (deduction.type === 'product_debt' && deduction.referenceId) {
        this.deductFromProductDebt(deduction.referenceId, deduction.amount);
      }
    });

    payroll.status = 'paid';
    payroll.paidAt = new Date();
    payroll.paymentMethod = paymentMethod;
    this.payrollSubject.next(this.payrollRecords);
    return true;
  }

  // Summary
  getSummary(): PayrollSummary {
    const activeEmployees = this.employees.filter(e => e.status === 'active');
    const pendingAdvances = this.advances.filter(a => a.status !== 'cleared');
    const pendingDebts = this.productDebts.filter(d => d.status !== 'cleared');
    const pendingPayroll = this.payrollRecords.filter(p => p.status !== 'paid');

    return {
      totalEmployees: activeEmployees.length,
      totalSuppliers: 0, // Would come from supplier service
      pendingPayroll: pendingPayroll.length,
      totalAdvances: pendingAdvances.reduce((sum, a) => sum + a.remainingBalance, 0),
      totalProductDebts: pendingDebts.reduce((sum, d) => sum + d.remainingBalance, 0),
      monthlyPayrollAmount: activeEmployees.reduce((sum, e) => sum + e.baseSalary, 0)
    };
  }

  getDepartments(): string[] {
    return [...new Set(this.employees.map(e => e.department))];
  }

  getRoles(): string[] {
    return [...new Set(this.employees.map(e => e.role))];
  }
}

