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
        path: 'color',
        loadComponent: () => import('./pages/color-admin-page/color-admin-page.component').then(m => m.ColorAdminPageComponent)
      },
      {
        path: '**',
        redirectTo: 'category'
      }
    ]
  }
]


