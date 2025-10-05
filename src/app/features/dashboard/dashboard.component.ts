import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService, DashboardOverview, Wallet } from '../../core/services/dashboard.service';
import { NavigationService } from '../../core/services/navigation.service';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexPlotOptions,
  ChartComponent
} from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

export interface ChartOptions {
  plotOptions?: ApexPlotOptions;
  markers?: any;
  grid?: any;
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  labels?: string[];
  legend?: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent, NgApexchartsModule],
  template: `
    <div class="dashboard-container">
      <!-- Wallet Cards Section (matching mobile app) -->
      <div class="wallets-section" *ngIf="wallets.length > 0">
        <div class="wallets-carousel">
          <div class="wallet-card" *ngFor="let wallet of wallets; let i = index" 
               [class.active]="i === 0"
               (click)="navigateToWallet(wallet)">
            <div class="wallet-header">
              <div class="wallet-name">{{ wallet.name }}</div>
              <div class="wallet-type">{{ wallet.type }}</div>
            </div>
            <div class="wallet-balance">
              <div class="balance-label">Balance</div>
              <div class="balance-amount" [class.hidden]="!walletBalanceVisibility[wallet.id]">
                {{ formatCurrency(wallet.balance) }}
              </div>
              <div class="balance-amount hidden" *ngIf="!walletBalanceVisibility[wallet.id]">
                ••••••
              </div>
            </div>
            <div class="wallet-status" [class]="wallet.status">
              {{ wallet.status }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions (matching mobile app) -->
      <div class="quick-actions">
        <div class="actions-container">
          <button class="action-btn" (click)="quickAction('collect')">
            <div class="action-icon">
              <app-feather-icon name="truck" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">Collect</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('sell')">
            <div class="action-icon">
              <app-feather-icon name="shopping-cart" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">Sell</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('supplier')">
            <div class="action-icon">
              <app-feather-icon name="user-plus" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">Supplier</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('customer')">
            <div class="action-icon">
              <app-feather-icon name="users" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">Customer</span>
          </button>
        </div>
      </div>

      <!-- Overview Metrics (matching mobile app) -->
      <div class="overview-section" *ngIf="overview">
        <div class="overview-header">
          <div class="overview-title">
            <app-feather-icon name="bar-chart-2" size="20px"></app-feather-icon>
            <span>Overview</span>
          </div>
        </div>
        
        <div class="metrics-grid">
          <!-- Collections Metric -->
          <div class="metric-card collections" (click)="navigateToCollections()">
            <div class="metric-header">
              <div class="metric-title">Collections</div>
              <app-feather-icon name="truck" size="16px"></app-feather-icon>
            </div>
            <div class="metric-value">{{ formatNumber(overview.summary.collection.liters) }} L</div>
            <div class="metric-details">
              {{ formatCurrency(overview.summary.collection.value) }} • {{ overview.summary.collection.transactions }} txns
            </div>
          </div>

          <!-- Sales Metric -->
          <div class="metric-card sales" (click)="navigateToSales()">
            <div class="metric-header">
              <div class="metric-title">Sales</div>
              <app-feather-icon name="shopping-cart" size="16px"></app-feather-icon>
            </div>
            <div class="metric-value">{{ formatNumber(overview.summary.sales.liters) }} L</div>
            <div class="metric-details">
              {{ formatCurrency(overview.summary.sales.value) }} • {{ overview.summary.sales.transactions }} txns
            </div>
          </div>

          <!-- Suppliers Metric -->
          <div class="metric-card suppliers" (click)="navigateToSuppliers()">
            <div class="metric-header">
              <div class="metric-title">Suppliers</div>
              <app-feather-icon name="user-plus" size="16px"></app-feather-icon>
            </div>
            <div class="metric-value">{{ overview.summary.suppliers.active }}</div>
            <div class="metric-details">
              <span class="active">{{ overview.summary.suppliers.active }} active</span>
              <span class="inactive">{{ overview.summary.suppliers.inactive }} inactive</span>
            </div>
          </div>

          <!-- Customers Metric -->
          <div class="metric-card customers" (click)="navigateToCustomers()">
            <div class="metric-header">
              <div class="metric-title">Customers</div>
              <app-feather-icon name="users" size="16px"></app-feather-icon>
            </div>
            <div class="metric-value">{{ overview.summary.customers.active }}</div>
            <div class="metric-details">
              <span class="active">{{ overview.summary.customers.active }} active</span>
              <span class="inactive">{{ overview.summary.customers.inactive }} inactive</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section (matching mobile app) -->
      <div class="chart-section" *ngIf="overview">
        <div class="chart-header">
          <h3>Milk Collection & Sales ({{ formatChartPeriod(overview.chart_period || overview.breakdown_type) }})</h3>
        </div>
        <div class="chart-container">
          <apx-chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [yaxis]="chartOptions.yaxis"
            [dataLabels]="chartOptions.dataLabels"
            [stroke]="chartOptions.stroke"
            [fill]="chartOptions.fill"
            [colors]="chartOptions.colors"
            [tooltip]="chartOptions.tooltip"
            [grid]="chartOptions.grid"
            [legend]="chartOptions.legend || {}">
          </apx-chart>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color collections"></div>
            <span>Collections</span>
          </div>
          <div class="legend-item">
            <div class="legend-color sales"></div>
            <span>Sales</span>
          </div>
        </div>
      </div>

      <!-- Recent Transactions (matching mobile app) -->
      <div class="recent-transactions" *ngIf="overview?.recent_transactions?.length">
        <div class="transactions-header">
          <h3>Recent Transactions</h3>
          <button class="btn-link" (click)="navigateToTransactions()">View All</button>
        </div>
        <div class="transactions-list">
          <div class="transaction-item" 
               *ngFor="let transaction of (overview?.recent_transactions || []).slice(0, 5)"
               (click)="viewTransactionDetails(transaction)">
            <div class="transaction-icon" [class]="transaction.type.toLowerCase()">
              <app-feather-icon 
                [name]="transaction.type.toLowerCase() === 'collection' ? 'truck' : 'shopping-cart'" 
                size="16px">
              </app-feather-icon>
            </div>
            <div class="transaction-content">
              <div class="transaction-title">
                {{ transaction.type }} from {{ getTransactionAccount(transaction) }}
              </div>
              <div class="transaction-time">{{ formatDate(transaction.date) }}</div>
            </div>
            <div class="transaction-amount" [class]="transaction.type.toLowerCase()">
              {{ formatCurrency(transaction.total_amount) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Loading States -->
      <div class="loading-section" *ngIf="isLoading">
        <div class="loading-card">
          <div class="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>

      <!-- Error States -->
      <div class="error-section" *ngIf="errorMessage">
        <div class="error-card">
          <app-feather-icon name="alert-circle" size="32px"></app-feather-icon>
          <h3>Failed to Load Dashboard</h3>
          <p>{{ errorMessage }}</p>
          <button class="btn-primary" (click)="refreshDashboard()">Retry</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Data properties
  overview: DashboardOverview | null = null;
  wallets: Wallet[] = [];
  walletBalanceVisibility: { [key: string]: boolean } = {};
  
  // UI state
  isLoading = true;
  errorMessage: string | null = null;
  
  // Chart options
  chartOptions!: ChartOptions;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private navigationService: NavigationService
  ) {
    this.initializeCharts();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load dashboard data from APIs
   */
  loadDashboardData() {
    this.isLoading = true;
    this.errorMessage = null;

    // Load overview data
    this.dashboardService.getOverview()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (overview) => {
          this.overview = overview;
          this.updateChartData();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load overview:', error);
          this.errorMessage = error;
          this.isLoading = false;
        }
      });

    // Load wallets data
    this.dashboardService.getWallets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wallets) => {
          this.wallets = wallets;
          // Initialize wallet balance visibility
          wallets.forEach(wallet => {
            this.walletBalanceVisibility[wallet.id] = true;
          });
        },
        error: (error) => {
          console.error('Failed to load wallets:', error);
          // Don't show error for wallets as it's not critical
        }
      });
  }

  /**
   * Initialize chart options
   */
  initializeCharts() {
    this.chartOptions = {
      series: [
        {
          name: 'Collections',
          type: 'column',
          data: []
        },
        {
          name: 'Sales',
          type: 'column',
          data: []
        }
      ],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
          text: 'Liters'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      fill: {
        opacity: 1
      },
      colors: ['#004AAD', '#6B7280'],
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " L"
          }
        }
      },
      grid: {
        borderColor: '#f1f5f9'
      },
      legend: {
        show: true,
        position: 'top'
      }
    };
  }

  /**
   * Update chart data based on overview data
   */
  updateChartData() {
    if (!this.overview) return;

    const categories = this.overview.breakdown.map(item => item.label);
    const collectionsData = this.overview.breakdown.map(item => item.collection.liters);
    const salesData = this.overview.breakdown.map(item => item.sales.liters);

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Collections',
          type: 'column',
          data: collectionsData
        },
        {
          name: 'Sales',
          type: 'column',
          data: salesData
        }
      ],
      xaxis: {
        categories: categories
      }
    };
  }

  /**
   * Quick action handlers
   */
  quickAction(action: string) {
    switch(action) {
      case 'collect':
        // Navigate to collections screen
        console.log('Navigate to collections');
        break;
      case 'sell':
        // Navigate to sales screen
        console.log('Navigate to sales');
        break;
      case 'supplier':
        // Navigate to suppliers screen
        console.log('Navigate to suppliers');
        break;
      case 'customer':
        // Navigate to customers screen
        console.log('Navigate to customers');
        break;
    }
  }

  /**
   * Navigation methods
   */
  navigateToWallet(wallet: Wallet) {
    console.log('Navigate to wallet:', wallet.name);
    // TODO: Navigate to wallet details/transactions
  }

  navigateToCollections() {
    console.log('Navigate to collections');
    // TODO: Navigate to collections screen
  }

  navigateToSales() {
    console.log('Navigate to sales');
    // TODO: Navigate to sales screen
  }

  navigateToSuppliers() {
    console.log('Navigate to suppliers');
    // TODO: Navigate to suppliers screen
  }

  navigateToCustomers() {
    console.log('Navigate to customers');
    // TODO: Navigate to customers screen
  }

  navigateToTransactions() {
    console.log('Navigate to transactions');
    // TODO: Navigate to transactions screen
  }

  viewTransactionDetails(transaction: any) {
    console.log('View transaction details:', transaction);
    // TODO: Show transaction details modal
  }

  /**
   * Utility methods
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-RW').format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }

  formatChartPeriod(period: string): string {
    switch(period) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return period;
    }
  }

  getTransactionAccount(transaction: any): string {
    if (transaction.supplier_account) {
      return transaction.supplier_account.name;
    } else if (transaction.customer_account) {
      return transaction.customer_account.name;
    }
    return 'Unknown';
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard() {
    this.loadDashboardData();
  }
}