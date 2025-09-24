import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <!-- Left side - Login Form -->
      <div class="login-section">
        <div class="login-container">
          <div class="logo-container">
            <img src="assets/img/logo.png" alt="Gemura Logo" class="logo">
          </div>
          <h1>Log In to <span>Gemura</span></h1>
          
          <div class="new-user">
            <span>New Here? </span>
            <a routerLink="/register">Create Account</a>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input 
                  type="text" 
                  formControlName="identifier" 
                  placeholder="Email or Phone Number"
                  [class.is-invalid]="loginForm.get('identifier')?.invalid && loginForm.get('identifier')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="loginForm.get('identifier')?.invalid && loginForm.get('identifier')?.touched">
                Please enter a valid email or phone number
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  formControlName="password" 
                  placeholder="Password"
                  [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <button type="button" class="password-toggle" (click)="togglePassword()">
                  <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
                </button>
              </div>
              <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>

            <div class="alert alert-danger" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button type="submit" class="login-btn" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Logging in...' : 'Log In' }}
            </button>

            <div class="auth-links">
              <a routerLink="/forgot-password" class="forgot-password-link">
                Forgot Password?
              </a>
            </div>
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
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  currentTime = new Date();
  currentYear = new Date().getFullYear();
  errorMessage = '';

      constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
      ) {
        this.loginForm = this.fb.group({
          identifier: ['250788606765', [Validators.required]], // Pre-filled with test credentials
          password: ['Pass123', Validators.required] // Pre-filled with test credentials
        });
      }

  ngOnInit(): void {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
      this.updateClockHands();
    }, 1000);
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

      onSubmit(): void {
        if (this.loginForm.valid) {
          this.isLoading = true;
          this.errorMessage = '';

          const { identifier, password } = this.loginForm.value;

          // Use direct API call with HttpClient
          this.authService.login(identifier, password).subscribe({
            next: (user) => {
              console.log('🔧 LoginComponent: Login successful:', user);
              this.isLoading = false;
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.log('🔧 LoginComponent: Login failed:', error);
              this.isLoading = false;
              this.errorMessage = error;
            }
          });
        } else {
          Object.keys(this.loginForm.controls).forEach(key => {
            const control = this.loginForm.get(key);
            if (control?.invalid) {
              control.markAsTouched();
            }
          });
        }
      }
}