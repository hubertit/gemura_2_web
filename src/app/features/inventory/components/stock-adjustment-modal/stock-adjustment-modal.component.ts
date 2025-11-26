import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { InventoryItem } from '../../models/inventory.models';

@Component({
  selector: 'app-stock-adjustment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Adjust Stock</h2>
          <button class="close-btn" (click)="close()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #adjustForm="ngForm">
          <div class="modal-body">
            <!-- Current Stock Info -->
            <div class="current-stock">
              <div class="stock-item-name">{{ item.name }}</div>
              <div class="stock-info">
                <span class="label">Current Stock:</span>
                <span class="value">{{ item.quantity }} {{ item.unit }}</span>
              </div>
            </div>

            <!-- Adjustment Type -->
            <div class="adjustment-types">
              <button type="button" class="type-btn" [class.active]="adjustment.type === 'IN'" 
                      (click)="adjustment.type = 'IN'">
                <app-lucide-icon name="arrow-down" size="20px"></app-lucide-icon>
                <span>Stock In</span>
                <small>Add to inventory</small>
              </button>
              <button type="button" class="type-btn" [class.active]="adjustment.type === 'OUT'" 
                      (click)="adjustment.type = 'OUT'">
                <app-lucide-icon name="arrow-up" size="20px"></app-lucide-icon>
                <span>Stock Out</span>
                <small>Remove from inventory</small>
              </button>
              <button type="button" class="type-btn" [class.active]="adjustment.type === 'ADJUSTMENT'" 
                      (click)="adjustment.type = 'ADJUSTMENT'">
                <app-lucide-icon name="refresh-cw" size="20px"></app-lucide-icon>
                <span>Set Quantity</span>
                <small>Set exact amount</small>
              </button>
            </div>

            <!-- Quantity Input -->
            <div class="form-group">
              <label for="quantity">
                {{ adjustment.type === 'ADJUSTMENT' ? 'New Quantity' : 'Quantity' }} *
              </label>
              <div class="quantity-input">
                <input type="number" id="quantity" [(ngModel)]="adjustment.quantity" name="quantity" 
                       required min="0" [max]="adjustment.type === 'OUT' ? item.quantity : null">
                <span class="unit">{{ item.unit }}</span>
              </div>
              <small class="hint" *ngIf="adjustment.type === 'OUT'">
                Maximum: {{ item.quantity }} {{ item.unit }}
              </small>
            </div>

            <!-- Preview -->
            <div class="preview" *ngIf="adjustment.quantity > 0">
              <span class="label">New Stock Level:</span>
              <span class="value" [class.warning]="getNewQuantity() <= item.reorderLevel">
                {{ getNewQuantity() }} {{ item.unit }}
              </span>
            </div>

            <!-- Reason -->
            <div class="form-group">
              <label for="reason">Reason *</label>
              <select id="reason" [(ngModel)]="adjustment.reason" name="reason" required 
                      *ngIf="adjustment.type !== 'ADJUSTMENT'">
                <option value="">Select reason</option>
                <option *ngFor="let r of getReasons()" [value]="r">{{ r }}</option>
                <option value="__other__">Other</option>
              </select>
              <input type="text" id="reason" [(ngModel)]="adjustment.reason" name="reason" required 
                     placeholder="Enter reason for adjustment" *ngIf="adjustment.type === 'ADJUSTMENT'">
            </div>

            <div class="form-group" *ngIf="adjustment.reason === '__other__'">
              <label for="customReason">Specify Reason *</label>
              <input type="text" id="customReason" [(ngModel)]="customReason" name="customReason" 
                     placeholder="Enter reason">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="close()">Cancel</button>
            <button type="submit" class="btn-primary" 
                    [disabled]="!adjustForm.valid || adjustment.quantity <= 0">
              <app-lucide-icon name="check" size="16px"></app-lucide-icon>
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./stock-adjustment-modal.component.scss']
})
export class StockAdjustmentModalComponent {
  @Input() item!: InventoryItem;
  @Output() stockAdjusted = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  adjustment = {
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: 0,
    reason: ''
  };
  customReason = '';

  stockInReasons = [
    'Restocking from supplier',
    'Purchase order received',
    'Transfer from another location',
    'Return from customer',
    'Found during inventory count'
  ];

  stockOutReasons = [
    'Used for operations',
    'Sold to customer',
    'Transfer to another location',
    'Damaged/Expired',
    'Lost/Missing'
  ];

  getReasons(): string[] {
    return this.adjustment.type === 'IN' ? this.stockInReasons : this.stockOutReasons;
  }

  getNewQuantity(): number {
    if (this.adjustment.type === 'IN') {
      return this.item.quantity + this.adjustment.quantity;
    } else if (this.adjustment.type === 'OUT') {
      return Math.max(0, this.item.quantity - this.adjustment.quantity);
    } else {
      return this.adjustment.quantity;
    }
  }

  onSubmit() {
    const reason = this.adjustment.reason === '__other__' ? this.customReason : this.adjustment.reason;
    this.stockAdjusted.emit({
      itemId: this.item.id,
      type: this.adjustment.type,
      quantity: this.adjustment.quantity,
      reason
    });
  }

  close() {
    this.modalClosed.emit();
  }
}

