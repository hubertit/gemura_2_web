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
      <!-- Stats Cards Grid -->
      <div class="stats-grid">
        <!-- Wallet Cards -->
        <div class="stat-card wallet-card" *ngFor="let wallet of wallets; let i = index" 
             [class.active]="wallet.isDefault"
             (click)="navigateToTransactions(wallet)">
          <div class="card-header">
            <div class="card-icon">
              <app-feather-icon name="wallet" class="icon-md"></app-feather-icon>
            </div>
            <button class="balance-toggle" (click)="toggleBalanceVisibility(wallet.id, $event)">
              <app-feather-icon [name]="walletBalanceVisibility[wallet.id] ? 'eye' : 'eye-off'" class="icon-sm"></app-feather-icon>
            </button>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ wallet.name }}</h3>
            <div class="card-value">
              <span *ngIf="walletBalanceVisibility[wallet.id]">
                {{ formatCurrency(wallet.balance) }} {{ wallet.currency }}
              </span>
              <span *ngIf="!walletBalanceVisibility[wallet.id]">
                ••••• {{ wallet.currency }}
              </span>
            </div>
            <div class="card-subtitle">{{ wallet.type | titlecase }} • {{ wallet.status | titlecase }}</div>
        </div>
      </div>

        <!-- Quick Actions Cards -->
        <div class="stat-card action-card" (click)="navigateToCollect()">
          <div class="card-header">
            <div class="card-icon">
              <app-feather-icon name="truck" class="icon-md"></app-feather-icon>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Collect Milk</h3>
            <div class="card-value">Record Collection</div>
            <div class="card-subtitle">From suppliers</div>
          </div>
        </div>

        <div class="stat-card action-card" (click)="navigateToSell()">
          <div class="card-header">
            <div class="card-icon">
              <app-feather-icon name="shopping-cart" class="icon-md"></app-feather-icon>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Sell Milk</h3>
            <div class="card-value">Record Sale</div>
            <div class="card-subtitle">To customers</div>
          </div>
        </div>

        <div class="stat-card action-card" (click)="navigateToSuppliers()">
          <div class="card-header">
            <div class="card-icon">
              <app-feather-icon name="user-plus" class="icon-md"></app-feather-icon>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Suppliers</h3>
            <div class="card-value">{{ overviewMetrics?.suppliers?.active || 0 }}</div>
            <div class="card-subtitle">Active suppliers</div>
          </div>
        </div>

        <div class="stat-card action-card" (click)="navigateToCustomers()">
          <div class="card-header">
            <div class="card-icon">
              <app-feather-icon name="users" class="icon-md"></app-feather-icon>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">Customers</h3>
            <div class="card-value">{{ overviewMetrics?.customers?.active || 0 }}</div>
            <div class="card-subtitle">Active customers</div>
          </div>
        </div>
      </div>

      <!-- Overview Metrics Section -->
      <div class="overview-section">
        <div class="section-header">
          <h2 class="section-title">
            <app-feather-icon name="bar-chart-2" class="icon-sm"></app-feather-icon>
            Business Overview
          </h2>
        </div>
        
        <div class="metrics-grid" *ngIf="overviewMetrics; else loadingMetrics">
          <div class="metric-card" (click)="navigateToCollections()">
            <div class="metric-header">
              <app-feather-icon name="truck" class="metric-icon"></app-feather-icon>
              <span class="metric-title">Collections</span>
            </div>
            <div class="metric-value">{{ formatNumber(overviewMetrics.collections.liters) }} L</div>
            <div class="metric-details">
              {{ formatCurrency(overviewMetrics.collections.value) }} • {{ overviewMetrics.collections.transactions }} txns
            </div>
          </div>

          <div class="metric-card" (click)="navigateToSales()">
            <div class="metric-header">
              <app-feather-icon name="shopping-cart" class="metric-icon"></app-feather-icon>
              <span class="metric-title">Sales</span>
            </div>
            <div class="metric-value">{{ formatNumber(overviewMetrics.sales.liters) }} L</div>
            <div class="metric-details">
              {{ formatCurrency(overviewMetrics.sales.value) }} • {{ overviewMetrics.sales.transactions }} txns
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
        <div class="section-header">
          <h2 class="section-title">Recent Activity</h2>
        </div>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let activity of recentActivities">
            <div class="activity-icon">
              <app-feather-icon [name]="activity.icon" class="icon-sm"></app-feather-icon>
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