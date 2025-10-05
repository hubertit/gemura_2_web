import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherIconComponent } from '../feather-icon/feather-icon.component';
import { SuppliersService } from '../../../features/suppliers/suppliers.service';
import { CreateSupplierRequest } from '../../../features/suppliers/supplier.model';

@Component({
  selector: 'app-add-supplier-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FeatherIconComponent],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2>Add Supplier</h2>
          <button class="close-btn" (click)="closeModal()">
            <app-feather-icon name="x" size="20px"></app-feather-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form #supplierForm="ngForm" (ngSubmit)="onSubmit()">
            <!-- Name Field -->
            <div class="form-group">
              <label for="name">Supplier Name *</label>
              <div class="input-container">
                <app-feather-icon name="user" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="supplierData.name"
                  #nameField="ngModel"
                  required
                  placeholder="Enter supplier name"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="nameField.invalid && nameField.touched">
                Please enter supplier name
              </div>
            </div>

            <!-- Phone Field -->
            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <div class="unified-phone-input">
                <div class="phone-input-wrapper">
                  <div class="country-code-section">
                    <select [(ngModel)]="supplierData.countryCode" name="countryCode" class="country-code-select">
                      <option *ngFor="let country of countryCodes" [value]="country.code">
                        {{ country.flag }} {{ country.code }}
                      </option>
                    </select>
                  </div>
                  <div class="phone-number-section">
                    <app-feather-icon name="phone" size="18px" class="input-icon"></app-feather-icon>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      [(ngModel)]="supplierData.phone"
                      #phoneField="ngModel"
                      required
                      placeholder="788606765"
                      class="phone-input"
                    />
                  </div>
                </div>
              </div>
              <div class="error-message" *ngIf="phoneField.invalid && phoneField.touched">
                Please enter phone number
              </div>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-container">
                <app-feather-icon name="mail" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="supplierData.email"
                  placeholder="supplier@example.com"
                  class="form-input"
                />
              </div>
            </div>

            <!-- Location Field -->
            <div class="form-group">
              <label for="location">Location *</label>
              <div class="input-container">
                <app-feather-icon name="map-pin" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="text"
                  id="location"
                  name="location"
                  [(ngModel)]="supplierData.location"
                  #locationField="ngModel"
                  required
                  placeholder="Enter location"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="locationField.invalid && locationField.touched">
                Please enter location
              </div>
            </div>

            <!-- Business Type Field -->
            <div class="form-group">
              <label for="businessType">Business Type *</label>
              <div class="input-container">
                <app-feather-icon name="briefcase" size="18px" class="input-icon"></app-feather-icon>
                <select
                  id="businessType"
                  name="businessType"
                  [(ngModel)]="supplierData.businessType"
                  #businessTypeField="ngModel"
                  required
                  class="form-select"
                >
                  <option value="">Select business type</option>
                  <option value="individual">Individual</option>
                  <option value="cooperative">Cooperative</option>
                  <option value="farm">Farm</option>
                </select>
              </div>
              <div class="error-message" *ngIf="businessTypeField.invalid && businessTypeField.touched">
                Please select business type
              </div>
            </div>

            <!-- Farm Type Field -->
            <div class="form-group">
              <label for="farmType">Farm Type *</label>
              <div class="input-container">
                <app-feather-icon name="home" size="18px" class="input-icon"></app-feather-icon>
                <select
                  id="farmType"
                  name="farmType"
                  [(ngModel)]="supplierData.farmType"
                  #farmTypeField="ngModel"
                  required
                  class="form-select"
                >
                  <option value="">Select farm type</option>
                  <option value="dairy">Dairy Farm</option>
                  <option value="mixed">Mixed Farm</option>
                  <option value="specialized">Specialized Dairy</option>
                </select>
              </div>
              <div class="error-message" *ngIf="farmTypeField.invalid && farmTypeField.touched">
                Please select farm type
              </div>
            </div>

            <!-- Cattle Count Field -->
            <div class="form-group">
              <label for="cattleCount">Number of Cattle *</label>
              <div class="input-container">
                <app-feather-icon name="users" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="number"
                  id="cattleCount"
                  name="cattleCount"
                  [(ngModel)]="supplierData.cattleCount"
                  #cattleCountField="ngModel"
                  required
                  min="1"
                  placeholder="Enter number of cattle"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="cattleCountField.invalid && cattleCountField.touched">
                Please enter number of cattle
              </div>
            </div>

            <!-- Daily Production Field -->
            <div class="form-group">
              <label for="dailyProduction">Daily Production (L) *</label>
              <div class="input-container">
                <app-feather-icon name="droplet" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="number"
                  id="dailyProduction"
                  name="dailyProduction"
                  [(ngModel)]="supplierData.dailyProduction"
                  #dailyProductionField="ngModel"
                  required
                  min="0"
                  step="0.1"
                  placeholder="Enter daily production"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="dailyProductionField.invalid && dailyProductionField.touched">
                Please enter daily production
              </div>
            </div>

            <!-- Price per Liter Field -->
            <div class="form-group">
              <label for="sellingPricePerLiter">Price per Liter (RWF) *</label>
              <div class="input-container">
                <app-feather-icon name="dollar-sign" size="18px" class="input-icon"></app-feather-icon>
                <input
                  type="number"
                  id="sellingPricePerLiter"
                  name="sellingPricePerLiter"
                  [(ngModel)]="supplierData.sellingPricePerLiter"
                  #sellingPriceField="ngModel"
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price per liter"
                  class="form-input"
                />
              </div>
              <div class="error-message" *ngIf="sellingPriceField.invalid && sellingPriceField.touched">
                Please enter price per liter
              </div>
            </div>

            <!-- Quality Grade Field -->
            <div class="form-group">
              <label for="qualityGrades">Quality Grade *</label>
              <div class="input-container">
                <app-feather-icon name="award" size="18px" class="input-icon"></app-feather-icon>
                <select
                  id="qualityGrades"
                  name="qualityGrades"
                  [(ngModel)]="supplierData.qualityGrades"
                  #qualityGradesField="ngModel"
                  required
                  class="form-select"
                >
                  <option value="">Select quality grade</option>
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Basic)</option>
                </select>
              </div>
              <div class="error-message" *ngIf="qualityGradesField.invalid && qualityGradesField.touched">
                Please select quality grade
              </div>
            </div>

            <!-- Collection Schedule Field -->
            <div class="form-group">
              <label for="collectionSchedule">Collection Schedule *</label>
              <div class="input-container">
                <app-feather-icon name="calendar" size="18px" class="input-icon"></app-feather-icon>
                <select
                  id="collectionSchedule"
                  name="collectionSchedule"
                  [(ngModel)]="supplierData.collectionSchedule"
                  #collectionScheduleField="ngModel"
                  required
                  class="form-select"
                >
                  <option value="">Select collection schedule</option>
                  <option value="daily">Daily</option>
                  <option value="twice-daily">Twice Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom Schedule</option>
                </select>
              </div>
              <div class="error-message" *ngIf="collectionScheduleField.invalid && collectionScheduleField.touched">
                Please select collection schedule
              </div>
            </div>

            <!-- Payment Method Field -->
            <div class="form-group">
              <label for="paymentMethod">Payment Method *</label>
              <div class="input-container">
                <app-feather-icon name="credit-card" size="18px" class="input-icon"></app-feather-icon>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  [(ngModel)]="supplierData.paymentMethod"
                  #paymentMethodField="ngModel"
                  required
                  class="form-select"
                >
                  <option value="">Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="mobile-money">Mobile Money</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <div class="error-message" *ngIf="paymentMethodField.invalid && paymentMethodField.touched">
                Please select payment method
              </div>
            </div>

            <!-- Notes Field -->
            <div class="form-group">
              <label for="notes">Notes</label>
              <div class="input-container">
                <app-feather-icon name="file-text" size="18px" class="input-icon"></app-feather-icon>
                <textarea
                  id="notes"
                  name="notes"
                  [(ngModel)]="supplierData.notes"
                  placeholder="Enter any additional notes"
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button type="button" class="btn btn-danger-outline" (click)="closeModal()">
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="supplierForm.invalid || isSubmitting"
              >
                <span *ngIf="isSubmitting" class="loading-spinner"></span>
                {{ isSubmitting ? 'Adding Supplier...' : 'Add Supplier' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./add-supplier-modal.component.scss']
})
export class AddSupplierModalComponent implements OnInit {
  @Output() supplierAdded = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  supplierData: CreateSupplierRequest = {
    name: '',
    phone: '',
    email: '',
    location: '',
    gpsCoordinates: '',
    businessType: '',
    cattleCount: 0,
    dailyProduction: 0,
    farmType: '',
    collectionSchedule: '',
    sellingPricePerLiter: 0,
    qualityGrades: '',
    paymentMethod: '',
    bankAccount: '',
    mobileMoneyNumber: '',
    idNumber: '',
    notes: '',
    countryCode: '+250'
  };

  countryCode = '+250';
  isSubmitting = false;

  countryCodes = [
    { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
    { code: '+256', flag: '🇺🇬', name: 'Uganda' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
    { code: '+243', flag: '🇨🇩', name: 'DRC' },
    { code: '+257', flag: '🇧🇮', name: 'Burundi' }
  ];

  private suppliersService = inject(SuppliersService);

  ngOnInit() {
    this.supplierData.countryCode = '+250';
  }

  onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // Combine country code with phone number
    const fullPhone = this.supplierData.countryCode + this.supplierData.phone;

    const supplierData = {
      ...this.supplierData,
      phone: fullPhone
    };

    this.suppliersService.createSupplier(supplierData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.code === 200) {
          console.log('Supplier created successfully:', response);
          this.supplierAdded.emit(response.data);
          this.closeModal();
        } else {
          console.error('Failed to create supplier:', response.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating supplier:', error);
      }
    });
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
