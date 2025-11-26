import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../services/payroll.service';
import { Advance, ProductDebt, Employee } from '../models/payroll.models';
import { InventoryService } from '../../inventory/services/inventory.service';
import { InventoryItem } from '../../inventory/models/inventory.models';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-advances',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <div class="advances-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Advances & Debts</h1>
          <p class="page-description">Manage employee advances and product debts</p>
        </div>
        <div class="header-actions">
          <button class="btn-outline" (click)="openProductDebtModal()">
            <app-lucide-icon name="package" size="16px"></app-lucide-icon>
            Record Product Debt
          </button>
          <button class="btn-primary" (click)="openAdvanceModal()">
            <app-lucide-icon name="plus" size="16px"></app-lucide-icon>
            Record Advance
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon advances">
            <app-lucide-icon name="dollar-sign" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalAdvances | number }}</span>
            <span class="stat-label">Pending Advances (RWF)</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon debts">
            <app-lucide-icon name="package" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalDebts | number }}</span>
            <span class="stat-label">Product Debts (RWF)</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total">
            <app-lucide-icon name="alert-circle" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalAdvances + totalDebts | number }}</span>
            <span class="stat-label">Total Outstanding (RWF)</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'advances'" (click)="activeTab = 'advances'">
          Advances ({{ pendingAdvances.length }})
        </button>
        <button class="tab" [class.active]="activeTab === 'debts'" (click)="activeTab = 'debts'">
          Product Debts ({{ pendingDebts.length }})
        </button>
      </div>

      <!-- Advances List -->
      <div class="card" *ngIf="activeTab === 'advances'">
        <div class="card-body">
          <div class="table-responsive" *ngIf="pendingAdvances.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Original Amount</th>
                  <th>Remaining</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let advance of pendingAdvances">
                  <td class="person-cell">
                    <span class="name">{{ advance.personName }}</span>
                  </td>
                  <td>
                    <span class="type-badge" [class]="advance.personType">
                      {{ advance.personType }}
                    </span>
                  </td>
                  <td>{{ advance.amount | number }}</td>
                  <td class="remaining">{{ advance.remainingBalance | number }}</td>
                  <td class="reason">{{ advance.reason }}</td>
                  <td>{{ advance.date | date:'mediumDate' }}</td>
                  <td>
                    <span class="status-badge" [class]="advance.status">
                      {{ advance.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" *ngIf="pendingAdvances.length === 0">
            <app-lucide-icon name="check-circle" size="48px"></app-lucide-icon>
            <h4>No pending advances</h4>
            <p>All advances have been cleared</p>
          </div>
        </div>
      </div>

      <!-- Product Debts List -->
      <div class="card" *ngIf="activeTab === 'debts'">
        <div class="card-body">
          <div class="table-responsive" *ngIf="pendingDebts.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Type</th>
                  <th>Products</th>
                  <th>Total Amount</th>
                  <th>Remaining</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let debt of pendingDebts">
                  <td class="person-cell">
                    <span class="name">{{ debt.personName }}</span>
                  </td>
                  <td>
                    <span class="type-badge" [class]="debt.personType">
                      {{ debt.personType }}
                    </span>
                  </td>
                  <td class="products-cell">
                    <span class="product-count">{{ debt.products.length }} items</span>
                    <span class="product-list">
                      {{ getProductNames(debt) }}
                    </span>
                  </td>
                  <td>{{ debt.totalAmount | number }}</td>
                  <td class="remaining">{{ debt.remainingBalance | number }}</td>
                  <td>{{ debt.date | date:'mediumDate' }}</td>
                  <td>
                    <span class="status-badge" [class]="debt.status">
                      {{ debt.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" *ngIf="pendingDebts.length === 0">
            <app-lucide-icon name="check-circle" size="48px"></app-lucide-icon>
            <h4>No pending product debts</h4>
            <p>All product debts have been cleared</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Record Advance Modal -->
    <div class="modal-overlay" *ngIf="showAdvanceModal" (click)="closeAdvanceModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Record Advance</h2>
          <button class="close-btn" (click)="closeAdvanceModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>
        <form (ngSubmit)="saveAdvance()">
          <div class="modal-body">
            <div class="form-group">
              <label>Person Type *</label>
              <select [(ngModel)]="newAdvance.personType" name="personType" (change)="onPersonTypeChange()">
                <option value="employee">Employee</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
            <div class="form-group">
              <label>Select {{ newAdvance.personType | titlecase }} *</label>
              <select [(ngModel)]="newAdvance.personId" name="personId" (change)="onPersonSelect()">
                <option value="">Select...</option>
                <option *ngFor="let emp of employees" [value]="emp.id">{{ emp.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Amount (RWF) *</label>
              <input type="number" [(ngModel)]="newAdvance.amount" name="amount" required min="1">
            </div>
            <div class="form-group">
              <label>Reason *</label>
              <textarea [(ngModel)]="newAdvance.reason" name="reason" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" [(ngModel)]="advanceDateStr" name="date">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="closeAdvanceModal()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="!newAdvance.personId || !newAdvance.amount">
              Record Advance
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Record Product Debt Modal -->
    <div class="modal-overlay" *ngIf="showDebtModal" (click)="closeDebtModal()">
      <div class="modal-container debt-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Record Product Debt</h2>
          <button class="close-btn" (click)="closeDebtModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>
        <form (ngSubmit)="saveProductDebt()">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Person Type *</label>
                <select [(ngModel)]="newDebt.personType" name="personType" (change)="onDebtPersonTypeChange()">
                  <option value="employee">Employee</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
              <div class="form-group">
                <label>Select {{ newDebt.personType | titlecase }} *</label>
                <select [(ngModel)]="newDebt.personId" name="personId" (change)="onDebtPersonSelect()">
                  <option value="">Select...</option>
                  <option *ngFor="let emp of employees" [value]="emp.id">{{ emp.name }}</option>
                </select>
              </div>
            </div>

            <div class="products-section">
              <label>Products</label>
              <div class="product-row" *ngFor="let product of debtProducts; let i = index">
                <input type="text" [(ngModel)]="product.productName" [name]="'productName' + i" placeholder="Product name">
                <input type="number" [(ngModel)]="product.quantity" [name]="'quantity' + i" placeholder="Qty" min="1">
                <input type="number" [(ngModel)]="product.unitPrice" [name]="'unitPrice' + i" placeholder="Unit price">
                <span class="product-total">{{ (product.quantity || 0) * (product.unitPrice || 0) | number }}</span>
                <button type="button" class="remove-btn" (click)="removeProduct(i)" *ngIf="debtProducts.length > 1">
                  <app-lucide-icon name="x" size="14px"></app-lucide-icon>
                </button>
              </div>
              <button type="button" class="btn-link" (click)="addProduct()">
                <app-lucide-icon name="plus" size="14px"></app-lucide-icon>
                Add Product
              </button>
            </div>

            <div class="debt-total">
              <span>Total:</span>
              <span class="amount">{{ calculateDebtTotal() | number }} RWF</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="closeDebtModal()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="!newDebt.personId || calculateDebtTotal() === 0">
              Record Debt
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./advances.component.scss']
})
export class AdvancesComponent implements OnInit {
  advances: Advance[] = [];
  productDebts: ProductDebt[] = [];
  employees: Employee[] = [];
  
  activeTab: 'advances' | 'debts' = 'advances';
  
  showAdvanceModal = false;
  showDebtModal = false;
  
  newAdvance: Partial<Advance> = { personType: 'employee' };
  advanceDateStr = '';
  
  newDebt: Partial<ProductDebt> = { personType: 'employee' };
  debtProducts: { productName: string; quantity: number; unitPrice: number }[] = [
    { productName: '', quantity: 1, unitPrice: 0 }
  ];

  constructor(private payrollService: PayrollService) {}

  ngOnInit() {
    this.loadData();
    this.advanceDateStr = new Date().toISOString().split('T')[0];
  }

  loadData() {
    this.advances = this.payrollService.getAdvances();
    this.productDebts = this.payrollService.getProductDebts();
    this.employees = this.payrollService.getEmployees();
  }

  get pendingAdvances(): Advance[] {
    return this.advances.filter(a => a.status !== 'cleared');
  }

  get pendingDebts(): ProductDebt[] {
    return this.productDebts.filter(d => d.status !== 'cleared');
  }

  get totalAdvances(): number {
    return this.pendingAdvances.reduce((sum, a) => sum + a.remainingBalance, 0);
  }

  get totalDebts(): number {
    return this.pendingDebts.reduce((sum, d) => sum + d.remainingBalance, 0);
  }

  getProductNames(debt: ProductDebt): string {
    return debt.products.map(p => p.productName).join(', ');
  }

  // Advance Modal
  openAdvanceModal() {
    this.newAdvance = { personType: 'employee' };
    this.advanceDateStr = new Date().toISOString().split('T')[0];
    this.showAdvanceModal = true;
  }

  closeAdvanceModal() {
    this.showAdvanceModal = false;
  }

  onPersonTypeChange() {
    this.newAdvance.personId = '';
    this.newAdvance.personName = '';
  }

  onPersonSelect() {
    const person = this.employees.find(e => e.id === this.newAdvance.personId);
    if (person) {
      this.newAdvance.personName = person.name;
    }
  }

  saveAdvance() {
    this.payrollService.addAdvance({
      personId: this.newAdvance.personId!,
      personName: this.newAdvance.personName!,
      personType: this.newAdvance.personType as 'employee' | 'supplier',
      amount: this.newAdvance.amount!,
      remainingBalance: this.newAdvance.amount!,
      reason: this.newAdvance.reason!,
      date: new Date(this.advanceDateStr)
    });
    this.loadData();
    this.closeAdvanceModal();
  }

  // Product Debt Modal
  openProductDebtModal() {
    this.newDebt = { personType: 'employee' };
    this.debtProducts = [{ productName: '', quantity: 1, unitPrice: 0 }];
    this.showDebtModal = true;
  }

  closeDebtModal() {
    this.showDebtModal = false;
  }

  onDebtPersonTypeChange() {
    this.newDebt.personId = '';
    this.newDebt.personName = '';
  }

  onDebtPersonSelect() {
    const person = this.employees.find(e => e.id === this.newDebt.personId);
    if (person) {
      this.newDebt.personName = person.name;
    }
  }

  addProduct() {
    this.debtProducts.push({ productName: '', quantity: 1, unitPrice: 0 });
  }

  removeProduct(index: number) {
    this.debtProducts.splice(index, 1);
  }

  calculateDebtTotal(): number {
    return this.debtProducts.reduce((sum, p) => sum + (p.quantity || 0) * (p.unitPrice || 0), 0);
  }

  saveProductDebt() {
    const products = this.debtProducts
      .filter(p => p.productName && p.quantity > 0)
      .map(p => ({
        productName: p.productName,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        totalPrice: p.quantity * p.unitPrice
      }));

    const totalAmount = products.reduce((sum, p) => sum + p.totalPrice, 0);

    this.payrollService.addProductDebt({
      personId: this.newDebt.personId!,
      personName: this.newDebt.personName!,
      personType: this.newDebt.personType as 'employee' | 'supplier',
      products,
      totalAmount,
      remainingBalance: totalAmount,
      date: new Date()
    });

    this.loadData();
    this.closeDebtModal();
  }
}

