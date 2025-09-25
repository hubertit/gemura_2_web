import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { TestApiComponent } from './features/auth/test-api/test-api.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FeedComponent } from './features/feed/feed.component';
import { CustomersListComponent } from './features/customers/customers-list/customers-list.component';
import { AddCustomerComponent } from './features/customers/add-customer/add-customer.component';
import { SoldMilkComponent } from './features/customers/sold-milk/sold-milk.component';
import { EntitiesComponent } from './features/entities/entities.component';
import { UsersComponent } from './features/users/users.component';
import { RolesComponent } from './features/roles/roles.component';
import { LogsComponent } from './features/logs/logs.component';
import { AuditComponent } from './features/audit/audit.component';
import { LockComponent } from './features/auth/lock/lock.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'test-api',
    component: TestApiComponent
  },
  {
    path: 'lock',
    component: LockComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'feed',
        component: FeedComponent
      },
      {
        path: 'customers/list',
        component: CustomersListComponent
      },
      {
        path: 'customers/add',
        component: AddCustomerComponent
      },
      {
        path: 'customers/sold-milk',
        component: SoldMilkComponent
      },
      {
        path: 'entities',
        component: EntitiesComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'logs',
        component: LogsComponent
      },
      {
        path: 'audit',
        component: AuditComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];