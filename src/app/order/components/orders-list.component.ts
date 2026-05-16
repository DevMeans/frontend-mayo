import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderService } from '../services/order.service';
import { StoreService } from '../../store/services/store.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class OrdersListComponent implements OnInit {
  orders: any[] = [];
  stores: any[] = [];
  readonly statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'CONFIRMED', label: 'Confirmado' },
    { value: 'WAITING_TRANSFER', label: 'Esperando transferencia' },
    { value: 'PREPARING', label: 'Preparando' },
    { value: 'READY', label: 'Listo' },
    { value: 'DELIVERED', label: 'Entregado' },
    { value: 'CANCELLED', label: 'Cancelado' },
    { value: 'WAITING_STOCK', label: 'Sin stock' }
  ];

  filterForm!: FormGroup;
  loadError = '';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalOrders = 0;

  loading = false;
  selectedOrder: any = null;
  showDetail = false;

  orderStatusColors: Record<string, string> = {
    PENDING: '#f39c12',
    CONFIRMED: '#3498db',
    WAITING_TRANSFER: '#9b59b6',
    PREPARING: '#e67e22',
    READY: '#27ae60',
    DELIVERED: '#16a085',
    CANCELLED: '#e74c3c',
    WAITING_STOCK: '#c0392b'
  };

  orderStatusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    WAITING_TRANSFER: 'Esperando Transferencia',
    PREPARING: 'Preparando',
    READY: 'Listo',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
    WAITING_STOCK: 'Sin Stock'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadStores();
    this.loadOrders();
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      status: [''],
      storeId: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  loadStores() {
    this.storeService.getStores({ skip: 1, take: 100 }).subscribe({
      next: (storesResponse: any) => {
        const stores = Array.isArray(storesResponse)
          ? storesResponse
          : (Array.isArray(storesResponse?.data)
            ? storesResponse.data
            : (Array.isArray(storesResponse?.value)
              ? storesResponse.value
              : (Array.isArray(storesResponse?.result) ? storesResponse.result : [])));
        this.stores = stores;
      },
      error: () => {
        this.stores = [];
      }
    });
  }

  loadOrders() {
    this.loading = true;
    this.loadError = '';

    const filters: any = {
      page: this.currentPage,
      limit: this.pageSize,
      status: this.filterForm.get('status')?.value || undefined,
      storeId: this.filterForm.get('storeId')?.value ? Number(this.filterForm.get('storeId')?.value) : undefined,
      startDate: this.filterForm.get('startDate')?.value || undefined,
      endDate: this.filterForm.get('endDate')?.value || undefined
    };

    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });

    this.orderService
      .listOrders(filters)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: (response: any) => {
          this.orders = Array.isArray(response?.data)
            ? response.data
            : (Array.isArray(response) ? response : []);

          const pagination = response?.pagination || {};
          this.totalOrders = Number(pagination?.total || this.orders.length || 0);
          this.totalPages = Math.max(1, Number(pagination?.totalPages || 1));
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.orders = [];
          this.totalOrders = 0;
          this.totalPages = 1;
          this.loadError = error?.error?.error || error?.error?.message || 'No se pudieron cargar las ordenes.';
        }
      });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadOrders();
  }

  clearFilters() {
    this.filterForm.reset({
      status: '',
      storeId: '',
      startDate: '',
      endDate: ''
    });
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  viewOrderDetail(order: any) {
    this.router.navigate(['/admin/orders', order.id]);
  }

  closeDetail() {
    this.showDetail = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(order: any, newStatus: string) {
    if (!confirm(`Cambiar estado a ${this.orderStatusLabels[newStatus]}?`)) {
      return;
    }

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        alert(`Error: ${error?.error?.error || 'Error al actualizar'}`);
      }
    });
  }

  getStatusColor(status: string): string {
    return this.orderStatusColors[status] || '#95a5a6';
  }

  getStatusLabel(status: string): string {
    return this.orderStatusLabels[status] || status;
  }
}
