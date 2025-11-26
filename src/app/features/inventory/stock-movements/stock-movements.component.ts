import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { StockMovement, InventoryItem } from '../models/inventory.models';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideIconComponent, DataTableComponent],
  template: `
    <div class="movements-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="breadcrumb">
            <a routerLink="/inventory">Inventory</a>
            <app-lucide-icon name="chevron-right" size="14px"></app-lucide-icon>
            <span>Stock Movements</span>
          </div>
          <h1>Stock Movements</h1>
          <p class="page-description">Track all stock changes across your inventory</p>
        </div>
        <div class="header-actions">
          <button class="btn-outline" (click)="exportMovements()">
            <app-lucide-icon name="download" size="16px"></app-lucide-icon>
            Export
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon in">
            <app-lucide-icon name="arrow-down" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.stockIn }}</div>
            <div class="stat-label">Stock In</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon out">
            <app-lucide-icon name="arrow-up" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.stockOut }}</div>
            <div class="stat-label">Stock Out</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon adjustment">
            <app-lucide-icon name="refresh-cw" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.adjustments }}</div>
            <div class="stat-label">Adjustments</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total">
            <app-lucide-icon name="activity" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total Movements</div>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Movement Type</label>
          <select [(ngModel)]="selectedType" (change)="filterMovements()" class="form-select">
            <option value="">All Types</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Item</label>
          <select [(ngModel)]="selectedItem" (change)="filterMovements()" class="form-select">
            <option value="">All Items</option>
            <option *ngFor="let item of items" [value]="item.id">{{ item.name }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>From Date</label>
          <input type="date" [(ngModel)]="startDate" (change)="filterMovements()" class="form-control">
        </div>
        <div class="filter-group">
          <label>To Date</label>
          <input type="date" [(ngModel)]="endDate" (change)="filterMovements()" class="form-control">
        </div>
        <div class="filter-group filter-actions">
          <label>&nbsp;</label>
          <button class="btn-clear" (click)="clearFilters()">
            <app-lucide-icon name="x" size="14px"></app-lucide-icon>
            Clear
          </button>
        </div>
      </div>

      <!-- Movements List -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-section">
            <h3>Movement History</h3>
            <span class="item-count">{{ filteredMovements.length }} records</span>
          </div>
        </div>
        <div class="card-body">
          <div class="movements-table" *ngIf="filteredMovements.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Reason</th>
                  <th>Performed By</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let movement of paginatedMovements">
                  <td class="date-cell">
                    <span class="date">{{ formatDate(movement.date) }}</span>
                    <span class="time">{{ formatTime(movement.date) }}</span>
                  </td>
                  <td class="item-cell">
                    <span class="item-name">{{ movement.itemName }}</span>
                  </td>
                  <td>
                    <span class="type-badge" [class]="movement.type.toLowerCase()">
                      <app-lucide-icon 
                        [name]="getTypeIcon(movement.type)" 
                        size="14px">
                      </app-lucide-icon>
                      {{ getTypeLabel(movement.type) }}
                    </span>
                  </td>
                  <td class="quantity-cell" [class]="movement.type.toLowerCase()">
                    {{ movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '±' }}{{ movement.quantity }}
                  </td>
                  <td class="stock-cell">{{ movement.previousQuantity }}</td>
                  <td class="stock-cell">
                    <span [class.highlight]="movement.newQuantity > movement.previousQuantity"
                          [class.warning]="movement.newQuantity < movement.previousQuantity">
                      {{ movement.newQuantity }}
                    </span>
                  </td>
                  <td class="reason-cell">{{ movement.reason }}</td>
                  <td class="user-cell">{{ movement.performedBy }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="filteredMovements.length === 0">
            <app-lucide-icon name="inbox" size="48px"></app-lucide-icon>
            <h4>No movements found</h4>
            <p>No stock movements match your current filters.</p>
          </div>

          <!-- Pagination -->
          <div class="pagination-wrapper" *ngIf="filteredMovements.length > pageSize">
            <div class="page-info">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredMovements.length) }} of {{ filteredMovements.length }}
            </div>
            <div class="page-controls">
              <button class="page-btn" [disabled]="currentPage === 1" (click)="currentPage = currentPage - 1">
                <app-lucide-icon name="chevron-left" size="16px"></app-lucide-icon>
              </button>
              <span class="page-number">{{ currentPage }} / {{ totalPages }}</span>
              <button class="page-btn" [disabled]="currentPage === totalPages" (click)="currentPage = currentPage + 1">
                <app-lucide-icon name="chevron-right" size="16px"></app-lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stock-movements.component.scss']
})
export class StockMovementsComponent implements OnInit {
  movements: StockMovement[] = [];
  filteredMovements: StockMovement[] = [];
  items: InventoryItem[] = [];
  stats = { stockIn: 0, stockOut: 0, adjustments: 0, total: 0 };

  // Filters
  selectedType = '';
  selectedItem = '';
  startDate = '';
  endDate = '';

  // Pagination
  currentPage = 1;
  pageSize = 15;
  Math = Math;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.movements = this.inventoryService.getStockMovements();
    this.items = this.inventoryService.getInventoryItems();
    this.calculateStats();
    this.filterMovements();
  }

  calculateStats() {
    this.stats = {
      stockIn: this.movements.filter(m => m.type === 'IN').length,
      stockOut: this.movements.filter(m => m.type === 'OUT').length,
      adjustments: this.movements.filter(m => m.type === 'ADJUSTMENT').length,
      total: this.movements.length
    };
  }

  filterMovements() {
    let filtered = [...this.movements];

    if (this.selectedType) {
      filtered = filtered.filter(m => m.type === this.selectedType);
    }

    if (this.selectedItem) {
      filtered = filtered.filter(m => m.itemId === this.selectedItem);
    }

    if (this.startDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(m => new Date(m.date) >= start);
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(m => new Date(m.date) <= end);
    }

    // Sort by date descending (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.filteredMovements = filtered;
    this.currentPage = 1;
  }

  clearFilters() {
    this.selectedType = '';
    this.selectedItem = '';
    this.startDate = '';
    this.endDate = '';
    this.filterMovements();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMovements.length / this.pageSize);
  }

  get paginatedMovements(): StockMovement[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMovements.slice(start, start + this.pageSize);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'IN': return 'arrow-down';
      case 'OUT': return 'arrow-up';
      case 'ADJUSTMENT': return 'refresh-cw';
      default: return 'activity';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'IN': return 'Stock In';
      case 'OUT': return 'Stock Out';
      case 'ADJUSTMENT': return 'Adjustment';
      default: return type;
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(date));
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    }).format(new Date(date));
  }

  exportMovements() {
    const headers = ['Date', 'Item', 'Type', 'Quantity', 'Previous', 'New', 'Reason', 'Performed By'];
    const rows = this.filteredMovements.map(m => [
      new Date(m.date).toISOString(),
      m.itemName,
      m.type,
      m.quantity.toString(),
      m.previousQuantity.toString(),
      m.newQuantity.toString(),
      m.reason,
      m.performedBy
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_movements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

