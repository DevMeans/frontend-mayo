import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  loading = true;
  orderId: number | null = null;

  statusForm!: FormGroup;
  assignForm!: FormGroup;

  showStatusModal = false;
  showAssignModal = false;
  showDeliverModal = false;

  users: any[] = [];

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

  availableTransitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'WAITING_STOCK', 'CANCELLED'],
    CONFIRMED: ['PREPARING', 'WAITING_TRANSFER', 'CANCELLED'],
    WAITING_STOCK: ['CONFIRMED', 'CANCELLED'],
    WAITING_TRANSFER: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: []
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.loadUsers();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = Number(params['id']);
        this.loadOrder();
      }
    });
  }

  initializeForms() {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      note: ['']
    });

    this.assignForm = this.fb.group({
      roleType: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        this.users = users || [];
      }
    );
  }

  loadOrder() {
    if (!this.orderId) return;

    this.loading = true;
    this.orderService.getOrderById(this.orderId).subscribe(
      (response: any) => {
        this.order = response.data || response;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading order:', error);
        this.loading = false;
      }
    );
  }

  openStatusModal() {
    const nextStates = this.availableTransitions[this.order.status] || [];
    this.statusForm.patchValue({
      status: nextStates.length > 0 ? nextStates[0] : ''
    });
    this.showStatusModal = true;
  }

  submitStatusChange() {
    if (!this.statusForm.valid || !this.orderId) {
      return;
    }

    const { status, note } = this.statusForm.value;
    this.orderService.updateOrderStatus(this.orderId, status, note).subscribe(
      (response: any) => {
        alert('Estado actualizado exitosamente');
        this.showStatusModal = false;
        this.loadOrder();
      },
      (error) => {
        alert(`Error: ${error.error?.error || 'Error al actualizar estado'}`);
      }
    );
  }

  openAssignModal() {
    this.assignForm.reset();
    this.showAssignModal = true;
  }

  submitAssign() {
    if (!this.assignForm.valid || !this.orderId) {
      return;
    }

    const { roleType, userId } = this.assignForm.value;
    this.orderService.assignResponsible(this.orderId, roleType, userId).subscribe(
      (response: any) => {
        alert('Responsable asignado exitosamente');
        this.showAssignModal = false;
        this.loadOrder();
      },
      (error) => {
        alert(`Error: ${error.error?.error || 'Error al asignar responsable'}`);
      }
    );
  }

  openDeliverModal() {
    if (this.order.status === 'READY') {
      this.showDeliverModal = true;
    } else {
      alert('El pedido debe estar en estado READY para entregarlo');
    }
  }

  submitDeliver() {
    if (!this.orderId) return;

    this.orderService.updateOrderStatus(this.orderId, 'DELIVERED', 'Pedido entregado').subscribe(
      (response: any) => {
        alert('Pedido entregado exitosamente');
        this.showDeliverModal = false;
        this.loadOrder();
      },
      (error) => {
        alert(`Error: ${error.error?.error || 'Error al entregar pedido'}`);
      }
    );
  }

  getNextStates(): string[] {
    return this.availableTransitions[this.order?.status] || [];
  }

  getStatusColor(status: string): string {
    return this.orderStatusColors[status] || '#95a5a6';
  }

  getStatusLabel(status: string): string {
    return this.orderStatusLabels[status] || status;
  }

  goBack() {
    this.router.navigate(['/admin/orders/list']);
  }
}
