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
      title: 'Collections',
      icon: 'package',
      path: 'collections'
    },
    {
      title: 'Milk Sales',
      icon: 'shopping-cart',
      path: 'milk-sales'
    },
      {
        title: 'Ikofi',
        icon: 'dollar-sign',
        path: 'ikofi'
      },
    {
      title: 'Chats',
      icon: 'message-circle',
      path: 'chats'
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