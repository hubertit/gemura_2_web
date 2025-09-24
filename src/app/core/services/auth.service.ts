import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
  // Additional fields from Flutter app
  token?: string;
  permissions?: { [key: string]: boolean };
  isAgentCandidate?: boolean;
}

// API Configuration - matching Flutter app exactly
const API_BASE_URL = 'https://api.gemura.rw/v2';
const AUTH_ENDPOINT = '/auth';

// Account Types matching Flutter app exactly
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

// Registration request interface matching Flutter app
export interface RegistrationRequest {
  name: string;
  account_name: string;
  email?: string;
  phone: string;
  password: string;
  nid?: string;
  role: string;
  account_type: string;
  permissions?: { [key: string]: boolean };
  is_agent_candidate?: boolean;
}

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
    // Use identifier field as per API specification - matching Flutter app exactly
    const loginData = {
      identifier: identifier, // Can be email or phone
      password: password
    };

    console.log('🔧 AuthService: Attempting login with:', { identifier, password: '***' });
    console.log('🔧 AuthService: API URL:', `${API_BASE_URL}${AUTH_ENDPOINT}/login`);

    // Use fetch API to bypass CORS issues
    return from(fetch(`${API_BASE_URL}${AUTH_ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData),
      mode: 'cors'
    }).then(response => {
      return response.json().then(data => {
        // Check if the API returned an error response
        if (data.code && data.status === 'error') {
          throw new Error(data.message || 'Login failed');
        }
        return data;
      });
    })).pipe(
      map((response: any) => {
        console.log('🔧 AuthService: Full API response:', response);
        console.log('🔧 AuthService: Response code:', response.code);
        console.log('🔧 AuthService: Response status:', response.status);
        
        // Handle the actual API response structure from curl test
        if (response.code === 200 && response.status === 'success') {
          const data = response.data;
          console.log('🔧 AuthService: Response data:', data);
          if (data) {
            const { user, account } = data;
            
            // Create user object matching the actual API response structure
            const userData: User = {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              phoneNumber: user.phone,
              role: account?.type || user.account_type,
              accountType: account?.type || user.account_type || 'mcc',
              accountCode: account?.code,
              accountName: account?.name,
              avatar: user.profilePicture || user.profile_img,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              isActive: user.status === 'active',
              about: user.about,
              address: user.address,
              province: user.province,
              district: user.district,
              sector: user.sector,
              cell: user.cell,
              village: user.village,
              idNumber: user.idNumber || user.id_number,
              kycStatus: user.kycStatus || user.kyc_status,
              token: user.token,
              permissions: user.permissions,
              isAgentCandidate: user.isAgentCandidate || false
            };

            // Store user info - matching Flutter app storage keys
            this.currentUser = userData;
            localStorage.setItem('gemura.user', JSON.stringify(userData));
            localStorage.setItem('gemura.token', userData.token || '');
            localStorage.setItem('gemura.isLoggedIn', 'true');
            
            return userData;
          }
        }
        
        // Handle error responses (401, 400, etc.)
        if (response.code && response.status === 'error') {
          throw new Error(response.message || 'Login failed');
        }
        
        // Fallback for unexpected response structure
        throw new Error('Unexpected response format');
      }),
      catchError(error => {
        console.error('🔧 AuthService: Login error:', error);
        console.error('🔧 AuthService: Error message:', error.message);
        
        // Handle fetch API errors properly
        if (error.message) {
          return throwError(() => error.message);
        }
        
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          return throwError(() => 'Please check your internet connection and try again.');
        }
        
        // Fallback error message
        return throwError(() => 'An unexpected error occurred. Please try again.');
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${API_BASE_URL}${AUTH_ENDPOINT}/logout`, {}).pipe(
      map(() => {
        this.clearLocalData();
      }),
      catchError(() => {
        // Even if logout fails, clear local data - matching Flutter app behavior
        this.clearLocalData();
        return of(null);
      })
    );
  }

  private clearLocalData(): void {
    this.currentUser = null;
    localStorage.removeItem('gemura.user');
    localStorage.removeItem('gemura.token');
    localStorage.removeItem('gemura.isLoggedIn');
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
    // Transform userData to match Flutter app's RegistrationRequest structure
    const registrationRequest: RegistrationRequest = {
      name: userData.name,
      account_name: userData.accountName,
      email: userData.email,
      phone: userData.phoneNumber,
      password: userData.password,
      nid: userData.idNumber,
      role: userData.accountType,
      account_type: userData.accountType,
      permissions: userData.permissions || {},
      is_agent_candidate: userData.isAgentCandidate || false
    };

    return this.http.post<any>(`${API_BASE_URL}${AUTH_ENDPOINT}/register`, registrationRequest).pipe(
      map(response => {
        // Handle response structure matching Flutter app
        if (response.statusCode === 200 || response.statusCode === 201) {
          const data = response.data;
          if (data) {
            const { user, account, token } = data;
            
            const newUser: User = {
              id: user.id,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber || user.phone,
              role: account?.type || user.role,
              accountType: account?.type || user.accountType || 'mcc',
              accountCode: account?.code,
              accountName: account?.name,
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
              kycStatus: user.kycStatus || user.kyc_status,
              token: user.token || token,
              permissions: user.permissions,
              isAgentCandidate: user.isAgentCandidate || false
            };

            // Store user info - matching Flutter app storage keys
            this.currentUser = newUser;
            localStorage.setItem('gemura.user', JSON.stringify(newUser));
            localStorage.setItem('gemura.token', newUser.token || token);
            localStorage.setItem('gemura.isLoggedIn', 'true');
            
            return newUser;
          }
        }
        throw new Error(response.message || 'Registration failed');
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => this.handleHttpError(error));
      })
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    // Matching Flutter app's requestPasswordReset method
    const data: any = {};
    if (email && email.trim() !== '') {
      data.email = email;
    }

    return this.http.post(`${API_BASE_URL}${AUTH_ENDPOINT}/request_reset.php`, data).pipe(
      map(response => response),
      catchError(error => {
        console.error('Password reset request error:', error);
        return throwError(() => this.handleHttpError(error));
      })
    );
  }

  resetPassword(userId: number, resetCode: string, newPassword: string): Observable<any> {
    // Matching Flutter app's resetPasswordWithCode method
    return this.http.post(`${API_BASE_URL}${AUTH_ENDPOINT}/reset_password.php`, {
      user_id: userId,
      reset_code: resetCode,
      new_password: newPassword
    }).pipe(
      map(response => response),
      catchError(error => {
        console.error('Password reset error:', error);
        return throwError(() => this.handleHttpError(error));
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse): string {
    // Error handling matching Flutter app's _handleDioError method
    if (error.status === 0) {
      return 'Please check your internet connection and try again.';
    }
    
    switch (error.status) {
      case 400:
        return `Bad request: ${error.error?.message || 'Invalid request'}`;
      case 401:
        return 'Authentication failed. Please try again.';
      case 403:
        return `Access denied: ${error.error?.message || 'Insufficient permissions'}`;
      case 404:
        return `Resource not found: ${error.error?.message || 'Requested resource not found'}`;
      case 422:
        return `Validation error: ${error.error?.message || 'Please check your input'}`;
      case 500:
        return 'Something went wrong. Please try again later.';
      default:
        return `Error ${error.status}: ${error.error?.message || 'An unexpected error occurred'}`;
    }
  }

  getProfile(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => 'No authentication token found');
    }

    // Matching Flutter app's getProfile method - using POST with token in body
    return this.http.post<any>(`${API_BASE_URL}/profile/get.php`, { token }).pipe(
      map(response => {
        if (response.statusCode === 200 && response.data) {
          const user = response.data.user;
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
            kycStatus: user.kycStatus || user.kyc_status,
            token: user.token,
            permissions: user.permissions,
            isAgentCandidate: user.isAgentCandidate
          };

          // Update cached user data
          this.currentUser = userData;
          localStorage.setItem('gemura.user', JSON.stringify(userData));
          return userData;
        } else {
          throw new Error(response.message || 'Failed to fetch profile');
        }
      }),
      catchError(error => {
        console.error('Profile fetch error:', error);
        // If API call fails, try to get from cache as fallback - matching Flutter app
        const cachedUserData = localStorage.getItem('gemura.user');
        if (cachedUserData) {
          const userData = JSON.parse(cachedUserData);
          this.currentUser = userData;
          return of(userData);
        }
        return throwError(() => this.handleHttpError(error));
      })
    );
  }

  updateProfile(profileData: Partial<User>): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => 'No authentication token found');
    }

    // Matching Flutter app's updateProfile method - using POST with token in body
    const body = {
      token: token,
      ...profileData
    };

    return this.http.post<any>(`${API_BASE_URL}/profile/update.php`, body).pipe(
      map(response => {
        if (response.statusCode === 200 && response.data) {
          const updatedUser = response.data.user;
          const userData: User = {
            ...this.currentUser!,
            ...updatedUser,
            id: updatedUser.id || this.currentUser!.id,
            createdAt: updatedUser.createdAt ? new Date(updatedUser.createdAt) : this.currentUser!.createdAt
          };

          // Update cached user data
          this.currentUser = userData;
          localStorage.setItem('gemura.user', JSON.stringify(userData));
          return userData;
        } else {
          throw new Error(response.message || 'Profile update failed');
        }
      }),
      catchError(error => {
        console.error('Profile update error:', error);
        return throwError(() => this.handleHttpError(error));
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