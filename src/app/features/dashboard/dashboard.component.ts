import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent],
  template: `
    <div class="dashboard-container">
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
              <button class="btn-small active">7D</button>
              <button class="btn-small">30D</button>
              <button class="btn-small">90D</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="chart-mock">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 85%"></div>
                <div class="bar" style="height: 95%"></div>
              </div>
              <div class="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>Revenue Overview</h3>
            <div class="chart-controls">
              <button class="btn-small active">7D</button>
              <button class="btn-small">30D</button>
              <button class="btn-small">90D</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="chart-mock">
              <div class="chart-line">
                <div class="line-point" style="left: 10%; top: 80%"></div>
                <div class="line-point" style="left: 25%; top: 60%"></div>
                <div class="line-point" style="left: 40%; top: 70%"></div>
                <div class="line-point" style="left: 55%; top: 40%"></div>
                <div class="line-point" style="left: 70%; top: 50%"></div>
                <div class="line-point" style="left: 85%; top: 30%"></div>
                <div class="line-point" style="left: 100%; top: 20%"></div>
              </div>
              <div class="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Initialize dashboard data
  }
}