import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../services/payroll.service';
import { Employee } from '../models/payroll.models';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent, DataTableComponent, SkeletonLoaderComponent],
  template: `
    <div class="employees-container">
      <!-- Skeleton Loader -->
      <ng-container *ngIf="loading">
        <app-skeleton-loader type="stats"></app-skeleton-loader>
      </ng-container>

      <ng-container *ngIf="!loading">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Employees</h1>
          <p class="page-description">Manage employee records and payroll information</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openAddModal()">
            <app-lucide-icon name="plus" size="16px"></app-lucide-icon>
            Add Employee
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <app-lucide-icon name="users" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ employees.length }}</span>
            <span class="stat-label">Total Employees</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active">
            <app-lucide-icon name="check-circle" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ activeCount }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon payroll">
            <app-lucide-icon name="dollar-sign" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalSalary | number }}</span>
            <span class="stat-label">Monthly Payroll (RWF)</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon dept">
            <app-lucide-icon name="layers" size="20px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ departments.length }}</span>
            <span class="stat-label">Departments</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-section">
        <div class="search-box">
          <app-lucide-icon name="search" size="16px"></app-lucide-icon>
          <input type="text" placeholder="Search employees..." [(ngModel)]="searchTerm" (input)="filterEmployees()">
        </div>
        <div class="filter-group">
          <select [(ngModel)]="selectedDepartment" (change)="filterEmployees()">
            <option value="">All Departments</option>
            <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
          </select>
        </div>
        <div class="filter-group">
          <select [(ngModel)]="selectedStatus" (change)="filterEmployees()">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Employees Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-section">
            <h3>Employee List</h3>
            <span class="item-count">{{ filteredEmployees.length }} employees</span>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive" *ngIf="filteredEmployees.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Salary (RWF)</th>
                  <th>Hire Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let employee of filteredEmployees">
                  <td class="employee-cell">
                    <div class="employee-info">
                      <div class="avatar">{{ getInitials(employee.name) }}</div>
                      <div class="details">
                        <span class="name">{{ employee.name }}</span>
                        <span class="phone">{{ employee.phone }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ employee.role }}</td>
                  <td>
                    <span class="dept-badge">{{ employee.department }}</span>
                  </td>
                  <td class="salary">{{ employee.baseSalary | number }}</td>
                  <td>{{ employee.hireDate | date:'mediumDate' }}</td>
                  <td>
                    <span class="status-badge" [class]="employee.status">
                      {{ employee.status }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button class="action-btn view" (click)="viewEmployee(employee)" title="View">
                      <app-lucide-icon name="eye" size="16px"></app-lucide-icon>
                    </button>
                    <button class="action-btn edit" (click)="editEmployee(employee)" title="Edit">
                      <app-lucide-icon name="edit-2" size="16px"></app-lucide-icon>
                    </button>
                    <button class="action-btn delete" (click)="confirmDelete(employee)" title="Delete">
                      <app-lucide-icon name="trash-2" size="16px"></app-lucide-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="empty-state" *ngIf="filteredEmployees.length === 0">
            <app-lucide-icon name="users" size="48px"></app-lucide-icon>
            <h4>No employees found</h4>
            <p>Add your first employee to get started</p>
          </div>
        </div>
      </div>
      </ng-container>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Employee' : 'Add Employee' }}</h2>
          <button class="close-btn" (click)="closeModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>
        <form (ngSubmit)="saveEmployee()">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" [(ngModel)]="currentEmployee.name" name="name" required>
              </div>
              <div class="form-group">
                <label>Phone *</label>
                <input type="text" [(ngModel)]="currentEmployee.phone" name="phone" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="currentEmployee.email" name="email">
              </div>
              <div class="form-group">
                <label>Role *</label>
                <input type="text" [(ngModel)]="currentEmployee.role" name="role" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Department *</label>
                <input type="text" [(ngModel)]="currentEmployee.department" name="department" required list="departments">
                <datalist id="departments">
                  <option *ngFor="let dept of departments" [value]="dept">
                </datalist>
              </div>
              <div class="form-group">
                <label>Base Salary (RWF) *</label>
                <input type="number" [(ngModel)]="currentEmployee.baseSalary" name="baseSalary" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Bank Name</label>
                <input type="text" [(ngModel)]="currentEmployee.bankName" name="bankName">
              </div>
              <div class="form-group">
                <label>Bank Account</label>
                <input type="text" [(ngModel)]="currentEmployee.bankAccount" name="bankAccount">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Hire Date *</label>
                <input type="date" [(ngModel)]="hireDateStr" name="hireDate" required>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="currentEmployee.status" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">{{ isEditing ? 'Update' : 'Add' }} Employee</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Modal -->
    <div class="modal-overlay" *ngIf="showViewModal" (click)="closeViewModal()">
      <div class="modal-container view-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Employee Details</h2>
          <button class="close-btn" (click)="closeViewModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>
        <div class="modal-body" *ngIf="selectedEmployee">
          <div class="employee-profile">
            <div class="profile-avatar">{{ getInitials(selectedEmployee.name) }}</div>
            <h3>{{ selectedEmployee.name }}</h3>
            <span class="profile-role">{{ selectedEmployee.role }}</span>
            <span class="status-badge" [class]="selectedEmployee.status">{{ selectedEmployee.status }}</span>
          </div>
          
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Phone</span>
              <span class="value">{{ selectedEmployee.phone }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedEmployee.email">
              <span class="label">Email</span>
              <span class="value">{{ selectedEmployee.email }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Department</span>
              <span class="value">{{ selectedEmployee.department }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Base Salary</span>
              <span class="value highlight">{{ selectedEmployee.baseSalary | number }} RWF</span>
            </div>
            <div class="detail-item" *ngIf="selectedEmployee.bankName">
              <span class="label">Bank</span>
              <span class="value">{{ selectedEmployee.bankName }}</span>
            </div>
            <div class="detail-item" *ngIf="selectedEmployee.bankAccount">
              <span class="label">Account</span>
              <span class="value">{{ selectedEmployee.bankAccount }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Hire Date</span>
              <span class="value">{{ selectedEmployee.hireDate | date:'longDate' }}</span>
            </div>
          </div>

          <!-- Pending Deductions -->
          <div class="deductions-section" *ngIf="employeeAdvances.length > 0 || employeeDebts.length > 0">
            <h4>Pending Deductions</h4>
            <div class="deduction-item" *ngFor="let advance of employeeAdvances">
              <div class="deduction-info">
                <span class="type advance">Advance</span>
                <span class="reason">{{ advance.reason }}</span>
              </div>
              <span class="amount">{{ advance.remainingBalance | number }} RWF</span>
            </div>
            <div class="deduction-item" *ngFor="let debt of employeeDebts">
              <div class="deduction-info">
                <span class="type debt">Product Debt</span>
                <span class="reason">{{ debt.products.length }} items</span>
              </div>
              <span class="amount">{{ debt.remainingBalance | number }} RWF</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeViewModal()">Close</button>
          <button class="btn-primary" (click)="editEmployee(selectedEmployee!); closeViewModal()">Edit</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="closeDeleteModal()">
      <div class="modal-container delete-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="warning-icon">
            <app-lucide-icon name="alert-triangle" size="24px"></app-lucide-icon>
          </div>
          <h2>Delete Employee</h2>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ employeeToDelete?.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeDeleteModal()">Cancel</button>
          <button class="btn-danger" (click)="deleteEmployee()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: string[] = [];
  loading = false;
  
  searchTerm = '';
  selectedDepartment = '';
  selectedStatus = '';
  
  showModal = false;
  showViewModal = false;
  showDeleteModal = false;
  isEditing = false;
  
  currentEmployee: Partial<Employee> = {};
  selectedEmployee: Employee | null = null;
  employeeToDelete: Employee | null = null;
  hireDateStr = '';
  
  employeeAdvances: any[] = [];
  employeeDebts: any[] = [];

  constructor(private payrollService: PayrollService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.employees = this.payrollService.getEmployees();
    this.departments = this.payrollService.getDepartments();
    this.filterEmployees();
  }

  get activeCount(): number {
    return this.employees.filter(e => e.status === 'active').length;
  }

  get totalSalary(): number {
    return this.employees
      .filter(e => e.status === 'active')
      .reduce((sum, e) => sum + e.baseSalary, 0);
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchesSearch = !this.searchTerm || 
        emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.phone.includes(this.searchTerm) ||
        emp.role.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDept = !this.selectedDepartment || emp.department === this.selectedDepartment;
      const matchesStatus = !this.selectedStatus || emp.status === this.selectedStatus;
      
      return matchesSearch && matchesDept && matchesStatus;
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  openAddModal() {
    this.isEditing = false;
    this.currentEmployee = { status: 'active' };
    this.hireDateStr = new Date().toISOString().split('T')[0];
    this.showModal = true;
  }

  editEmployee(employee: Employee) {
    this.isEditing = true;
    this.currentEmployee = { ...employee };
    this.hireDateStr = new Date(employee.hireDate).toISOString().split('T')[0];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentEmployee = {};
  }

  saveEmployee() {
    this.currentEmployee.hireDate = new Date(this.hireDateStr);
    
    if (this.isEditing && this.currentEmployee.id) {
      this.payrollService.updateEmployee(this.currentEmployee.id, this.currentEmployee);
    } else {
      this.payrollService.addEmployee(this.currentEmployee as Omit<Employee, 'id' | 'createdAt'>);
    }
    
    this.loadData();
    this.closeModal();
  }

  viewEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.employeeAdvances = this.payrollService.getPendingAdvances(employee.id, 'employee');
    this.employeeDebts = this.payrollService.getPendingProductDebts(employee.id, 'employee');
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedEmployee = null;
  }

  confirmDelete(employee: Employee) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  deleteEmployee() {
    if (this.employeeToDelete) {
      this.payrollService.deleteEmployee(this.employeeToDelete.id);
      this.loadData();
      this.closeDeleteModal();
    }
  }
}

