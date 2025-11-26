import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { Customer } from '../../../core/services/customer.service';

@Component({
  selector: 'app-delete-customer-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <!-- Modal -->
    <div class="modal fade" [class.show]="true" [style.display]="'block'" 
         tabindex="-1" role="dialog" [attr.aria-hidden]="false">
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">Delete Customer</h5>
            <button type="button" class="btn-close-custom" (click)="closeModal()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <div class="delete-warning">
            <div class="warning-icon">
              <app-lucide-icon name="alert-triangle" size="48px"></app-lucide-icon>
            </div>
            
            <h3>Are you sure you want to delete this customer?</h3>
            
            <div class="customer-preview">
              <div class="customer-avatar">
                <img [src]="customer.avatar || 'assets/img/user.png'" [alt]="customer.name" class="avatar-img">
              </div>
              <div class="customer-info">
                <div class="customer-name">{{ customer.name }}</div>
                <div class="customer-phone">{{ customer.phone }}</div>
                <div class="customer-address">{{ customer.address || customer.location }}</div>
              </div>
            </div>

            <div class="warning-message">
              <p><strong>This action cannot be undone.</strong></p>
              <p>All customer data, including:</p>
              <ul>
                <li>Customer information</li>
                <li>Purchase history</li>
                <li>Payment records</li>
                <li>Related transactions</li>
              </ul>
              <p>will be permanently deleted.</p>
            </div>
          </div>
        </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger-outline" (click)="closeModal()">Cancel</button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="isDeleting">
              <span *ngIf="!isDeleting">Delete Customer</span>
              <span *ngIf="isDeleting">Deleting...</span>
              <app-lucide-icon name="loader" size="16px" *ngIf="isDeleting" class="spinning"></app-lucide-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show"></div>
  `,
  styleUrls: ['./delete-customer-modal.component.scss']
})
export class DeleteCustomerModalComponent {
  @Input() customer!: Customer;
  @Output() customerDeleted = new EventEmitter<Customer>();
  @Output() modalClosed = new EventEmitter<void>();

  isDeleting = false;

  closeModal() {
    this.modalClosed.emit();
  }

  confirmDelete() {
    if (this.isDeleting) return;

    this.isDeleting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.customerDeleted.emit(this.customer);
      this.isDeleting = false;
      this.closeModal();
    }, 1500);
  }
}
