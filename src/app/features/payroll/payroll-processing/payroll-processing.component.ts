import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../services/payroll.service';
import { Employee, PayrollRecord, PayrollSummary } from '../models/payroll.models';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-payroll-processing',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <div class="payroll-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Payroll Processing</h1>
          <p class="page-description">Generate and process employee & supplier payments</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openGenerateModal()">
            <app-lucide-icon name="plus" size="16px"></app-lucide-icon>
            Generate Payroll
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon pending">
            <app-lucide-icon name="clock" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ pendingCount }}</span>
            <span class="stat-label">Pending Approval</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon approved">
            <app-lucide-icon name="check" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ approvedCount }}</span>
            <span class="stat-label">Ready to Pay</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon paid">
            <app-lucide-icon name="check-circle" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ paidCount }}</span>
            <span class="stat-label">Paid This Month</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amount">
            <app-lucide-icon name="dollar-sign" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalPending | number }}</span>
            <span class="stat-label">Pending Amount (RWF)</span>
          </div>
        </div>
      </div>

      <!-- Period Filter -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Period</label>
          <input type="month" [(ngModel)]="selectedPeriod" (change)="filterRecords()">
        </div>
        <div class="filter-group">
          <label>Type</label>
          <select [(ngModel)]="selectedType" (change)="filterRecords()">
            <option value="">All</option>
            <option value="employee">Employees</option>
            <option value="supplier">Suppliers</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Status</label>
          <select [(ngModel)]="selectedStatus" (change)="filterRecords()">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <!-- Payroll Records Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-section">
            <h3>Payroll Records</h3>
            <span class="item-count">{{ filteredRecords.length }} records</span>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive" *ngIf="filteredRecords.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Gross</th>
                  <th>Deductions</th>
                  <th>Net Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let record of filteredRecords">
                  <td class="person-cell">
                    <span class="name">{{ record.personName }}</span>
                  </td>
                  <td>
                    <span class="type-badge" [class]="record.personType">
                      {{ record.personType }}
                    </span>
                  </td>
                  <td>{{ record.period }}</td>
                  <td>{{ record.grossAmount | number }}</td>
                  <td class="deductions">
                    <span *ngIf="record.totalDeductions > 0" class="has-deductions">
                      -{{ record.totalDeductions | number }}
                    </span>
                    <span *ngIf="record.totalDeductions === 0">-</span>
                  </td>
                  <td class="net-amount">{{ record.netAmount | number }}</td>
                  <td>
                    <span class="status-badge" [class]="record.status">
                      {{ record.status }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button class="action-btn view" (click)="viewRecord(record)" title="View Details">
                      <app-lucide-icon name="eye" size="16px"></app-lucide-icon>
                    </button>
                    <button class="action-btn approve" *ngIf="record.status === 'draft'" 
                            (click)="approveRecord(record)" title="Approve">
                      <app-lucide-icon name="check" size="16px"></app-lucide-icon>
                    </button>
                    <button class="action-btn pay" *ngIf="record.status === 'approved'" 
                            (click)="openPayModal(record)" title="Process Payment">
                      <app-lucide-icon name="dollar-sign" size="16px"></app-lucide-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="empty-state" *ngIf="filteredRecords.length === 0">
            <app-lucide-icon name="file-text" size="48px"></app-lucide-icon>
            <h4>No payroll records</h4>
            <p>Generate payroll for this period to get started</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate Payroll Modal -->
    <div class="modal-overlay" *ngIf="showGenerateModal" (click)="closeGenerateModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Generate Payroll</h2>
          <button class="close-btn" (click)="closeGenerateModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Payroll Type</label>
            <select [(ngModel)]="generateType">
              <option value="employee">Employee Salaries (Monthly)</option>
              <option value="supplier">Supplier Payments (15-day)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Period</label>
            <input type="month" [(ngModel)]="generatePeriod">
          </div>
          
          <div class="employee-selection" *ngIf="generateType === 'employee'">
            <label>Select Employees</label>
            <div class="checkbox-list">
              <label class="checkbox-item" *ngFor="let emp of employees">
                <input type="checkbox" [(ngModel)]="emp.selected">
                <span class="name">{{ emp.name }}</span>
                <span class="salary">{{ emp.baseSalary | number }} RWF</span>
              </label>
            </div>
            <button class="btn-link" (click)="selectAllEmployees()">Select All</button>
          </div>

          <div class="summary-box" *ngIf="selectedEmployeesCount > 0">
            <div class="summary-row">
              <span>Selected:</span>
              <span>{{ selectedEmployeesCount }} employees</span>
            </div>
            <div class="summary-row">
              <span>Total Gross:</span>
              <span>{{ selectedTotalGross | number }} RWF</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeGenerateModal()">Cancel</button>
          <button class="btn-primary" (click)="generatePayroll()" [disabled]="selectedEmployeesCount === 0">
            Generate Payroll
          </button>
        </div>
      </div>
    </div>

    <!-- View Record Modal -->
    <div class="modal-overlay" *ngIf="showViewModal" (click)="closeViewModal()">
      <div class="modal-container view-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Payroll Details</h2>
          <button class="close-btn" (click)="closeViewModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>
        <div class="modal-body" *ngIf="selectedRecord">
          <div class="record-header">
            <h3>{{ selectedRecord.personName }}</h3>
            <span class="status-badge" [class]="selectedRecord.status">{{ selectedRecord.status }}</span>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Period</span>
              <span class="value">{{ selectedRecord.period }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Type</span>
              <span class="value">{{ selectedRecord.personType | titlecase }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Gross Amount</span>
              <span class="value">{{ selectedRecord.grossAmount | number }} RWF</span>
            </div>
            <div class="detail-item" *ngIf="selectedRecord.paidAt">
              <span class="label">Paid On</span>
              <span class="value">{{ selectedRecord.paidAt | date:'mediumDate' }}</span>
            </div>
          </div>

          <div class="deductions-section" *ngIf="selectedRecord.deductions.length > 0">
            <h4>Deductions</h4>
            <div class="deduction-item" *ngFor="let ded of selectedRecord.deductions">
              <div class="deduction-info">
                <span class="type" [class]="ded.type">{{ ded.type | titlecase }}</span>
                <span class="desc">{{ ded.description }}</span>
              </div>
              <span class="amount">-{{ ded.amount | number }} RWF</span>
            </div>
            <div class="deduction-total">
              <span>Total Deductions</span>
              <span>-{{ selectedRecord.totalDeductions | number }} RWF</span>
            </div>
          </div>

          <div class="net-section">
            <span class="label">Net Payable</span>
            <span class="net-value">{{ selectedRecord.netAmount | number }} RWF</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeViewModal()">Close</button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal-overlay" *ngIf="showPayModal" (click)="closePayModal()">
      <div class="modal-container pay-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Process Payment</h2>
          <button class="close-btn" (click)="closePayModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>
        <div class="modal-body" *ngIf="recordToPay">
          <div class="pay-summary">
            <p>Pay <strong>{{ recordToPay.personName }}</strong></p>
            <div class="pay-amount">{{ recordToPay.netAmount | number }} RWF</div>
          </div>
          <div class="form-group">
            <label>Payment Method</label>
            <select [(ngModel)]="paymentMethod">
              <option value="bank">Bank Transfer</option>
              <option value="mobile">Mobile Money</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closePayModal()">Cancel</button>
          <button class="btn-primary" (click)="processPayment()">
            <app-lucide-icon name="check" size="16px"></app-lucide-icon>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./payroll-processing.component.scss']
})
export class PayrollProcessingComponent implements OnInit {
  payrollRecords: PayrollRecord[] = [];
  filteredRecords: PayrollRecord[] = [];
  employees: (Employee & { selected?: boolean })[] = [];
  
  selectedPeriod = '';
  selectedType = '';
  selectedStatus = '';
  
  showGenerateModal = false;
  showViewModal = false;
  showPayModal = false;
  
  generateType = 'employee';
  generatePeriod = '';
  
  selectedRecord: PayrollRecord | null = null;
  recordToPay: PayrollRecord | null = null;
  paymentMethod: 'bank' | 'cash' | 'mobile' = 'bank';

  constructor(private payrollService: PayrollService) {}

  ngOnInit() {
    const now = new Date();
    this.selectedPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    this.generatePeriod = this.selectedPeriod;
    this.loadData();
  }

  loadData() {
    this.payrollRecords = this.payrollService.getPayrollRecords();
    this.employees = this.payrollService.getEmployees().map(e => ({ ...e, selected: false }));
    this.filterRecords();
  }

  get pendingCount(): number {
    return this.payrollRecords.filter(r => r.status === 'draft').length;
  }

  get approvedCount(): number {
    return this.payrollRecords.filter(r => r.status === 'approved').length;
  }

  get paidCount(): number {
    return this.payrollRecords.filter(r => r.status === 'paid' && r.period === this.selectedPeriod).length;
  }

  get totalPending(): number {
    return this.payrollRecords
      .filter(r => r.status !== 'paid')
      .reduce((sum, r) => sum + r.netAmount, 0);
  }

  get selectedEmployeesCount(): number {
    return this.employees.filter(e => e.selected).length;
  }

  get selectedTotalGross(): number {
    return this.employees.filter(e => e.selected).reduce((sum, e) => sum + e.baseSalary, 0);
  }

  filterRecords() {
    this.filteredRecords = this.payrollRecords.filter(record => {
      const matchesPeriod = !this.selectedPeriod || record.period === this.selectedPeriod;
      const matchesType = !this.selectedType || record.personType === this.selectedType;
      const matchesStatus = !this.selectedStatus || record.status === this.selectedStatus;
      return matchesPeriod && matchesType && matchesStatus;
    });
  }

  openGenerateModal() {
    this.showGenerateModal = true;
  }

  closeGenerateModal() {
    this.showGenerateModal = false;
    this.employees.forEach(e => e.selected = false);
  }

  selectAllEmployees() {
    const allSelected = this.employees.every(e => e.selected);
    this.employees.forEach(e => e.selected = !allSelected);
  }

  generatePayroll() {
    const selectedEmps = this.employees.filter(e => e.selected);
    const [year, month] = this.generatePeriod.split('-').map(Number);
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0);

    selectedEmps.forEach(emp => {
      this.payrollService.generatePayroll(
        emp.id,
        'employee',
        this.generatePeriod,
        periodStart,
        periodEnd,
        emp.baseSalary
      );
    });

    this.loadData();
    this.closeGenerateModal();
  }

  viewRecord(record: PayrollRecord) {
    this.selectedRecord = record;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedRecord = null;
  }

  approveRecord(record: PayrollRecord) {
    this.payrollService.approvePayroll(record.id, 'Current User');
    this.loadData();
  }

  openPayModal(record: PayrollRecord) {
    this.recordToPay = record;
    this.showPayModal = true;
  }

  closePayModal() {
    this.showPayModal = false;
    this.recordToPay = null;
  }

  processPayment() {
    if (this.recordToPay) {
      this.payrollService.processPayment(this.recordToPay.id, this.paymentMethod);
      this.loadData();
      this.closePayModal();
    }
  }
}

