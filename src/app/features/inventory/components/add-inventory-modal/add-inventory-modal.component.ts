import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-add-inventory-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Add New Item</h2>
          <button class="close-btn" (click)="close()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #itemForm="ngForm">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Item Name *</label>
                <input type="text" id="name" [(ngModel)]="item.name" name="name" required 
                       placeholder="Enter item name">
              </div>
              <div class="form-group">
                <label for="sku">SKU *</label>
                <input type="text" id="sku" [(ngModel)]="item.sku" name="sku" required 
                       placeholder="e.g., DF-001">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Category *</label>
                <select id="category" [(ngModel)]="item.category" name="category" required>
                  <option value="">Select category</option>
                  <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                  <option value="__new__">+ Add New Category</option>
                </select>
              </div>
              <div class="form-group" *ngIf="item.category === '__new__'">
                <label for="newCategory">New Category *</label>
                <input type="text" id="newCategory" [(ngModel)]="newCategory" name="newCategory" 
                       placeholder="Enter new category">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="quantity">Initial Quantity *</label>
                <input type="number" id="quantity" [(ngModel)]="item.quantity" name="quantity" 
                       required min="0" placeholder="0">
              </div>
              <div class="form-group">
                <label for="unit">Unit *</label>
                <select id="unit" [(ngModel)]="item.unit" name="unit" required>
                  <option value="">Select unit</option>
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
                <input type="number" id="unitPrice" [(ngModel)]="item.unitPrice" name="unitPrice" 
                       required min="0" placeholder="0">
              </div>
              <div class="form-group">
                <label for="reorderLevel">Reorder Level *</label>
                <input type="number" id="reorderLevel" [(ngModel)]="item.reorderLevel" name="reorderLevel" 
                       required min="0" placeholder="Minimum stock level">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="supplier">Supplier</label>
                <input type="text" id="supplier" [(ngModel)]="item.supplier" name="supplier" 
                       placeholder="Supplier name">
              </div>
              <div class="form-group">
                <label for="location">Storage Location</label>
                <input type="text" id="location" [(ngModel)]="item.location" name="location" 
                       placeholder="e.g., Warehouse A">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">Expiry Date (if applicable)</label>
                <input type="date" id="expiryDate" [(ngModel)]="item.expiryDate" name="expiryDate">
              </div>
            </div>

            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea id="description" [(ngModel)]="item.description" name="description" 
                        rows="3" placeholder="Item description (optional)"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="close()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="!itemForm.valid">
              <app-lucide-icon name="plus" size="16px"></app-lucide-icon>
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./add-inventory-modal.component.scss']
})
export class AddInventoryModalComponent {
  @Input() categories: string[] = [];
  @Output() itemAdded = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  newCategory = '';
  item: any = {
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    unit: '',
    unitPrice: 0,
    reorderLevel: 0,
    supplier: '',
    location: '',
    expiryDate: null,
    description: ''
  };

  onSubmit() {
    const itemData = { ...this.item };
    if (itemData.category === '__new__' && this.newCategory) {
      itemData.category = this.newCategory;
    }
    itemData.lastRestocked = new Date();
    this.itemAdded.emit(itemData);
  }

  close() {
    this.modalClosed.emit();
  }
}

