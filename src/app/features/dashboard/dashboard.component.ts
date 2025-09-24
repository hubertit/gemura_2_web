import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';

interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'individual' | 'joint';
  status: 'active' | 'inactive';
  isDefault: boolean;
  owners: string[];
}

interface OverviewMetrics {
  collections: {
    liters: number;
    value: number;
    transactions: number;
  };
  sales: {
    liters: number;
    value: number;
    transactions: number;
  };
  suppliers: {
    active: number;
    inactive: number;
  };
  customers: {
    active: number;
    inactive: number;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome back!</h1>
          <p class="welcome-subtitle">Manage your dairy farming business</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-outline" (click)="refreshData()">
            <i-feather name="refresh-cw" class="icon-sm"></i-feather>
            Refresh
          </button>
        </div>
      </div>

      <!-- Wallet Cards Section -->
      <div class="wallet-section">
        <h2 class="section-title">Your Ikofi</h2>
        <div class="wallet-cards" *ngIf="wallets.length > 0; else noWallets">
          <div class="wallet-card" *ngFor="let wallet of wallets; let i = index" 
               [class.active]="wallet.isDefault"
               (click)="navigateToTransactions(wallet)">
            <div class="wallet-header">
              <div class="wallet-info">
                <h3 class="wallet-name">{{ wallet.name }}</h3>
                <p class="wallet-type">{{ wallet.type | titlecase }}</p>
              </div>
              <button class="balance-toggle" (click)="toggleBalanceVisibility(wallet.id, $event)">
                <i-feather [name]="walletBalanceVisibility[wallet.id] ? 'eye' : 'eye-off'" class="icon-sm"></i-feather>
              </button>
            </div>
            <div class="wallet-balance">
              <span class="balance-amount" *ngIf="walletBalanceVisibility[wallet.id]">
                {{ formatCurrency(wallet.balance) }} {{ wallet.currency }}
              </span>
              <span class="balance-hidden" *ngIf="!walletBalanceVisibility[wallet.id]">
                ••••• {{ wallet.currency }}
              </span>
            </div>
            <div class="wallet-status">
              <span class="status-badge" [class.active]="wallet.status === 'active'">
                {{ wallet.status | titlecase }}
              </span>
            </div>
          </div>
        </div>
        <ng-template #noWallets>
          <div class="no-wallets">
            <i-feather name="wallet" class="icon-lg"></i-feather>
            <p>No wallets available</p>
          </div>
        </ng-template>
      </div>

      <!-- Quick Actions Section -->
      <div class="quick-actions-section">
        <div class="quick-actions-grid">
          <button class="quick-action-btn" (click)="navigateToCollect()">
            <i-feather name="truck" class="icon-md"></i-feather>
            <span>Collect</span>
          </button>
          <button class="quick-action-btn" (click)="navigateToSell()">
            <i-feather name="shopping-cart" class="icon-md"></i-feather>
            <span>Sell</span>
          </button>
          <button class="quick-action-btn" (click)="navigateToSuppliers()">
            <i-feather name="user-plus" class="icon-md"></i-feather>
            <span>Supplier</span>
          </button>
          <button class="quick-action-btn" (click)="navigateToCustomers()">
            <i-feather name="users" class="icon-md"></i-feather>
            <span>Customer</span>
          </button>
        </div>
      </div>

      <!-- Overview Metrics Section -->
      <div class="overview-section">
        <div class="overview-header">
          <h2 class="section-title">
            <i-feather name="bar-chart-2" class="icon-sm"></i-feather>
            Overview
          </h2>
        </div>
        
        <div class="metrics-grid" *ngIf="overviewMetrics; else loadingMetrics">
          <!-- Collections Metric -->
          <div class="metric-card" (click)="navigateToCollections()">
            <div class="metric-header">
              <i-feather name="truck" class="icon-sm metric-icon"></i-feather>
              <span class="metric-title">Collections</span>
            </div>
            <div class="metric-value">{{ formatNumber(overviewMetrics.collections.liters) }} L</div>
            <div class="metric-details">
              {{ formatCurrency(overviewMetrics.collections.value) }} • {{ overviewMetrics.collections.transactions }} txns
            </div>
          </div>

          <!-- Sales Metric -->
          <div class="metric-card" (click)="navigateToSales()">
            <div class="metric-header">
              <i-feather name="shopping-cart" class="icon-sm metric-icon"></i-feather>
              <span class="metric-title">Sales</span>
            </div>
            <div class="metric-value">{{ formatNumber(overviewMetrics.sales.liters) }} L</div>
            <div class="metric-details">
              {{ formatCurrency(overviewMetrics.sales.value) }} • {{ overviewMetrics.sales.transactions }} txns
            </div>
          </div>

          <!-- Suppliers Metric -->
          <div class="metric-card" (click)="navigateToSuppliers()">
            <div class="metric-header">
              <i-feather name="user-plus" class="icon-sm metric-icon"></i-feather>
              <span class="metric-title">Suppliers</span>
            </div>
            <div class="metric-value">{{ overviewMetrics.suppliers.active }}</div>
            <div class="metric-details">
              {{ overviewMetrics.suppliers.inactive }} inactive
            </div>
          </div>

          <!-- Customers Metric -->
          <div class="metric-card" (click)="navigateToCustomers()">
            <div class="metric-header">
              <i-feather name="users" class="icon-sm metric-icon"></i-feather>
              <span class="metric-title">Customers</span>
            </div>
            <div class="metric-value">{{ overviewMetrics.customers.active }}</div>
            <div class="metric-details">
              {{ overviewMetrics.customers.inactive }} inactive
            </div>
          </div>
        </div>

        <ng-template #loadingMetrics>
          <div class="loading-metrics">
            <div class="loading-spinner"></div>
            <p>Loading overview data...</p>
          </div>
        </ng-template>
      </div>

      <!-- Recent Activity Section -->
      <div class="recent-activity-section">
        <h2 class="section-title">Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let activity of recentActivities">
            <div class="activity-icon">
              <i-feather [name]="activity.icon" class="icon-sm"></i-feather>
            </div>
            <div class="activity-content">
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
            <div class="activity-amount" *ngIf="activity.amount">
              {{ formatCurrency(activity.amount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  wallets: Wallet[] = [];
  walletBalanceVisibility: { [key: string]: boolean } = {};
  overviewMetrics: OverviewMetrics | null = null;
  recentActivities: any[] = [];
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Mock data - replace with actual API calls
    this.wallets = [
      {
        id: 'WALLET-1',
        name: 'Main Ikofi',
        balance: 250000,
        currency: 'RWF',
        type: 'individual',
        status: 'active',
        isDefault: true,
        owners: ['You']
      },
      {
        id: 'WALLET-2',
        name: 'Joint Ikofi',
        balance: 1200000,
        currency: 'RWF',
        type: 'joint',
        status: 'active',
        isDefault: false,
        owners: ['You', 'Alice', 'Eric']
      }
    ];

    this.overviewMetrics = {
      collections: {
        liters: 1250.5,
        value: 187500,
        transactions: 45
      },
      sales: {
        liters: 980.2,
        value: 147000,
        transactions: 32
      },
      suppliers: {
        active: 12,
        inactive: 3
      },
      customers: {
        active: 28,
        inactive: 5
      }
    };

    this.recentActivities = [
      {
        icon: 'truck',
        title: 'Milk collection from John Doe',
        time: '2 hours ago',
        amount: 15000
      },
      {
        icon: 'shopping-cart',
        title: 'Milk sale to ABC Store',
        time: '4 hours ago',
        amount: 25000
      },
      {
        icon: 'user-plus',
        title: 'New supplier registered',
        time: '1 day ago',
        amount: null
      },
      {
        icon: 'users',
        title: 'New customer added',
        time: '2 days ago',
        amount: null
      }
    ];

    // Initialize balance visibility
    this.wallets.forEach(wallet => {
      this.walletBalanceVisibility[wallet.id] = true;
    });

    this.isLoading = false;
  }

  refreshData() {
    this.loadDashboardData();
  }

  toggleBalanceVisibility(walletId: string, event: Event) {
    event.stopPropagation();
    this.walletBalanceVisibility[walletId] = !this.walletBalanceVisibility[walletId];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-RW', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  }

  // Navigation methods
  navigateToTransactions(wallet: Wallet) {
    // Navigate to transactions page
    console.log('Navigate to transactions for wallet:', wallet.id);
  }

  navigateToCollect() {
    // Navigate to collect milk page
    console.log('Navigate to collect milk');
  }

  navigateToSell() {
    // Navigate to sell milk page
    console.log('Navigate to sell milk');
  }

  navigateToSuppliers() {
    // Navigate to suppliers page
    console.log('Navigate to suppliers');
  }

  navigateToCustomers() {
    // Navigate to customers page
    console.log('Navigate to customers');
  }

  navigateToCollections() {
    // Navigate to collections page
    console.log('Navigate to collections');
  }

  navigateToSales() {
    // Navigate to sales page
    console.log('Navigate to sales');
  }
}