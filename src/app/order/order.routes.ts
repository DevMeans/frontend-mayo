import { Routes } from '@angular/router';
import { PosComponent } from './components/pos.component';
import { OrdersListComponent } from './components/orders-list.component';
import { OrderDetailComponent } from './components/order-detail.component';
import { PickingBoardComponent } from './components/picking-board.component';

export const orderRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        redirectTo: 'pos',
        pathMatch: 'full'
      },
      {
        path: 'pos',
        component: PosComponent,
        data: { title: 'Crear Orden (POS)' }
      },
      {
        path: 'manage',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: OrdersListComponent,
        data: { title: 'Gestion de Pedidos' }
      },
      {
        path: 'picking',
        component: PickingBoardComponent,
        data: { title: 'Tablero de Picking' }
      },
      {
        path: ':id',
        component: OrderDetailComponent,
        data: { title: 'Detalle del Pedido' }
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];