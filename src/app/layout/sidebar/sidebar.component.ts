import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../features/navigation/services/navigation.service';
import { MenuItem } from '../../features/navigation/models/navigation.models';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { InactivityService } from '../../core/services/inactivity.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="logo-container">
          <img src="assets/img/logo.png" alt="Gemura Logo" class="logo">
          <span class="logo-text" *ngIf="!isCollapsed">Gemura</span>
        </div>
      </div>

      <div class="user-info" *ngIf="!isCollapsed">
        <div class="user-avatar">
          <img [src]="userAvatar" [alt]="userName">
        </div>
        <div class="user-details text-center">
          <h5 class="user-name">{{ userName }}</h5>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>

      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <ng-container *ngFor="let item of menuItems">
            <!-- Menu Item with Children -->
            <div class="nav-item" *ngIf="item.children" [class.active]="isMenuActive(item)">
              <a class="nav-link" (click)="toggleSubmenu(item)">
                <app-lucide-icon [name]="item.icon" size="18px" *ngIf="item.icon"></app-lucide-icon>
                <span class="nav-text" *ngIf="!isCollapsed">{{ item.title }}</span>
                <app-lucide-icon name="chevron-right" size="14px" *ngIf="!isCollapsed"
                   [class.rotated]="item.expanded"></app-lucide-icon>
              </a>
              <div class="submenu" *ngIf="item.expanded && !isCollapsed">
                <ng-container *ngFor="let child of item.children">
                  <!-- Nested submenu (has children) -->
                  <div *ngIf="child.children" class="nested-submenu">
                    <a class="submenu-item parent"
                       [class.expanded]="child.expanded"
                       (click)="toggleSubmenu(child)">
                      {{ child.title }}
                      <app-lucide-icon name="chevron-right" size="12px"
                         [class.rotated]="child.expanded"></app-lucide-icon>
                    </a>
                    <div class="nested-submenu-items" *ngIf="child.expanded">
                      <a *ngFor="let grandchild of child.children"
                         [routerLink]="grandchild.path"
                         routerLinkActive="active"
                         class="submenu-item nested">
                        {{ grandchild.title }}
                      </a>
                    </div>
                  </div>
                  
                  <!-- Simple submenu item -->
                  <a *ngIf="!child.children"
                     [routerLink]="child.path"
                     routerLinkActive="active"
                     class="submenu-item">
                    {{ child.title }}
                  </a>
                </ng-container>
              </div>
            </div>

            <!-- Single Menu Item -->
            <div class="nav-item" *ngIf="!item.children">
              <a class="nav-link" [routerLink]="[item.path]" routerLinkActive="active">
                <app-lucide-icon [name]="item.icon" size="18px" *ngIf="item.icon"></app-lucide-icon>
                <span class="nav-text" *ngIf="!isCollapsed">{{ item.title }}</span>
              </a>
            </div>
          </ng-container>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="footer-item" (click)="lockScreen()">
          <app-lucide-icon name="lock" size="18px"></app-lucide-icon>
          <span *ngIf="!isCollapsed">Lock Screen</span>
        </div>
        <div class="footer-item" (click)="onToggleCollapse()">
          <app-lucide-icon [name]="isCollapsed ? 'chevron-right' : 'chevron-left'" size="18px"></app-lucide-icon>
          <span *ngIf="!isCollapsed">Collapse Menu</span>
        </div>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  menuItems: MenuItem[] = [];
  userName: string = '';
  userRole: string = '';
  userAvatar: string = '/assets/img/user.png';
  private menuSubscription: Subscription = new Subscription();

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private inactivityService: InactivityService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userRole = user.role;
      if (user.avatar) {
        this.userAvatar = user.avatar;
      }
    }
  }

  ngOnInit(): void {
    this.menuSubscription = this.navigationService.menuItems$.subscribe(menuItems => {
      this.menuItems = menuItems;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  isMenuActive(item: MenuItem): boolean {
    if (!item.children) {
      return false;
    }
    const currentPath = window.location.pathname;
    return item.children.some(child => {
      if (child.path && currentPath.includes(child.path)) {
        return true;
      }
      if (child.children) {
        return child.children.some(grandchild => 
          grandchild.path && currentPath.includes(grandchild.path)
        );
      }
      return false;
    });
  }

  lockScreen(): void {
    this.router.navigate(['/lock']);
  }
}
