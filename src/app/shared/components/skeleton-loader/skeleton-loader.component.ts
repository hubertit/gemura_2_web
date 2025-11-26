import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [ngClass]="type">
      <!-- Table Skeleton -->
      <ng-container *ngIf="type === 'table'">
        <div class="skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton-line title"></div>
          </div>
          <div class="skeleton-table">
            <div class="skeleton-row header">
              <div class="skeleton-cell" *ngFor="let col of [1,2,3,4,5]"></div>
            </div>
            <div class="skeleton-row" *ngFor="let row of rows">
              <div class="skeleton-cell" *ngFor="let col of [1,2,3,4,5]"></div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Stats/Cards Skeleton -->
      <ng-container *ngIf="type === 'stats'">
        <div class="skeleton-stats-grid">
          <div class="skeleton-stat-card" *ngFor="let i of [1,2,3,4]">
            <div class="skeleton-icon"></div>
            <div class="skeleton-stat-content">
              <div class="skeleton-line large"></div>
              <div class="skeleton-line small"></div>
            </div>
          </div>
        </div>
        <div class="skeleton-card" style="margin-top: 20px;">
          <div class="skeleton-header">
            <div class="skeleton-line title"></div>
          </div>
          <div class="skeleton-table">
            <div class="skeleton-row header">
              <div class="skeleton-cell" *ngFor="let col of [1,2,3,4,5]"></div>
            </div>
            <div class="skeleton-row" *ngFor="let row of [1,2,3,4,5]">
              <div class="skeleton-cell" *ngFor="let col of [1,2,3,4,5]"></div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Form Skeleton -->
      <ng-container *ngIf="type === 'form'">
        <div class="skeleton-card">
          <div class="skeleton-form">
            <div class="skeleton-form-row" *ngFor="let i of [1,2,3]">
              <div class="skeleton-label"></div>
              <div class="skeleton-input"></div>
            </div>
            <div class="skeleton-button"></div>
          </div>
        </div>
      </ng-container>

      <!-- List Skeleton -->
      <ng-container *ngIf="type === 'list'">
        <div class="skeleton-card">
          <div class="skeleton-list-item" *ngFor="let i of rows">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-list-content">
              <div class="skeleton-line medium"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Dashboard Skeleton -->
      <ng-container *ngIf="type === 'dashboard'">
        <div class="skeleton-stats-grid">
          <div class="skeleton-stat-card" *ngFor="let i of [1,2,3,4]">
            <div class="skeleton-icon"></div>
            <div class="skeleton-stat-content">
              <div class="skeleton-line large"></div>
              <div class="skeleton-line small"></div>
            </div>
          </div>
        </div>
        <div class="skeleton-card" style="margin-top: 20px;">
          <div class="skeleton-header">
            <div class="skeleton-line title"></div>
          </div>
          <div class="skeleton-chart"></div>
        </div>
      </ng-container>

      <!-- Card Skeleton -->
      <ng-container *ngIf="type === 'card'">
        <div class="skeleton-card">
          <div class="skeleton-header">
            <div class="skeleton-line title"></div>
          </div>
          <div class="skeleton-body">
            <div class="skeleton-line full"></div>
            <div class="skeleton-line full"></div>
            <div class="skeleton-line medium"></div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      width: 100%;
    }

    .skeleton-card {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 16px;
    }

    .skeleton-header {
      margin-bottom: 16px;
    }

    .skeleton-line {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 8px;

      &.title { width: 200px; height: 20px; }
      &.large { width: 120px; height: 24px; }
      &.medium { width: 60%; height: 14px; }
      &.short { width: 100px; height: 14px; }
      &.small { width: 80px; height: 12px; }
      &.full { width: 100%; height: 14px; }
    }

    .skeleton-table {
      .skeleton-row {
        display: flex;
        gap: 16px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &.header {
          .skeleton-cell {
            height: 12px;
            background: #e8e8e8;
          }
        }
      }

      .skeleton-cell {
        flex: 1;
        height: 14px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
      }
    }

    .skeleton-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .skeleton-stat-card {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .skeleton-icon {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-stat-content {
      flex: 1;
    }

    .skeleton-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }
    }

    .skeleton-list-content {
      flex: 1;
    }

    .skeleton-form-row {
      margin-bottom: 16px;
    }

    .skeleton-label {
      width: 100px;
      height: 12px;
      margin-bottom: 8px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-input {
      width: 100%;
      height: 38px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-button {
      width: 120px;
      height: 38px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin-top: 8px;
    }

    .skeleton-chart {
      width: 100%;
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-body {
      padding: 8px 0;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'stats' | 'form' | 'list' | 'dashboard' | 'card' = 'table';
  @Input() rowCount: number = 5;

  get rows(): number[] {
    return Array(this.rowCount).fill(0).map((_, i) => i);
  }
}

