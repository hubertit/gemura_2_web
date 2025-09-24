import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface MenuItem {
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home',
      path: 'dashboard'
    },
    {
      title: 'Feed',
      icon: 'rss',
      path: 'feed'
    },
    {
      title: 'Market',
      icon: 'shopping-cart',
      children: [
        {
          title: 'Products',
          path: 'market/products'
        },
        {
          title: 'Categories',
          path: 'market/categories'
        },
        {
          title: 'Search',
          path: 'market/search'
        }
      ]
    },
    {
      title: 'Customers',
      icon: 'users',
      children: [
        {
          title: 'All Customers',
          path: 'customers/list'
        },
        {
          title: 'Add Customer',
          path: 'customers/add'
        },
        {
          title: 'Sold Milk',
          path: 'customers/sold-milk'
        }
      ]
    },
    {
      title: 'Suppliers',
      icon: 'truck',
      children: [
        {
          title: 'All Suppliers',
          path: 'suppliers/list'
        },
        {
          title: 'Collected Milk',
          path: 'suppliers/collected-milk'
        }
      ]
    },
    {
      title: 'Collections',
      icon: 'package',
      children: [
        {
          title: 'Pending Collections',
          path: 'collections/pending'
        },
        {
          title: 'Record Collection',
          path: 'collections/record'
        }
      ]
    },
    {
      title: 'Financial Services',
      icon: 'dollar-sign',
      children: [
        {
          title: 'Savings',
          path: 'financial/savings'
        },
        {
          title: 'Loans',
          path: 'financial/loans'
        },
        {
          title: 'Insurance',
          path: 'financial/insurance'
        },
        {
          title: 'Payments',
          path: 'financial/payments'
        }
      ]
    },
    {
      title: 'Chat & Communication',
      icon: 'message-circle',
      children: [
        {
          title: 'Chat List',
          path: 'chat/list'
        },
        {
          title: 'Bot Chat',
          path: 'chat/bot'
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      icon: 'bar-chart-2',
      children: [
        {
          title: 'Agent Reports',
          path: 'reports/agent'
        },
        {
          title: 'Sales Reports',
          path: 'reports/sales'
        },
        {
          title: 'Financial Reports',
          path: 'reports/financial'
        }
      ]
    },
    {
      title: 'Account Management',
      icon: 'user-cog',
      children: [
        {
          title: 'Profile',
          path: 'account/profile'
        },
        {
          title: 'Account Access',
          path: 'account/access'
        },
        {
          title: 'Invite People',
          path: 'account/invite'
        }
      ]
    },
    {
      title: 'Settings',
      icon: 'settings',
      children: [
        {
          title: 'General Settings',
          path: 'settings/general'
        },
        {
          title: 'Notifications',
          path: 'settings/notifications'
        },
        {
          title: 'Help & Support',
          path: 'settings/help'
        },
        {
          title: 'About',
          path: 'settings/about'
        }
      ]
    }
  ];

  constructor(private authService: AuthService) {}

  getMenuItems(): MenuItem[] {
    // For now, show all menu items to all user roles
    return this.menuItems.map(item => {
      // If item has children, show all children too
      if (item.children) {
        return {
          ...item,
          children: item.children
        };
      }
      return item;
    });
  }
}