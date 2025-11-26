import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../models/navigation.models';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  private menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'grid',
      path: 'dashboard'
    },
    {
      title: 'Customers',
      icon: 'users',
      path: 'customers/list'
    },
    {
      title: 'Suppliers',
      icon: 'truck',
      path: 'suppliers/list'
    },
    {
      title: 'Inventory',
      icon: 'package',
      children: [
        {
          title: 'Stock List',
          path: 'inventory'
        },
        {
          title: 'Stock Movements',
          path: 'inventory/movements'
        }
      ]
    },
    {
      title: 'Sales',
      icon: 'shopping-cart',
      path: 'sales'
    },
    {
      title: 'Collections',
      icon: 'dollar-sign',
      path: 'collections'
    },
    {
      title: 'Payroll',
      icon: 'credit-card',
      children: [
        {
          title: 'Employees',
          path: 'payroll/employees'
        },
        {
          title: 'Process Payroll',
          path: 'payroll/processing'
        },
        {
          title: 'Advances & Debts',
          path: 'payroll/advances'
        }
      ]
    },
    {
      title: 'Administration',
      icon: 'settings',
      children: [
        {
          title: 'Users',
          path: 'users'
        },
        {
          title: 'Roles',
          path: 'roles'
        },
        {
          title: 'Audit Logs',
          path: 'audit'
        }
      ]
    }
  ];

  constructor(private authService: AuthService) {
    this.initializeMenu();
  }

  private initializeMenu(): void {
    const filteredMenu = this.getFilteredMenuItems();
    this.menuItemsSubject.next(filteredMenu);
  }

  private getFilteredMenuItems(): MenuItem[] {
    const userRole = this.authService.getUserRole();
    return this.menuItems
      .filter(item => !item.roles || item.roles.includes(userRole))
      .map(item => this.filterChildItems(item, userRole));
  }

  private filterChildItems(item: MenuItem, userRole: string): MenuItem {
    if (!item.children) {
      return item;
    }

    return {
      ...item,
      children: item.children
        .filter(child => !child.roles || child.roles.includes(userRole))
        .map(child => this.filterChildItems(child, userRole))
    };
  }

  getMenuItems(): MenuItem[] {
    return this.getFilteredMenuItems();
  }

  refreshMenu(): void {
    this.initializeMenu();
  }
}
