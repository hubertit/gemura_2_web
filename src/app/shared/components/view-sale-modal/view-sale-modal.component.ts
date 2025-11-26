import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { Sale } from '../../../features/sales/sale.model';

@Component({
  selector: 'app-view-sale-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Sale Details</h2>
          <button class="close-btn" (click)="closeModal()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="sale-info">
            <div class="info-row">
              <div class="info-label">
                <app-lucide-icon name="user" size="16px"></app-lucide-icon>
                Customer
              </div>
              <div class="info-value">{{ sale.customerName }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <app-lucide-icon name="phone" size="16px"></app-lucide-icon>
                Phone
              </div>
              <div class="info-value">{{ sale.customerPhone }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <app-lucide-icon name="droplet" size="16px"></app-lucide-icon>
                Quantity
              </div>
              <div class="info-value">{{ sale.quantity }} L</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <app-lucide-icon name="dollar-sign" size="16px"></app-lucide-icon>
                Price per Liter
              </div>
              <div class="info-value">{{ formatCurrency(sale.pricePerLiter) }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <app-lucide-icon name="credit-card" size="16px"></app-lucide-icon>
                Total Value
              </div>
              <div class="info-value total">{{ formatCurrency(sale.totalValue) }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <app-lucide-icon name="calendar" size="16px"></app-lucide-icon>
                Sale Date
              </div>
              <div class="info-value">{{ formatDate(sale.saleAt) }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">
                <app-lucide-icon name="activity" size="16px"></app-lucide-icon>
                Status
              </div>
              <div class="info-value">
                <span class="status-badge" [ngClass]="'status-' + sale.status">
                  {{ getStatusLabel(sale.status) }}
                </span>
              </div>
            </div>

            <div class="info-row" *ngIf="sale.rejectionReason">
              <div class="info-label">
                <app-lucide-icon name="alert-circle" size="16px"></app-lucide-icon>
                Rejection Reason
              </div>
              <div class="info-value rejection">{{ sale.rejectionReason }}</div>
            </div>

            <div class="info-row" *ngIf="sale.notes">
              <div class="info-label">
                <app-lucide-icon name="file-text" size="16px"></app-lucide-icon>
                Notes
              </div>
              <div class="info-value">{{ sale.notes }}</div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="closeModal()">Close</button>
          <button class="btn-danger" *ngIf="sale.status === 'pending'" (click)="onCancel()">
            <app-lucide-icon name="x-circle" size="16px"></app-lucide-icon>
            Cancel Sale
          </button>
          <button class="btn-primary" *ngIf="sale.status === 'pending'" (click)="onEdit()">
            <app-lucide-icon name="edit-2" size="16px"></app-lucide-icon>
            Edit
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
    }

    .modal-container {
      background: white;
      border-radius: 4px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid #e9ecef;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e9ecef;
      background: #f8fafc;

      h2 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
      }

      .close-btn {
        background: #fff;
        border: 2px solid #e5e7eb;
        color: #475569;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #dc3545;
          border-color: #dc3545;
          color: #fff;
          transform: scale(1.05);
        }
      }
    }

    .modal-body {
      padding: 20px;
    }

    .sale-info {
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f1f5f9;

        &:last-child {
          border-bottom: none;
        }
      }

      .info-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
      }

      .info-value {
        font-size: 0.875rem;
        color: #1e293b;
        font-weight: 500;

        &.total {
          font-size: 1rem;
          font-weight: 600;
          color: #004AAD;
        }

        &.rejection {
          color: #dc2626;
        }
      }
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;

      &.status-pending {
        background: #fef3c7;
        color: #d97706;
      }

      &.status-accepted {
        background: #d1fae5;
        color: #059669;
      }

      &.status-rejected {
        background: #fee2e2;
        color: #dc2626;
      }

      &.status-cancelled {
        background: #f3f4f6;
        color: #6b7280;
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid #e9ecef;
      background: #f8fafc;
    }

    .btn-secondary, .btn-primary, .btn-danger {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
    }

    .btn-secondary {
      background: white;
      color: #64748b;
      border: 1px solid #e2e8f0;

      &:hover {
        background: #f8fafc;
      }
    }

    .btn-primary {
      background: #004AAD;
      color: white;

      &:hover {
        background: #003d91;
      }
    }

    .btn-danger {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;

      &:hover {
        background: #fee2e2;
      }
    }
  `]
})
export class ViewSaleModalComponent {
  @Input() sale!: Sale;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<Sale>();
  @Output() cancelRequested = new EventEmitter<Sale>();

  closeModal() {
    this.modalClosed.emit();
  }

  onEdit() {
    this.editRequested.emit(this.sale);
  }

  onCancel() {
    this.cancelRequested.emit(this.sale);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount || 0);
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }
}

