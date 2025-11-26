import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem, StockMovement } from '../../models/inventory.models';

@Component({
  selector: 'app-view-inventory-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Item Details</h2>
          <button class="close-btn" (click)="close()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>

        <div class="modal-body">
          <!-- Item Info -->
          <div class="item-header">
            <div class="item-icon">
              <app-lucide-icon name="box" size="32px"></app-lucide-icon>
            </div>
            <div class="item-title">
              <h3>{{ item.name }}</h3>
              <span class="sku">SKU: {{ item.sku }}</span>
            </div>
            <span class="status-badge" [class]="getStatusClass(item.status)">
              {{ item.status }}
            </span>
          </div>

          <!-- Details Grid -->
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Category</span>
              <span class="value">{{ item.category }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Quantity</span>
              <span class="value">{{ item.quantity }} {{ item.unit }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Unit Price</span>
              <span class="value">{{ formatCurrency(item.unitPrice) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Total Value</span>
              <span class="value highlight">{{ formatCurrency(item.quantity * item.unitPrice) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Reorder Level</span>
              <span class="value">{{ item.reorderLevel }} {{ item.unit }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Supplier</span>
              <span class="value">{{ item.supplier || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Location</span>
              <span class="value">{{ item.location || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Last Restocked</span>
              <span class="value">{{ formatDate(item.lastRestocked) }}</span>
            </div>
            <div class="detail-item" *ngIf="item.expiryDate">
              <span class="label">Expiry Date</span>
              <span class="value" [class.warning]="isExpiringSoon(item.expiryDate)">
                {{ formatDate(item.expiryDate) }}
              </span>
            </div>
          </div>

          <div class="description" *ngIf="item.description">
            <span class="label">Description</span>
            <p>{{ item.description }}</p>
          </div>

          <!-- Stock Movements -->
          <div class="movements-section">
            <h4>Recent Stock Movements</h4>
            <div class="movements-list" *ngIf="movements.length > 0">
              <div class="movement-item" *ngFor="let movement of movements">
                <div class="movement-icon" [class]="movement.type.toLowerCase()">
                  <app-lucide-icon 
                    [name]="movement.type === 'IN' ? 'arrow-down' : movement.type === 'OUT' ? 'arrow-up' : 'refresh-cw'" 
                    size="16px">
                  </app-lucide-icon>
                </div>
                <div class="movement-details">
                  <span class="movement-type">{{ getMovementLabel(movement.type) }}</span>
                  <span class="movement-reason">{{ movement.reason }}</span>
                </div>
                <div class="movement-quantity" [class]="movement.type.toLowerCase()">
                  {{ movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '' }}{{ movement.quantity }}
                </div>
                <div class="movement-date">{{ formatDate(movement.date) }}</div>
              </div>
            </div>
            <p class="no-movements" *ngIf="movements.length === 0">No stock movements recorded</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="close()">Close</button>
          <button class="btn-primary" (click)="edit()">
            <app-lucide-icon name="edit" size="16px"></app-lucide-icon>
            Edit Item
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./view-inventory-modal.component.scss']
})
export class ViewInventoryModalComponent implements OnInit {
  @Input() item!: InventoryItem;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<InventoryItem>();

  movements: StockMovement[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.movements = this.inventoryService.getStockMovements(this.item.id);
  }

  close() {
    this.modalClosed.emit();
  }

  edit() {
    this.editRequested.emit(this.item);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Stock': return 'in-stock';
      case 'Low Stock': return 'low-stock';
      case 'Out of Stock': return 'out-of-stock';
      default: return '';
    }
  }

  getMovementLabel(type: string): string {
    switch (type) {
      case 'IN': return 'Stock In';
      case 'OUT': return 'Stock Out';
      case 'ADJUSTMENT': return 'Adjustment';
      default: return type;
    }
  }

  isExpiringSoon(date: Date): boolean {
    const expiry = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
  }
}

