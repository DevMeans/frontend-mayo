import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';
import { CategoryAdminPageComponent } from './pages/category-admin-page/category-admin-page.component';



export const adminDashboardRoute: Routes = [
  {

    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: 'category',
        component:CategoryAdminPageComponent
      },
      {
        path: '**',
        redirectTo: 'category'
      }
    ]
  }
]


