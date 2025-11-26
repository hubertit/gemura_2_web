import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { InventoryItem } from '../../models/inventory.models';

@Component({
  selector: 'app-edit-inventory-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Edit Item</h2>
          <button class="close-btn" (click)="close()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #itemForm="ngForm">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Item Name *</label>
                <input type="text" id="name" [(ngModel)]="editItem.name" name="name" required>
              </div>
              <div class="form-group">
                <label for="sku">SKU *</label>
                <input type="text" id="sku" [(ngModel)]="editItem.sku" name="sku" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Category *</label>
                <select id="category" [(ngModel)]="editItem.category" name="category" required>
                  <option value="">Select category</option>
                  <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="unit">Unit *</label>
                <select id="unit" [(ngModel)]="editItem.unit" name="unit" required>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters</option>
                  <option value="pieces">Pieces</option>
                  <option value="boxes">Boxes</option>
                  <option value="bottles">Bottles</option>
                  <option value="bales">Bales</option>
                  <option value="sets">Sets</option>
                  <option value="doses">Doses</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="unitPrice">Unit Price (RWF) *</label>
                <input type="number" id="unitPrice" [(ngModel)]="editItem.unitPrice" name="unitPrice" required min="0">
              </div>
              <div class="form-group">
                <label for="reorderLevel">Reorder Level *</label>
                <input type="number" id="reorderLevel" [(ngModel)]="editItem.reorderLevel" name="reorderLevel" required min="0">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="supplier">Supplier</label>
                <input type="text" id="supplier" [(ngModel)]="editItem.supplier" name="supplier">
              </div>
              <div class="form-group">
                <label for="location">Storage Location</label>
                <input type="text" id="location" [(ngModel)]="editItem.location" name="location">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">Expiry Date</label>
                <input type="date" id="expiryDate" [(ngModel)]="expiryDateStr" name="expiryDate">
              </div>
            </div>

            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea id="description" [(ngModel)]="editItem.description" name="description" rows="3"></textarea>
            </div>

            <div class="info-note">
              <app-lucide-icon name="info" size="16px"></app-lucide-icon>
              <span>To change quantity, use the "Adjust Stock" feature for proper tracking.</span>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="close()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="!itemForm.valid">
              <app-lucide-icon name="check" size="16px"></app-lucide-icon>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./edit-inventory-modal.component.scss']
})
export class EditInventoryModalComponent implements OnInit {
  @Input() item!: InventoryItem;
  @Input() categories: string[] = [];
  @Output() itemUpdated = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  editItem: any = {};
  expiryDateStr = '';

  ngOnInit() {
    this.editItem = { ...this.item };
    if (this.item.expiryDate) {
      this.expiryDateStr = new Date(this.item.expiryDate).toISOString().split('T')[0];
    }
  }

  onSubmit() {
    if (this.expiryDateStr) {
      this.editItem.expiryDate = new Date(this.expiryDateStr);
    }
    this.itemUpdated.emit(this.editItem);
  }

  close() {
    this.modalClosed.emit();
  }
}

