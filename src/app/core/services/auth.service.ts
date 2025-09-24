import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  accountType: string;
  accountCode?: string;
  accountName?: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  about?: string;
  address?: string;
  // KYC Fields
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  idNumber?: string;
  kycStatus?: string;
}

// API Configuration
const API_BASE_URL = 'https://api.gemura.rw/v2';

// Account Types matching Flutter app
export const ACCOUNT_TYPES = {
  MCC: 'mcc',
  AGENT: 'agent', 
  COLLECTOR: 'collector',
  VETERINARIAN: 'veterinarian',
  SUPPLIER: 'supplier',
  CUSTOMER: 'customer',
  FARMER: 'farmer',
  OWNER: 'owner'
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('gemura.user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(identifier: string, password: string): Observable<User> {
    const loginData = {
      identifier: identifier, // Can be email or phone
      password: password
    };

    return this.http.post<any>(`${API_BASE_URL}/auth/login`, loginData).pipe(
      map(response => {
        if (response.success && response.data) {
          const { user, account, token } = response.data;
          
          // Create user object matching Flutter app structure
          const userData: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || user.phone,
            role: account.type,
            accountType: account.type,
            accountCode: account.code,
            accountName: account.name,
            avatar: user.profilePicture || user.profile_img,
            createdAt: new Date(user.createdAt || user.created_at),
            lastLoginAt: new Date(),
            isActive: user.isActive !== false,
            about: user.about,
            address: user.address,
            province: user.province,
            district: user.district,
            sector: user.sector,
            cell: user.cell,
            village: user.village,
            idNumber: user.idNumber || user.id_number,
            kycStatus: user.kycStatus || user.kyc_status
          };

          // Store user info
          this.currentUser = userData;
          localStorage.setItem('gemura.user', JSON.stringify(userData));
          localStorage.setItem('gemura.token', token);
          
          return userData;
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error.error?.message || 'Login failed. Please try again.');
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/logout`, {}).pipe(
      map(() => {
        this.currentUser = null;
        localStorage.removeItem('gemura.user');
        localStorage.removeItem('gemura.token');
      }),
      catchError(() => {
        // Even if logout fails, clear local data
        this.currentUser = null;
        localStorage.removeItem('gemura.user');
        localStorage.removeItem('gemura.token');
        return of(null);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return localStorage.getItem('gemura.token');
  }

  getUserRole(): string {
    return this.currentUser?.role || '';
  }

  register(userData: any): Observable<User> {
    return this.http.post<any>(`${API_BASE_URL}/auth/register`, userData).pipe(
      map(response => {
        if (response.success && response.data) {
          const { user, account, token } = response.data;
          
          const newUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || user.phone,
            role: account.type,
            accountType: account.type,
            accountCode: account.code,
            accountName: account.name,
            avatar: user.profilePicture || user.profile_img,
            createdAt: new Date(user.createdAt || user.created_at),
            isActive: user.isActive !== false,
            about: user.about,
            address: user.address,
            province: user.province,
            district: user.district,
            sector: user.sector,
            cell: user.cell,
            village: user.village,
            idNumber: user.idNumber || user.id_number,
            kycStatus: user.kycStatus || user.kyc_status
          };

          this.currentUser = newUser;
          localStorage.setItem('gemura.user', JSON.stringify(newUser));
          localStorage.setItem('gemura.token', token);
          
          return newUser;
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error.error?.message || 'Registration failed. Please try again.');
      })
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/request-password-reset`, { email }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Password reset request error:', error);
        return throwError(() => error.error?.message || 'Failed to send reset email.');
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/reset-password`, { 
      token, 
      password: newPassword 
    }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Password reset error:', error);
        return throwError(() => error.error?.message || 'Password reset failed.');
      })
    );
  }

  getProfile(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => 'No authentication token found');
    }

    return this.http.get<any>(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          const user = response.data;
          const userData: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || user.phone,
            role: user.role,
            accountType: user.accountType || user.account_type,
            accountCode: user.accountCode || user.account_code,
            accountName: user.accountName || user.account_name,
            avatar: user.profilePicture || user.profile_img,
            createdAt: new Date(user.createdAt || user.created_at),
            lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
            isActive: user.isActive !== false,
            about: user.about,
            address: user.address,
            province: user.province,
            district: user.district,
            sector: user.sector,
            cell: user.cell,
            village: user.village,
            idNumber: user.idNumber || user.id_number,
            kycStatus: user.kycStatus || user.kyc_status
          };

          this.currentUser = userData;
          localStorage.setItem('gemura.user', JSON.stringify(userData));
          return userData;
        } else {
          throw new Error(response.message || 'Failed to fetch profile');
        }
      }),
      catchError(error => {
        console.error('Profile fetch error:', error);
        return throwError(() => error.error?.message || 'Failed to fetch profile.');
      })
    );
  }

  updateProfile(profileData: Partial<User>): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => 'No authentication token found');
    }

    return this.http.put<any>(`${API_BASE_URL}/auth/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => {
        if (response.success && response.data) {
          const user = response.data;
          const updatedUser: User = {
            ...this.currentUser!,
            ...user,
            id: user.id || this.currentUser!.id,
            createdAt: user.createdAt ? new Date(user.createdAt) : this.currentUser!.createdAt
          };

          this.currentUser = updatedUser;
          localStorage.setItem('gemura.user', JSON.stringify(updatedUser));
          return updatedUser;
        } else {
          throw new Error(response.message || 'Profile update failed');
        }
      }),
      catchError(error => {
        console.error('Profile update error:', error);
        return throwError(() => error.error?.message || 'Profile update failed.');
      })
    );
  }

  validatePassword(password: string): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => 'No authentication token found');
    }

    return this.http.post<any>(`${API_BASE_URL}/auth/validate-password`, { password }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => response.success && response.data?.valid === true),
      catchError(() => of(false))
    );
  }
}