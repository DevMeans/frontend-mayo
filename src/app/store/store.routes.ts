import { Routes } from "@angular/router";
import { StoreLayoutComponent } from "./layouts/store-layout/store-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";

export const storeRoutes : Routes = [
  {

    path: '',
    component:StoreLayoutComponent,
    children:[
      {
        path: '',
        component:HomeComponent
      },
      {

        path: '**',
        component:NotFoundPageComponent
      }

    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
