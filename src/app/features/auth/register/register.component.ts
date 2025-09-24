import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, ACCOUNT_TYPES, AccountType } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <!-- Left side - Registration Form -->
      <div class="login-section">
        <div class="login-container">
          <div class="logo-container">
            <img src="assets/img/logo.png" alt="Gemura Logo" class="logo">
          </div>
          <h1>Join <span>Gemura</span></h1>
          
          <div class="new-user">
            <span>Already have an account? </span>
            <a routerLink="/login">Sign In</a>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="Full Name"
                  [class.is-invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
                <span *ngIf="registerForm.get('name')?.hasError('required')">Full name is required</span>
                <span *ngIf="registerForm.get('name')?.hasError('minlength')">Name must be at least 2 characters</span>
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-building"></i>
                <input 
                  type="text" 
                  formControlName="accountName" 
                  placeholder="Account Name"
                  [class.is-invalid]="registerForm.get('accountName')?.invalid && registerForm.get('accountName')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('accountName')?.invalid && registerForm.get('accountName')?.touched">
                <span *ngIf="registerForm.get('accountName')?.hasError('required')">Account name is required</span>
                <span *ngIf="registerForm.get('accountName')?.hasError('minlength')">Account name must be at least 2 characters</span>
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-envelope"></i>
                <input 
                  type="email" 
                  formControlName="email" 
                  placeholder="Email (Optional)"
                  [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-phone"></i>
                <input 
                  type="tel" 
                  formControlName="phoneNumber" 
                  placeholder="Phone Number"
                  [class.is-invalid]="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched">
                <span *ngIf="registerForm.get('phoneNumber')?.hasError('required')">Phone number is required</span>
                <span *ngIf="registerForm.get('phoneNumber')?.hasError('pattern')">Please enter a valid phone number</span>
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-id-card"></i>
                <input 
                  type="text" 
                  formControlName="idNumber" 
                  placeholder="National ID (Optional)"
                  [class.is-invalid]="registerForm.get('idNumber')?.invalid && registerForm.get('idNumber')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('idNumber')?.invalid && registerForm.get('idNumber')?.touched">
                Please enter a valid National ID
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-key"></i>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  formControlName="password" 
                  placeholder="Password"
                  [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                <button type="button" class="password-toggle" (click)="togglePassword()">
                  <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
                </button>
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                Password is required and must be at least 6 characters
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-key"></i>
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'" 
                  formControlName="confirmPassword" 
                  placeholder="Confirm Password"
                  [class.is-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                <button type="button" class="password-toggle" (click)="toggleConfirmPassword()">
                  <i class="fas" [class.fa-eye]="!showConfirmPassword" [class.fa-eye-slash]="showConfirmPassword"></i>
                </button>
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                <span *ngIf="registerForm.get('confirmPassword')?.hasError('required')">Confirm password is required</span>
                <span *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">Passwords do not match</span>
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-user-tag"></i>
                <select 
                  formControlName="accountType" 
                  [class.is-invalid]="registerForm.get('accountType')?.invalid && registerForm.get('accountType')?.touched">
                  <option value="">Select Account Type</option>
                  <option value="farmer">Farmer</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="supplier">Supplier</option>
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                  <option value="collector">Collector</option>
                  <option value="mcc">MCC</option>
                </select>
              </div>
              <div class="invalid-feedback" *ngIf="registerForm.get('accountType')?.invalid && registerForm.get('accountType')?.touched">
                Please select an account type
              </div>
            </div>

            <div class="alert alert-danger" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button type="submit" class="login-btn" [disabled]="registerForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <div class="footer-text">
            <p>© {{ currentYear }} Gemura</p>
            <p>A comprehensive dairy farming management system</p>
            <p>Developed for Rwandan Dairy Farmers</p>
          </div>
        </div>
      </div>

      <!-- Right side - Background with Clock -->
      <div class="background-section">
        <div class="analog-clock">
          <div class="clock-face">
            <div class="numbers">
              <span>12</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
            </div>
            <div class="hand hour-hand"></div>
            <div class="hand minute-hand"></div>
            <div class="hand second-hand"></div>
            <div class="center-dot"></div>
          </div>
          <div class="date">{{ currentTime | date:'EEEE, MMMM d, y' }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  currentTime = new Date();
  currentYear = new Date().getFullYear();
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      accountName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]], // Optional
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-\(\)]+$/)]],
      idNumber: [''], // Optional
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      accountType: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
      this.updateClockHands();
    }, 1000);
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

  private updateClockHands(): void {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Calculate rotation angles
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hourDegrees = ((hours + minutes / 60) / 12) * 360;

    // Update hand rotations using CSS custom properties
    document.documentElement.style.setProperty('--second-rotation', `${secondDegrees}deg`);
    document.documentElement.style.setProperty('--minute-rotation', `${minuteDegrees}deg`);
    document.documentElement.style.setProperty('--hour-rotation', `${hourDegrees}deg`);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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
