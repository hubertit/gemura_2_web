import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FeatherIconComponent } from '../../../shared/components/feather-icon/feather-icon.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { AddCustomerModalComponent } from '../../../shared/components/add-customer-modal/add-customer-modal.component';
import { CustomerService, Customer } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FeatherIconComponent, DataTableComponent, AddCustomerModalComponent],
  template: `
    <div class="customers-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Customers</h1>
          <p class="page-description">Manage your customer database and track sales</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openAddCustomerModal()">
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
        </div>
        <div class="card-body">
          <app-data-table
            [columns]="columns"
            [data]="filteredCustomers"
            [striped]="true"
            [hover]="true"
            (onSort)="handleSort($event)"
            (onPageChange)="handlePageChange($event)"
            (onPageSizeChange)="handlePageSizeChange($event)">
          </app-data-table>
        </div>
      </div>

      <!-- Add Customer Modal -->
      <app-add-customer-modal 
        *ngIf="showAddCustomerModal"
        (customerAdded)="onCustomerAdded($event)"
        (modalClosed)="closeAddCustomerModal()">
      </app-add-customer-modal>
    </div>
  `,
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  stats: any = {};
  showAddCustomerModal = false;

  columns: any[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadCustomers();
    this.loadStats();
  }

  initializeColumns() {
    this.columns = [
      { key: 'name', title: 'Customer', type: 'text', sortable: true },
      { key: 'customerType', title: 'Type', type: 'text', sortable: true },
      { key: 'phone', title: 'Phone', type: 'text', sortable: true },
      { key: 'email', title: 'Email', type: 'text', sortable: true },
      { key: 'city', title: 'Location', type: 'text', sortable: true },
      { key: 'status', title: 'Status', type: 'text', sortable: true },
      { key: 'totalPurchases', title: 'Orders', type: 'number', sortable: true },
      { key: 'totalAmount', title: 'Total Spent', type: 'number', sortable: true },
      { key: 'lastPurchaseDate', title: 'Last Purchase', type: 'date', sortable: true }
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
    this.filteredCustomers = [...this.customers];
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    // TODO: Implement sorting
    console.log('Sort:', event);
  }


  handlePageChange(page: number) {
    // TODO: Implement pagination
    console.log('Page:', page);
  }

  handlePageSizeChange(size: number) {
    // TODO: Implement page size change
    console.log('Page size:', size);
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


  // Modal methods
  openAddCustomerModal() {
    this.showAddCustomerModal = true;
  }

  closeAddCustomerModal() {
    this.showAddCustomerModal = false;
  }

  onCustomerAdded(customerData: any) {
    // Call API to create customer
    this.customerService.addCustomer({
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      address: customerData.address,
      pricePerLiter: customerData.pricePerLiter
    }).subscribe({
      next: (response) => {
        console.log('Customer created successfully:', response);
        // Reload customers from API
        this.loadCustomers();
        this.loadStats();
      },
      error: (error) => {
        console.error('Failed to create customer:', error);
        // You might want to show an error message to the user
      }
    });
  }
}
