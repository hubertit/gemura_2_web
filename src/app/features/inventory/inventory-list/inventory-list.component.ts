import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.models';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AddInventoryModalComponent } from '../components/add-inventory-modal/add-inventory-modal.component';
import { ViewInventoryModalComponent } from '../components/view-inventory-modal/view-inventory-modal.component';
import { EditInventoryModalComponent } from '../components/edit-inventory-modal/edit-inventory-modal.component';
import { StockAdjustmentModalComponent } from '../components/stock-adjustment-modal/stock-adjustment-modal.component';
import { DeleteInventoryModalComponent } from '../components/delete-inventory-modal/delete-inventory-modal.component';
import { ImportInventoryModalComponent } from '../components/import-inventory-modal/import-inventory-modal.component';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideIconComponent,
    DataTableComponent,
    SkeletonLoaderComponent,
    AddInventoryModalComponent,
    ViewInventoryModalComponent,
    EditInventoryModalComponent,
    StockAdjustmentModalComponent,
    DeleteInventoryModalComponent,
    ImportInventoryModalComponent
  ],
  template: `
    <div class="inventory-container">
      <!-- Skeleton Loader -->
      <ng-container *ngIf="loading">
        <app-skeleton-loader type="stats"></app-skeleton-loader>
      </ng-container>

      <ng-container *ngIf="!loading">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Inventory</h1>
          <p class="page-description">Manage your stock, supplies, and equipment</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/movements" class="btn-outline">
            <app-lucide-icon name="activity" size="16px"></app-lucide-icon>
            Stock Movements
          </a>
          <button class="btn-outline" (click)="exportData()">
            <app-lucide-icon name="download" size="16px"></app-lucide-icon>
            Export
          </button>
          <button class="btn-outline" (click)="openImportModal()">
            <app-lucide-icon name="upload" size="16px"></app-lucide-icon>
            Import
          </button>
          <button class="btn-primary" (click)="openAddModal()">
            <app-lucide-icon name="plus" size="16px"></app-lucide-icon>
            Add Item
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <app-lucide-icon name="box" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalItems }}</div>
            <div class="stat-label">Total Items</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <app-lucide-icon name="dollar-sign" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(stats.totalValue) }}</div>
            <div class="stat-label">Total Value</div>
          </div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">
            <app-lucide-icon name="alert-triangle" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.lowStockItems }}</div>
            <div class="stat-label">Low Stock</div>
          </div>
        </div>
        <div class="stat-card danger">
          <div class="stat-icon">
            <app-lucide-icon name="x-circle" size="24px"></app-lucide-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.outOfStockItems }}</div>
            <div class="stat-label">Out of Stock</div>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Category</label>
          <select [(ngModel)]="selectedCategory" (change)="filterItems()" class="form-select">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Status</label>
          <select [(ngModel)]="selectedStatus" (change)="filterItems()" class="form-select">
            <option value="">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-section">
            <h3>All Items</h3>
            <span class="item-count">{{ filteredItems.length }} items</span>
          </div>
        </div>
        <div class="card-body">
          <app-data-table
            [columns]="columns"
            [data]="filteredItems"
            [striped]="false"
            [hover]="true"
            [showActions]="false"
            [showPagination]="true"
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [totalPages]="totalPages"
            [totalItems]="filteredItems.length"
            [loading]="loading"
            (onSort)="handleSort($event)"
            (onPageChange)="handlePageChange($event)"
            (onPageSizeChange)="handlePageSizeChange($event)"
            (onRowClick)="viewItem($event)">
            
            <ng-template #rowActions let-item>
              <div class="dropdown" [class.show]="openDropdownId === item.id">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" 
                        (click)="toggleDropdown(item.id, $event)">
                  <app-lucide-icon name="more-horizontal" size="16px"></app-lucide-icon>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" [class.show]="openDropdownId === item.id">
                  <li>
                    <a class="dropdown-item" href="javascript:void(0)" (click)="viewItem(item)">
                      <app-lucide-icon name="eye" size="14px" class="me-2"></app-lucide-icon>
                      View
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:void(0)" (click)="adjustStock(item)">
                      <app-lucide-icon name="refresh-cw" size="14px" class="me-2"></app-lucide-icon>
                      Adjust Stock
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="javascript:void(0)" (click)="editItem(item)">
                      <app-lucide-icon name="edit" size="14px" class="me-2"></app-lucide-icon>
                      Edit
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item text-danger" href="javascript:void(0)" (click)="deleteItem(item)">
                      <app-lucide-icon name="trash-2" size="14px" class="me-2"></app-lucide-icon>
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </ng-template>
          </app-data-table>
        </div>
      </div>

      <!-- Modals -->
      <app-add-inventory-modal 
        *ngIf="showAddModal"
        [categories]="categories"
        (itemAdded)="onItemAdded($event)"
        (modalClosed)="closeAddModal()">
      </app-add-inventory-modal>

      <app-view-inventory-modal 
        *ngIf="showViewModal && selectedItem"
        [item]="selectedItem"
        (modalClosed)="closeViewModal()"
        (editRequested)="onEditRequested($event)">
      </app-view-inventory-modal>

      <app-edit-inventory-modal 
        *ngIf="showEditModal && selectedItem"
        [item]="selectedItem"
        [categories]="categories"
        (itemUpdated)="onItemUpdated($event)"
        (modalClosed)="closeEditModal()">
      </app-edit-inventory-modal>

      <app-stock-adjustment-modal 
        *ngIf="showStockModal && selectedItem"
        [item]="selectedItem"
        (stockAdjusted)="onStockAdjusted($event)"
        (modalClosed)="closeStockModal()">
      </app-stock-adjustment-modal>

      <app-delete-inventory-modal 
        *ngIf="showDeleteModal && selectedItem"
        [item]="selectedItem"
        (itemDeleted)="onItemDeleted($event)"
        (modalClosed)="closeDeleteModal()">
      </app-delete-inventory-modal>

      <app-import-inventory-modal 
        *ngIf="showImportModal"
        (importComplete)="onImportComplete($event)"
        (modalClosed)="closeImportModal()">
      </app-import-inventory-modal>
      </ng-container>
    </div>
  `,
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  categories: string[] = [];
  stats: any = {};
  loading = false;

  // Filters
  selectedCategory = '';
  selectedStatus = '';

  // Modals
  showAddModal = false;
  showViewModal = false;
  showEditModal = false;
  showStockModal = false;
  showDeleteModal = false;
  showImportModal = false;
  selectedItem: InventoryItem | null = null;

  // Table
  columns: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  openDropdownId: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.initializeColumns();
    this.loadData();

    document.addEventListener('click', () => {
      this.closeDropdown();
    });
  }

  initializeColumns() {
    this.columns = [
      { key: 'index', title: 'No.', type: 'number', sortable: false },
      { key: 'sku', title: 'SKU', type: 'text', sortable: true },
      { key: 'name', title: 'Item Name', type: 'text', sortable: true },
      { key: 'category', title: 'Category', type: 'text', sortable: true },
      { key: 'quantityDisplay', title: 'Quantity', type: 'text', sortable: true },
      { key: 'unitPriceDisplay', title: 'Unit Price', type: 'text', sortable: true },
      { key: 'status', title: 'Status', type: 'status', sortable: true },
      { key: 'location', title: 'Location', type: 'text', sortable: true }
    ];
  }

  loadData() {
    this.loading = true;
    setTimeout(() => {
      this.items = this.inventoryService.getInventoryItems().map((item, index) => ({
        ...item,
        index: index + 1,
        quantityDisplay: `${item.quantity} ${item.unit}`,
        unitPriceDisplay: this.formatCurrency(item.unitPrice)
      }));
      this.categories = this.inventoryService.getCategories();
      this.stats = this.inventoryService.getStats();
      this.filterItems();
      this.loading = false;
    }, 500);
  }

  filterItems() {
    let filtered = [...this.items];

    if (this.selectedCategory) {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(item => item.status === this.selectedStatus);
    }

    this.filteredItems = filtered.map((item, index) => ({
      ...item,
      index: index + 1
    }));
    this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
  }

  // Modal handlers
  openAddModal() { this.showAddModal = true; }
  closeAddModal() { this.showAddModal = false; }
  
  openImportModal() { this.showImportModal = true; }
  closeImportModal() { this.showImportModal = false; }

  viewItem(item: InventoryItem) {
    this.closeDropdown();
    this.selectedItem = item;
    this.showViewModal = true;
  }
  closeViewModal() {
    this.showViewModal = false;
    this.selectedItem = null;
  }

  editItem(item: InventoryItem) {
    this.closeDropdown();
    this.selectedItem = item;
    this.showEditModal = true;
  }
  closeEditModal() {
    this.showEditModal = false;
    this.selectedItem = null;
  }

  adjustStock(item: InventoryItem) {
    this.closeDropdown();
    this.selectedItem = item;
    this.showStockModal = true;
  }
  closeStockModal() {
    this.showStockModal = false;
    this.selectedItem = null;
  }

  deleteItem(item: InventoryItem) {
    this.closeDropdown();
    this.selectedItem = item;
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedItem = null;
  }

  // Event handlers
  onItemAdded(item: any) {
    this.inventoryService.addItem(item);
    this.loadData();
    this.closeAddModal();
  }

  onItemUpdated(item: any) {
    this.inventoryService.updateItem(item.id, item);
    this.loadData();
    this.closeEditModal();
  }

  onStockAdjusted(adjustment: any) {
    this.inventoryService.adjustStock(adjustment.itemId, adjustment);
    this.loadData();
    this.closeStockModal();
  }

  onItemDeleted(item: InventoryItem) {
    this.inventoryService.deleteItem(item.id);
    this.loadData();
    this.closeDeleteModal();
  }

  onEditRequested(item: InventoryItem) {
    this.closeViewModal();
    this.editItem(item);
  }

  onImportComplete(result: any) {
    this.loadData();
    this.closeImportModal();
  }

  exportData() {
    const csv = this.inventoryService.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Table handlers
  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    console.log('Sort:', event);
  }

  handlePageChange(page: number) {
    this.currentPage = page;
  }

  handlePageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  toggleDropdown(itemId: string, event: Event) {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === itemId ? null : itemId;
  }

  closeDropdown() {
    this.openDropdownId = null;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  }
}

