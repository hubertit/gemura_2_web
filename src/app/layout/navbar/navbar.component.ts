import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent],
  template: `
    <nav class="navbar" [class.sidebar-collapsed]="isSidebarCollapsed">
      <div class="navbar-left">
        <button class="menu-toggle" (click)="onToggleSidebar()">
          <app-feather-icon name="menu" size="18px"></app-feather-icon>
        </button>
        
        <div class="datetime-display">
          <div class="time">{{ currentTime }}</div>
          <div class="date">{{ currentDate }}</div>
        </div>
      </div>

      <div class="navbar-right">
        <div class="nav-item">
          <button class="icon-button">
            <app-feather-icon name="bell" size="18px"></app-feather-icon>
            <span class="badge">3</span>
          </button>
        </div>

        <div class="nav-item">
          <button class="icon-button">
            <app-feather-icon name="mail" size="18px"></app-feather-icon>
            <span class="badge">5</span>
          </button>
        </div>

        <div class="nav-item language-switcher" (click)="toggleLanguageMenu()">
          <button class="language-button">
            <img [src]="currentLanguage.flag" [alt]="currentLanguage.name" class="language-flag">
            <span class="language-name">{{ currentLanguage.code }}</span>
            <app-feather-icon name="chevron-down" size="14px"></app-feather-icon>
          </button>

          <!-- Language Dropdown Menu -->
          <div class="language-menu" *ngIf="showLanguageMenu">
            <div class="menu-items">
              <button 
                class="language-option" 
                *ngFor="let language of languages"
                [class.active]="language.code === currentLanguage.code"
                (click)="selectLanguage(language)">
                <img [src]="language.flag" [alt]="language.name" class="flag">
                <span class="name">{{ language.name }}</span>
                <app-feather-icon name="check" size="14px" *ngIf="language.code === currentLanguage.code"></app-feather-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="nav-item user-profile" (click)="toggleUserMenu()">
          <img [src]="currentAccount.avatar" [alt]="currentAccount.name" class="avatar">
          <div class="user-info">
            <span class="user-name">{{ currentAccount.name }}</span>
            <span class="user-role">{{ currentAccount.role }}</span>
          </div>
          <app-feather-icon name="chevron-down" size="16px"></app-feather-icon>

          <!-- User Dropdown Menu -->
          <div class="user-menu" *ngIf="showUserMenu">
            <div class="menu-header">
              <img [src]="currentAccount.avatar" [alt]="currentAccount.name" class="avatar">
              <div>
                <h6>{{ currentAccount.name }}</h6>
                <span>{{ currentAccount.role }}</span>
              </div>
            </div>
            
            <!-- Account Switcher Section -->
            <div class="account-switcher-section">
              <div class="section-header">
                <h6>Switch Account</h6>
                <button class="add-account-btn" (click)="addNewAccount()">
                  <app-feather-icon name="plus" size="14px"></app-feather-icon>
                </button>
              </div>
              <div class="account-options">
                <button 
                  class="account-option" 
                  *ngFor="let account of availableAccounts"
                  [class.active]="account.id === currentAccount.id"
                  (click)="selectAccount(account)">
                  <img [src]="account.avatar" [alt]="account.name" class="avatar">
                  <div class="account-details">
                    <span class="name">{{ account.name }}</span>
                    <span class="role">{{ account.role }}</span>
                  </div>
                  <app-feather-icon name="check" size="14px" *ngIf="account.id === currentAccount.id"></app-feather-icon>
                </button>
              </div>
            </div>

            <div class="divider"></div>
            
            <div class="menu-items">
              <a href="javascript:void(0)" class="menu-item">
                <app-feather-icon name="user" size="16px"></app-feather-icon>
                <span>My Profile</span>
              </a>
              <a href="javascript:void(0)" class="menu-item">
                <app-feather-icon name="settings" size="16px"></app-feather-icon>
                <span>Settings</span>
              </a>
              <div class="divider"></div>
              <a href="javascript:void(0)" class="menu-item" (click)="lockScreen()">
                <app-feather-icon name="lock" size="16px"></app-feather-icon>
                <span>Lock Screen</span>
              </a>
              <a href="javascript:void(0)" class="menu-item" (click)="logout()">
                <app-feather-icon name="log-out" size="16px"></app-feather-icon>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() isSidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  userName: string;
  userRole: string;
  showUserMenu = false;
  showLanguageMenu = false;
  
  currentTime: string = '';
  currentDate: string = '';
  private timeInterval: any;

  currentAccount = {
    id: '1',
    name: 'John Doe',
    role: 'Admin',
    avatar: 'assets/img/user.png'
  };

  availableAccounts = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Admin',
      avatar: 'assets/img/user.png'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Manager',
      avatar: 'assets/img/user.png'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'User',
      avatar: 'assets/img/user.png'
    }
  ];

  currentLanguage = {
    code: 'EN',
    name: 'English',
    flag: 'assets/img/flags/us.svg'
  };

  languages = [
    {
      code: 'EN',
      name: 'English',
      flag: 'assets/img/flags/us.svg'
    },
    {
      code: 'FR',
      name: 'Français',
      flag: 'assets/img/flags/fr.svg'
    },
    {
      code: 'RW',
      name: 'Kinyarwanda',
      flag: 'assets/img/flags/rw.svg'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';
    this.userRole = user?.role || 'Guest';
  }

  ngOnInit() {
    this.updateDateTime();
    // Update time every second
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateDateTime() {
    const now = new Date();
    
    // Format time (HH:MM:SS)
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Format date (Day, Month DD, YYYY)
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showLanguageMenu = false;
  }

  selectAccount(account: any): void {
    this.currentAccount = account;
    this.showUserMenu = false;
    // TODO: Implement account switching logic
    console.log('Account switched to:', account.name);
  }

  addNewAccount(): void {
    this.showUserMenu = false;
    // TODO: Implement add new account logic
    console.log('Add new account clicked');
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
    this.showUserMenu = false;
  }

  selectLanguage(language: any): void {
    this.currentLanguage = language;
    this.showLanguageMenu = false;
    // TODO: Implement language change logic
    console.log('Language changed to:', language.name);
  }

  lockScreen(): void {
    this.showUserMenu = false;
    this.router.navigate(['/lock']);
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}