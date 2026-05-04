import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-dashboard.routes').then(m => m.adminDashboardRoute)
  },
  {
    path: '',
    loadChildren: () => import('./store/store.routes').then(m => m.storeRoutes)
  }



];
