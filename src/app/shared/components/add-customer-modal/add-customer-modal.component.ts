import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherIconComponent } from '../feather-icon/feather-icon.component';

@Component({
  selector: 'app-add-customer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FeatherIconComponent],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2>Add Customer</h2>
          <button class="close-btn" (click)="closeModal()">
            <app-feather-icon name="x" size="20px"></app-feather-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form #customerForm="ngForm" (ngSubmit)="onSubmit()">
            <!-- Name Field -->
            <div class="form-group">
              <label for="name">Customer Name *</label>
              <div class="input-container">
                <app-feather-icon name="user" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="customerData.name"
                  #nameField="ngModel"
                  required
                  placeholder="Enter customer name"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="nameField.invalid && nameField.touched">
                Please enter customer name
              </div>
            </div>

            <!-- Phone Field -->
            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <div class="input-container">
                <app-feather-icon name="phone" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [(ngModel)]="customerData.phone"
                  #phoneField="ngModel"
                  required
                  placeholder="788606765"
                  class="form-input"
                />
                <button type="button" class="contact-btn" (click)="pickContact()" title="Select from contacts">
                  <app-feather-icon name="users" size="16px"></app-feather-icon>
                </button>
              </div>
              <div class="error-message" *ngIf="phoneField.invalid && phoneField.touched">
                Please enter a valid phone number
              </div>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email (Optional)</label>
              <div class="input-container">
                <app-feather-icon name="mail" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="customerData.email"
                  placeholder="Email (optional)"
                  class="form-input"
                />
              </div>
            </div>

            <!-- Address Field -->
            <div class="form-group">
              <label for="address">Address *</label>
              <div class="input-container">
                <app-feather-icon name="map-pin" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="text"
                  id="address"
                  name="address"
                  [(ngModel)]="customerData.address"
                  #addressField="ngModel"
                  required
                  placeholder="Enter address"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="addressField.invalid && addressField.touched">
                Please enter address
              </div>
            </div>

            <!-- Price per Liter Field -->
            <div class="form-group">
              <label for="pricePerLiter">Price per Liter (RWF) *</label>
              <div class="input-container">
                <app-feather-icon name="dollar-sign" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="number"
                  id="pricePerLiter"
                  name="pricePerLiter"
                  [(ngModel)]="customerData.pricePerLiter"
                  #priceField="ngModel"
                  required
                  min="0"
                  step="0.01"
                  placeholder="Price per Liter (RWF)"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="priceField.invalid && priceField.touched">
                Please enter a valid price
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-danger-outline"
                (click)="closeModal()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="customerForm.invalid || isSubmitting"
              >
                <span *ngIf="!isSubmitting">Add Customer</span>
                <span *ngIf="isSubmitting">Adding Customer...</span>
                <app-feather-icon name="loader" size="16px" *ngIf="isSubmitting" class="spinning"></app-feather-icon>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./add-customer-modal.component.scss']
})
export class AddCustomerModalComponent {
  @Output() customerAdded = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  customerData = {
    name: '',
    phone: '',
    email: '',
    address: '',
    pricePerLiter: null as number | null
  };

  isSubmitting = false;

  onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.customerAdded.emit({ ...this.customerData });
      this.isSubmitting = false;
      this.closeModal();
    }, 1500);
  }

  closeModal() {
    this.modalClosed.emit();
  }

  pickContact() {
    // TODO: Implement contact picker functionality
    console.log('Contact picker clicked');
  }
}
