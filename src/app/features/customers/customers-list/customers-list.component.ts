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
            <app-feather-icon name="dollar-sign" size="24px"></app-feather-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(stats.averagePrice) }}</div>
            <div class="stat-label">Avg Price/Liter</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <app-feather-icon name="trending-up" size="24px"></app-feather-icon>
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
            [showActions]="false"
            [showPagination]="true"
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [totalPages]="totalPages"
            [totalItems]="customers.length"
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
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadCustomers();
    this.loadStats();
    
    // Reload customers from API if token is available
    this.customerService.reloadCustomers();
    
    // Load customers from API after a short delay to ensure service is ready
    setTimeout(() => {
      this.customerService.getCustomersFromAPI().subscribe({
        next: (response) => {
          console.log('✅ API Load Successful:', response);
          this.loadCustomers();
          this.loadStats();
        },
        error: (error) => {
          console.error('❌ API Load Failed:', error);
          console.log('Using mock data instead');
        }
      });
    }, 100);
  }

  initializeColumns() {
    this.columns = [
      { key: 'index', title: 'No.', type: 'number', sortable: false },
      { key: 'name', title: 'Customer', type: 'text', sortable: true },
      { key: 'phone', title: 'Phone', type: 'text', sortable: true },
      { key: 'address', title: 'Address', type: 'text', sortable: true },
      { key: 'pricePerLiter', title: 'Price/Liter (RWF)', type: 'number', sortable: true },
      { key: 'averageSupplyQuantity', title: 'Avg Supply (L)', type: 'number', sortable: true },
      { key: 'status', title: 'Status', type: 'status', sortable: true },
      { key: 'registrationDate', title: 'Registered', type: 'date', sortable: true }
    ];
  }

  loadCustomers() {
    this.customers = this.customerService.getCustomers();
    // Add index to each customer for the No. column
    this.customers = this.customers.map((customer, index) => ({
      ...customer,
      index: index + 1
    }));
    this.filteredCustomers = [...this.customers];
  }

  loadStats() {
    const customers = this.customerService.getCustomers();
    this.stats = {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.status === 'Active').length,
      totalRevenue: customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
      averagePrice: customers.length > 0 ? customers.reduce((sum, c) => sum + (c.pricePerLiter || 0), 0) / customers.length : 0
    };
  }

  filterCustomers() {
    this.filteredCustomers = [...this.customers];
    // Re-index filtered customers
    this.filteredCustomers = this.filteredCustomers.map((customer, index) => ({
      ...customer,
      index: index + 1
    }));
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    // TODO: Implement sorting
    console.log('Sort:', event);
  }

  handlePageChange(page: number) {
    this.currentPage = page;
  }

  handlePageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
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
