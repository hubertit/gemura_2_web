import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
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
      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <button class="action-btn" (click)="quickAction('new-collection')">
            <div class="action-icon">
              <app-feather-icon name="truck" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">New Collection</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('new-sale')">
            <div class="action-icon">
              <app-feather-icon name="shopping-cart" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">New Sale</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('add-supplier')">
            <div class="action-icon">
              <app-feather-icon name="user-plus" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">Add Supplier</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('add-customer')">
            <div class="action-icon">
              <app-feather-icon name="users" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">Add Customer</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('generate-report')">
            <div class="action-icon">
              <app-feather-icon name="file-text" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">Generate Report</span>
          </button>
          
          <button class="action-btn" (click)="quickAction('view-analytics')">
            <div class="action-icon">
              <app-feather-icon name="bar-chart-2" size="20px"></app-feather-icon>
            </div>
            <span class="action-label">View Analytics</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <!-- Milk Collections -->
        <div class="stat-card collections">
          <div class="stat-icon">
            <app-feather-icon name="truck" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Milk Collections</div>
            <div class="stat-numbers">
              <div class="main-stat">1,250L</div>
              <div class="sub-stats">
                <span class="success">45 Collections</span>
                <span class="volume">187,500 RWF</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Milk Sales -->
        <div class="stat-card sales">
          <div class="stat-icon">
            <app-feather-icon name="shopping-cart" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Milk Sales</div>
            <div class="stat-numbers">
              <div class="main-stat">980L</div>
              <div class="sub-stats">
                <span class="success">32 Sales</span>
                <span class="volume">147,000 RWF</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Suppliers -->
        <div class="stat-card suppliers">
          <div class="stat-icon">
            <app-feather-icon name="user-plus" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Active Suppliers</div>
            <div class="stat-numbers">
              <div class="main-stat">12</div>
              <div class="sub-stats">
                <span class="success">3 Inactive</span>
                <span class="volume">15 Total</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Customers -->
        <div class="stat-card customers">
          <div class="stat-icon">
            <app-feather-icon name="users" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Active Customers</div>
            <div class="stat-numbers">
              <div class="main-stat">28</div>
              <div class="sub-stats">
                <span class="success">5 Inactive</span>
                <span class="volume">33 Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Milk Collection Trends</h3>
            <div class="chart-controls">
              <button class="btn-small active" (click)="updateCollectionChart('7D', $event)">7D</button>
              <button class="btn-small" (click)="updateCollectionChart('30D', $event)">30D</button>
              <button class="btn-small" (click)="updateCollectionChart('90D', $event)">90D</button>
            </div>
          </div>
          <div class="chart-wrapper">
              <apx-chart
              [series]="collectionChartOptions.series"
              [chart]="collectionChartOptions.chart"
              [xaxis]="collectionChartOptions.xaxis"
              [yaxis]="collectionChartOptions.yaxis"
              [dataLabels]="collectionChartOptions.dataLabels"
              [stroke]="collectionChartOptions.stroke"
              [fill]="collectionChartOptions.fill"
              [colors]="collectionChartOptions.colors"
              [tooltip]="collectionChartOptions.tooltip"
              [grid]="collectionChartOptions.grid">
            </apx-chart>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>Revenue Overview</h3>
            <div class="chart-controls">
              <button class="btn-small active" (click)="updateRevenueChart('7D', $event)">7D</button>
              <button class="btn-small" (click)="updateRevenueChart('30D', $event)">30D</button>
              <button class="btn-small" (click)="updateRevenueChart('90D', $event)">90D</button>
            </div>
          </div>
          <div class="chart-wrapper">
              <apx-chart
              [series]="revenueChartOptions.series"
              [chart]="revenueChartOptions.chart"
              [xaxis]="revenueChartOptions.xaxis"
              [yaxis]="revenueChartOptions.yaxis"
              [dataLabels]="revenueChartOptions.dataLabels"
              [stroke]="revenueChartOptions.stroke"
              [fill]="revenueChartOptions.fill"
              [colors]="revenueChartOptions.colors"
              [tooltip]="revenueChartOptions.tooltip"
              [grid]="revenueChartOptions.grid">
            </apx-chart>
          </div>
          </div>
        </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <div class="activity-header">
          <h3>Recent Activity</h3>
          <button class="btn-link">View All</button>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon collections">
              <app-feather-icon name="truck" size="16px"></app-feather-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">Milk collection from John Doe</div>
              <div class="activity-time">2 hours ago</div>
            </div>
            <div class="activity-amount">+15,000 RWF</div>
        </div>

          <div class="activity-item">
            <div class="activity-icon sales">
              <app-feather-icon name="shopping-cart" size="16px"></app-feather-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">Milk sale to ABC Store</div>
              <div class="activity-time">4 hours ago</div>
            </div>
            <div class="activity-amount">+25,000 RWF</div>
        </div>

          <div class="activity-item">
            <div class="activity-icon suppliers">
              <app-feather-icon name="user-plus" size="16px"></app-feather-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">New supplier registered</div>
              <div class="activity-time">1 day ago</div>
            </div>
            <div class="activity-amount">-</div>
        </div>

          <div class="activity-item">
            <div class="activity-icon customers">
              <app-feather-icon name="users" size="16px"></app-feather-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">New customer added</div>
              <div class="activity-time">2 days ago</div>
            </div>
            <div class="activity-amount">-</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  collectionChartOptions!: ChartOptions;
  revenueChartOptions!: ChartOptions;

  constructor(private authService: AuthService) {
    this.initializeCharts();
  }

  ngOnInit() {
    // Initialize dashboard data
  }

  initializeCharts() {
    // Milk Collection Trends Chart
    this.collectionChartOptions = {
      series: [{
        name: 'Milk Collected (L)',
        data: [120, 180, 95, 210, 160, 195, 230]
      }],
    chart: {
        type: 'bar',
        height: 300,
        toolbar: {
          show: false
        }
      },
    xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
      colors: ['#004AAD'],
    tooltip: {
      y: {
          formatter: function (val) {
            return val + " L"
          }
        }
      },
      grid: {
        borderColor: '#f1f5f9'
      }
    };

    // Revenue Overview Chart
    this.revenueChartOptions = {
      series: [{
        name: 'Revenue (RWF)',
        data: [15000, 22000, 18000, 25000, 20000, 28000, 32000]
      }],
      chart: {
        type: 'line',
        height: 300,
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yaxis: {
        title: {
          text: 'RWF'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      colors: ['#0066CC'],
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toLocaleString() + " RWF"
          }
        }
      },
      grid: {
        borderColor: '#f1f5f9'
      }
    };
  }

  updateCollectionChart(period: string, event?: Event) {
    // Update active button
    document.querySelectorAll('.chart-controls button').forEach(btn => btn.classList.remove('active'));
    if (event?.target && event.target instanceof HTMLElement) {
      event.target.classList.add('active');
    }

    // Update chart data based on period
    let newData: number[];
    switch(period) {
      case '7D':
        newData = [120, 180, 95, 210, 160, 195, 230];
        break;
      case '30D':
        newData = [150, 200, 120, 250, 180, 220, 280, 160, 190, 240, 170, 210, 260, 140, 180, 230, 160, 200, 250, 130, 170, 220, 150, 190, 240, 160, 200, 250, 140, 180];
        break;
      case '90D':
        newData = [100, 150, 200, 120, 180, 220, 160, 190, 240, 140, 170, 210, 180, 220, 260, 160, 200, 240, 140, 180, 220, 160, 200, 240, 180, 220, 260, 160, 200, 240];
        break;
      default:
        newData = [120, 180, 95, 210, 160, 195, 230];
    }
    
    this.collectionChartOptions.series = [{
      name: 'Milk Collected (L)',
      data: newData
    }];
  }

  updateRevenueChart(period: string, event?: Event) {
    // Update active button
    document.querySelectorAll('.chart-controls button').forEach(btn => btn.classList.remove('active'));
    if (event?.target && event.target instanceof HTMLElement) {
      event.target.classList.add('active');
    }

    // Update chart data based on period
    let newData: number[];
    switch(period) {
      case '7D':
        newData = [15000, 22000, 18000, 25000, 20000, 28000, 32000];
        break;
      case '30D':
        newData = [18000, 25000, 22000, 30000, 26000, 35000, 40000, 24000, 28000, 36000, 26000, 32000, 38000, 22000, 26000, 34000, 24000, 30000, 36000, 20000, 24000, 32000, 22000, 28000, 36000, 24000, 30000, 38000, 22000, 26000];
        break;
      case '90D':
        newData = [12000, 18000, 25000, 15000, 22000, 30000, 20000, 26000, 35000, 18000, 24000, 32000, 22000, 30000, 40000, 20000, 28000, 36000, 18000, 26000, 34000, 20000, 28000, 36000, 22000, 30000, 38000, 20000, 28000, 36000];
        break;
      default:
        newData = [15000, 22000, 18000, 25000, 20000, 28000, 32000];
    }
    
    this.revenueChartOptions.series = [{
      name: 'Revenue (RWF)',
      data: newData
    }];
  }

  quickAction(action: string) {
    console.log('Quick action triggered:', action);
    // TODO: Implement navigation or modal opening based on action
    switch(action) {
      case 'new-collection':
        // Navigate to new collection form
        break;
      case 'new-sale':
        // Navigate to new sale form
        break;
      case 'add-supplier':
        // Navigate to add supplier form
        break;
      case 'add-customer':
        // Navigate to add customer form
        break;
      case 'generate-report':
        // Open report generation modal
        break;
      case 'view-analytics':
        // Navigate to analytics page
        break;
    }
  }
}