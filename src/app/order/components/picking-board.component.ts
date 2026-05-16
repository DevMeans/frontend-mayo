import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-picking-board',
  templateUrl: './picking-board.component.html',
  styleUrls: ['./picking-board.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PickingBoardComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  filterForm!: FormGroup;

  loading = false;

  orderStatusColors: Record<string, string> = {
    CONFIRMED: '#3498db',
    PREPARING: '#e67e22',
    READY: '#27ae60',
    CANCELLED: '#e74c3c'
  };

  orderStatusLabels: Record<string, string> = {
    CONFIRMED: 'Confirmado',
    PREPARING: 'Preparando',
    READY: 'Listo',
    CANCELLED: 'Cancelado'
  };

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadOrders();
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      status: ['CONFIRMED']
    });
  }

  loadOrders() {
    this.loading = true;

    const filters = {
      page: 1,
      limit: 50,
      status: this.filterForm.get('status')?.value || 'CONFIRMED'
    };

    this.orderService.listOrders(filters).subscribe(
      (response: any) => {
        this.orders = response.data || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    );
  }

  selectOrder(order: any) {
    this.selectedOrder = order;
  }

  markItemPicked(item: any) {
    if (!this.selectedOrder) return;

    // Incrementar cantidad picked
    item.pickedQuantity = (item.pickedQuantity || 0) + 1;

    // Si se llegó a la cantidad total, marcar como completo
    if (item.pickedQuantity >= item.quantity) {
      item.pickedQuantity = item.quantity;
    }

    // Guardar cambios
    this.savePickingProgress();
  }

  markItemUnpicked(item: any) {
    if (!this.selectedOrder) return;

    item.pickedQuantity = Math.max(0, (item.pickedQuantity || 0) - 1);
    this.savePickingProgress();
  }

  completeOrder() {
    if (!this.selectedOrder) return;

    const allPicked = this.selectedOrder.items.every(
      (item: any) => item.pickedQuantity === item.quantity
    );

    if (!allPicked) {
      alert('No todos los productos han sido separados');
      return;
    }

    // Cambiar estado a READY
    this.orderService.updateOrderStatus(this.selectedOrder.id, 'READY', 'Picking completado').subscribe(
      (response: any) => {
        alert('Picking completado. Pedido marcado como READY');
        this.selectedOrder = null;
        this.loadOrders();
      },
      (error: any) => {
        alert(`Error: ${error.error?.error || 'Error al completar picking'}`);
      }
    );
  }

  savePickingProgress() {
    if (!this.selectedOrder) return;

    const pickingData = {
      items: this.selectedOrder.items.map((item: any) => ({
        variantId: item.variantId,
        pickedQuantity: item.pickedQuantity || 0
      }))
    };

    this.orderService.updateOrderPicking(this.selectedOrder.id, pickingData).subscribe(
      (response: any) => {
        console.log('Picking progress saved');
      },
      (error: any) => {
        console.error('Error saving picking progress:', error);
      }
    );
  }

  getPickingProgress(order: any): number {
    if (!order.items || order.items.length === 0) return 0;
    const totalItems = order.items.length;
    const pickedItems = order.items.filter((item: any) => item.pickedQuantity === item.quantity).length;
    return Math.round((pickedItems / totalItems) * 100);
  }

  getItemProgress(item: any): number {
    const picked = item.pickedQuantity || 0;
    const total = item.quantity || 1;
    return Math.round((picked / total) * 100);
  }

  onFilterChange() {
    this.loadOrders();
  }

  getStatusColor(status: string): string {
    return this.orderStatusColors[status] || '#95a5a6';
  }

  getStatusLabel(status: string): string {
    return this.orderStatusLabels[status] || status;
  }

  clearSelection() {
    this.selectedOrder = null;
  }
}
