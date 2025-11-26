import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { Customer } from '../../../core/services/customer.service';

@Component({
  selector: 'app-view-customer-modal',
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
            <h5 class="modal-title">Customer Details</h5>
            <button type="button" class="btn-close-custom" (click)="closeModal()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <div class="customer-info">
            <!-- Customer Avatar -->
            <div class="customer-avatar">
              <img [src]="customer.avatar || 'assets/img/user.png'" [alt]="customer.name" class="avatar-img">
            </div>

            <!-- Customer Details -->
            <div class="customer-details">
              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="user" size="16px"></app-lucide-icon>
                  Name
                </div>
                <div class="detail-value">{{ customer.name }}</div>
              </div>

              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="phone" size="16px"></app-lucide-icon>
                  Phone
                </div>
                <div class="detail-value">{{ customer.phone }}</div>
              </div>

              <div class="detail-row" *ngIf="customer.email">
                <div class="detail-label">
                  <app-lucide-icon name="mail" size="16px"></app-lucide-icon>
                  Email
                </div>
                <div class="detail-value">{{ customer.email }}</div>
              </div>

              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="map-pin" size="16px"></app-lucide-icon>
                  Address
                </div>
                <div class="detail-value">{{ customer.address || customer.location }}</div>
              </div>

              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="dollar-sign" size="16px"></app-lucide-icon>
                  Price per Liter
                </div>
                <div class="detail-value">{{ formatCurrency(customer.pricePerLiter || customer.buyingPricePerLiter) }}</div>
              </div>

              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="tag" size="16px"></app-lucide-icon>
                  Customer Type
                </div>
                <div class="detail-value">{{ customer.customerType || 'Individual' }}</div>
              </div>

              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="credit-card" size="16px"></app-lucide-icon>
                  Payment Method
                </div>
                <div class="detail-value">{{ customer.paymentMethod || 'Cash' }}</div>
              </div>

              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="calendar" size="16px"></app-lucide-icon>
                  Registered
                </div>
                <div class="detail-value">{{ formatDate(customer.registrationDate || customer.createdAt) }}</div>
              </div>

              <div class="detail-row">
                <div class="detail-label">
                  <app-lucide-icon name="activity" size="16px"></app-lucide-icon>
                  Status
                </div>
                <div class="detail-value">
                  <span class="status-badge" [class.active]="customer.status === 'Active' || customer.isActive">
                    {{ customer.status || (customer.isActive ? 'Active' : 'Inactive') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger-outline" (click)="closeModal()">Close</button>
            <button type="button" class="btn btn-primary" (click)="editCustomer()">Edit Customer</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show"></div>
  `,
  styleUrls: ['./view-customer-modal.component.scss']
})
export class ViewCustomerModalComponent {
  @Input() customer!: Customer;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<Customer>();

  closeModal() {
    this.modalClosed.emit();
  }

  editCustomer() {
    this.editRequested.emit(this.customer);
    this.closeModal();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
