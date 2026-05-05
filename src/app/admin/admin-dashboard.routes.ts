import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';



export const adminDashboardRoute: Routes = [
  {

    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: 'category',
        loadComponent: () => import('./pages/category-admin-page/category-admin-page.component').then(m => m.CategoryAdminPageComponent)
      },
      {
        path: '**',
        redirectTo: 'category'
      }
    ]
  }
]


