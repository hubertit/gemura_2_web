import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, ACCOUNT_TYPES, AccountType } from '../../../core/services/auth.service';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AuthLayoutComponent, FormInputComponent, AlertComponent],
  template: `
    <app-auth-layout 
      title="Join Gemura"
      authLinkText="Already have an account?"
      authLinkLabel="Sign In"
      authLinkRoute="/login">
      
      <ng-template #formTemplate>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <app-form-input
            type="text"
            placeholder="Full Name"
            iconClass="fas fa-user"
            formControlName="name"
            [isInvalid]="!!(registerForm.get('name')?.invalid && registerForm.get('name')?.touched)"
            errorMessage="Full name is required">
          </app-form-input>

          <app-form-input
            type="text"
            placeholder="Account Name"
            iconClass="fas fa-building"
            formControlName="accountName"
            [isInvalid]="!!(registerForm.get('accountName')?.invalid && registerForm.get('accountName')?.touched)"
            errorMessage="Account name is required">
          </app-form-input>

          <app-form-input
            type="email"
            placeholder="Email (Optional)"
            iconClass="fas fa-envelope"
            formControlName="email"
            [isInvalid]="!!(registerForm.get('email')?.invalid && registerForm.get('email')?.touched)"
            errorMessage="Please enter a valid email address">
          </app-form-input>

          <app-form-input
            type="tel"
            placeholder="Phone Number"
            iconClass="fas fa-phone"
            formControlName="phoneNumber"
            [isInvalid]="!!(registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched)"
            errorMessage="Phone number is required">
          </app-form-input>

          <app-form-input
            type="text"
            placeholder="National ID (Optional)"
            iconClass="fas fa-id-card"
            formControlName="idNumber"
            [isInvalid]="!!(registerForm.get('idNumber')?.invalid && registerForm.get('idNumber')?.touched)"
            errorMessage="Please enter a valid National ID">
          </app-form-input>

          <app-form-input
            type="password"
            placeholder="Password"
            iconClass="fas fa-key"
            formControlName="password"
            [isInvalid]="!!(registerForm.get('password')?.invalid && registerForm.get('password')?.touched)"
            errorMessage="Password is required and must be at least 6 characters"
            [showPasswordToggle]="true">
          </app-form-input>

          <app-form-input
            type="password"
            placeholder="Confirm Password"
            iconClass="fas fa-key"
            formControlName="confirmPassword"
            [isInvalid]="!!(registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched)"
            errorMessage="Passwords do not match"
            [showPasswordToggle]="true">
          </app-form-input>

          <app-form-input
            type="select"
            placeholder="Select Account Type"
            iconClass="fas fa-user-tag"
            formControlName="accountType"
            [isInvalid]="!!(registerForm.get('accountType')?.invalid && registerForm.get('accountType')?.touched)"
            errorMessage="Please select an account type"
            [options]="accountTypeOptions">
          </app-form-input>

          <app-alert 
            type="danger" 
            [message]="errorMessage">
          </app-alert>

          <button type="submit" class="auth-btn" [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
      </ng-template>
    </app-auth-layout>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  accountTypeOptions = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'veterinarian', label: 'Veterinarian' },
    { value: 'supplier', label: 'Supplier' },
    { value: 'customer', label: 'Customer' },
    { value: 'agent', label: 'Agent' },
    { value: 'collector', label: 'Collector' },
    { value: 'mcc', label: 'MCC' }
  ];

      constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
      ) {
        this.registerForm = this.fb.group({
          name: ['Test User', [Validators.required, Validators.minLength(2)]], // Pre-filled test data
          accountName: ['Test Account', [Validators.required, Validators.minLength(2)]], // Pre-filled test data
          email: ['test@example.com', [Validators.email]], // Pre-filled test data
          phoneNumber: ['250788606766', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-\(\)]+$/)]], // Pre-filled test data
          idNumber: ['1234567890123456'], // Pre-filled test data
          password: ['Pass123', [Validators.required, Validators.minLength(6)]], // Pre-filled test data
          confirmPassword: ['Pass123', [Validators.required]], // Pre-filled test data
          accountType: ['farmer', [Validators.required]] // Pre-filled test data
        }, { validators: this.passwordMatchValidator });
      }

  ngOnInit(): void {
    // Component initialization
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }


  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.registerForm.value;
      
      // Prepare registration data matching Flutter app structure
      const registrationData = {
        name: formData.name,
        accountName: formData.accountName,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber,
        idNumber: formData.idNumber || null,
        password: formData.password,
        accountType: formData.accountType
      };

      this.authService.register(registrationData).subscribe({
        next: (user) => {
          this.isLoading = false;
          // Navigate to dashboard after successful registration
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error;
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
