import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FeatherIconComponent } from '../../../shared/components/feather-icon/feather-icon.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { CustomerService, Customer } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FeatherIconComponent, DataTableComponent],
  template: `
    <div class="customers-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Customers</h1>
          <p class="page-description">Manage your customer database and track sales</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="exportCustomers()">
            <app-feather-icon name="download" size="16px"></app-feather-icon>
            Export
          </button>
          <button class="btn-primary" routerLink="/customers/add">
            <app-feather-icon name="plus" size="16px"></app-feather-icon>
            Add Customer
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <app-feather-icon name="users" size="24px"></app-feather-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalCustomers }}</div>
            <div class="stat-label">Total Customers</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <app-feather-icon name="user-check" size="24px"></app-feather-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.activeCustomers }}</div>
            <div class="stat-label">Active Customers</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <app-feather-icon name="shopping-cart" size="24px"></app-feather-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalSales }}</div>
            <div class="stat-label">Total Sales</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <app-feather-icon name="dollar-sign" size="24px"></app-feather-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-section">
            <h3>All Customers</h3>
            <span class="customer-count">{{ customers.length }} customers</span>
          </div>
          <div class="card-actions">
            <div class="search-box">
              <app-feather-icon name="search" size="16px"></app-feather-icon>
              <input 
                type="text" 
                placeholder="Search customers..." 
                [(ngModel)]="searchTerm"
                (input)="filterCustomers()"
                class="search-input">
            </div>
            <div class="filter-dropdown">
              <select [(ngModel)]="statusFilter" (change)="filterCustomers()" class="filter-select">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          <app-data-table
            [columns]="columns"
            [data]="filteredCustomers"
            [striped]="true"
            [hover]="true"
            (onSort)="handleSort($event)"
            (onSearch)="handleSearch($event)"
            (onPageChange)="handlePageChange($event)"
            (onPageSizeChange)="handlePageSizeChange($event)">
          </app-data-table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  statusFilter = '';
  stats: any = {};

  columns: any[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadCustomers();
    this.loadStats();
  }

  initializeColumns() {
    this.columns = [
      { key: 'name', title: 'Customer', type: 'custom', sortable: true, template: this.customerTemplate },
      { key: 'customerType', title: 'Type', type: 'custom', sortable: true, template: this.typeTemplate },
      { key: 'phone', title: 'Phone', type: 'text', sortable: true },
      { key: 'email', title: 'Email', type: 'text', sortable: true },
      { key: 'city', title: 'Location', type: 'text', sortable: true },
      { key: 'status', title: 'Status', type: 'custom', sortable: true, template: this.statusTemplate },
      { key: 'totalPurchases', title: 'Orders', type: 'number', sortable: true },
      { key: 'totalAmount', title: 'Total Spent', type: 'custom', sortable: true, template: this.amountTemplate },
      { key: 'lastPurchaseDate', title: 'Last Purchase', type: 'date', sortable: true },
      { key: 'actions', title: 'Actions', type: 'custom', template: this.actionsTemplate }
    ];
  }

  loadCustomers() {
    this.customers = this.customerService.getCustomers();
    this.filteredCustomers = [...this.customers];
  }

  loadStats() {
    this.stats = this.customerService.getCustomerStats();
  }

  filterCustomers() {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearch = !this.searchTerm || 
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phone.includes(this.searchTerm);
      
      const matchesStatus = !this.statusFilter || customer.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    // TODO: Implement sorting
    console.log('Sort:', event);
  }

  handleSearch(term: string) {
    this.searchTerm = term;
    this.filterCustomers();
  }

  handlePageChange(page: number) {
    // TODO: Implement pagination
    console.log('Page:', page);
  }

  handlePageSizeChange(size: number) {
    // TODO: Implement page size change
    console.log('Page size:', size);
  }

  exportCustomers() {
    // TODO: Implement export functionality
    console.log('Export customers');
  }

  viewCustomer(customer: Customer) {
    // TODO: Navigate to customer details
    console.log('View customer:', customer);
  }

  editCustomer(customer: Customer) {
    // TODO: Navigate to edit customer
    console.log('Edit customer:', customer);
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.customerService.deleteCustomer(customer.id);
      this.loadCustomers();
      this.loadStats();
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  // Template functions
  customerTemplate = (customer: Customer) => `
    <div class="customer-info">
      <img src="${customer.avatar || 'assets/img/user.png'}" alt="${customer.name}" class="customer-avatar">
      <div class="customer-details">
        <div class="customer-name">${customer.name}</div>
        <div class="customer-id">ID: ${customer.id}</div>
      </div>
    </div>
  `;

  typeTemplate = (customer: Customer) => `
    <span class="customer-type ${customer.customerType.toLowerCase()}">${customer.customerType}</span>
  `;

  statusTemplate = (customer: Customer) => `
    <span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span>
  `;

  amountTemplate = (customer: Customer) => `
    <div class="amount">${this.formatCurrency(customer.totalAmount)}</div>
  `;

  actionsTemplate = (customer: Customer) => `
    <div class="action-buttons">
      <button class="btn-icon" title="View" (click)="viewCustomer(customer)">
        <app-feather-icon name="eye" size="16px"></app-feather-icon>
      </button>
      <button class="btn-icon" title="Edit" (click)="editCustomer(customer)">
        <app-feather-icon name="edit" size="16px"></app-feather-icon>
      </button>
      <button class="btn-icon danger" title="Delete" (click)="deleteCustomer(customer)">
        <app-feather-icon name="trash-2" size="16px"></app-feather-icon>
      </button>
    </div>
  `;
}
