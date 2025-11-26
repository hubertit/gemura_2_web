import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { InventoryItem } from '../../models/inventory.models';

@Component({
  selector: 'app-delete-inventory-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="warning-icon">
            <app-lucide-icon name="alert-triangle" size="32px"></app-lucide-icon>
          </div>
          <h2>Delete Item</h2>
        </div>

        <div class="modal-body">
          <p class="message">
            Are you sure you want to delete <strong>{{ item.name }}</strong>?
          </p>
          <p class="sub-message">
            This action cannot be undone. All stock movement history for this item will also be removed.
          </p>

          <div class="item-info">
            <div class="info-row">
              <span class="label">SKU:</span>
              <span class="value">{{ item.sku }}</span>
            </div>
            <div class="info-row">
              <span class="label">Current Stock:</span>
              <span class="value">{{ item.quantity }} {{ item.unit }}</span>
            </div>
            <div class="info-row">
              <span class="label">Value:</span>
              <span class="value">{{ formatCurrency(item.quantity * item.unitPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="close()">Cancel</button>
          <button class="btn-danger" (click)="confirmDelete()">
            <app-lucide-icon name="trash-2" size="16px"></app-lucide-icon>
            Delete Item
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./delete-inventory-modal.component.scss']
})
export class DeleteInventoryModalComponent {
  @Input() item!: InventoryItem;
  @Output() itemDeleted = new EventEmitter<InventoryItem>();
  @Output() modalClosed = new EventEmitter<void>();

  confirmDelete() {
    this.itemDeleted.emit(this.item);
  }

  close() {
    this.modalClosed.emit();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(amount);
  }
}

