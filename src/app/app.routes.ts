import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.Login)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-dashboard.routes').then(m => m.adminDashboardRoute)
  },
  {
    path: '',
    loadChildren: () => import('./store/store.routes').then(m => m.storeRoutes)
  }
];
