// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@angular/compiler';
import { FormBuilder } from '@angular/forms';
import { NEVER, Observable, of } from 'rxjs';
import { PosComponent } from './pos.component';

type MockOrderService = {
  createOrder: ReturnType<typeof vi.fn>;
  listOrders: ReturnType<typeof vi.fn>;
  getVariantStock: ReturnType<typeof vi.fn>;
};

function buildComponent(options?: {
  createOrder$?: Observable<any>;
  listOrders$?: Observable<any>;
  getVariantStock$?: Observable<any>;
}) {
  const productService = {
    getProducts: vi.fn(() => of({ data: [] }))
  };
  const storeService = {
    getStores: vi.fn(() => of([]))
  };
  const orderService: MockOrderService = {
    createOrder: vi.fn(() => options?.createOrder$ ?? of({ data: { code: 'ORD-TEST-001' } })),
    listOrders: vi.fn(() => options?.listOrders$ ?? of({ data: [] })),
    getVariantStock: vi.fn(() => options?.getVariantStock$ ?? of({ data: [] }))
  };
  const authService = {
    getCurrentUser: vi.fn(() => ({ id: 1 }))
  };
  const cdr = {
    markForCheck: vi.fn()
  };

  const component = new PosComponent(
    new FormBuilder(),
    productService as any,
    storeService as any,
    orderService as any,
    authService as any,
    cdr as any
  );

  component.initializeForms();
  component.selectedStoreId = 1;
  component.showPaymentDrawer = true;
  component.orderForm.patchValue({
    sourceStoreId: 1,
    clientName: 'Cliente POS'
  });

  component.cart = [
    {
      productId: 10,
      productName: 'Producto test',
      variantId: 124,
      sku: 'SKU-124',
      colorName: 'Azul',
      sizeName: 'L',
      price: 20,
      quantity: 1,
      subtotal: 20,
      availableStock: 10,
      imageUrl: null
    }
  ];

  component.updateTotals();
  component.paymentForm.patchValue({ amountPaid: component.total });

  return { component, orderService };
}

describe('PosComponent payment flow diagnostics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('completes payment and exits loading when createOrder succeeds', () => {
    const { component, orderService } = buildComponent();

    component.submitPayment();

    expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    expect(component.loading).toBe(false);
    expect(component.showPaymentDrawer).toBe(false);
    expect(component.cart.length).toBe(0);
    expect(component.toast?.type).toBe('success');
    expect(component.toast?.message).toContain('Venta creada');
  });

  it('does not stay stuck in loading when request hangs and recovery fails', async () => {
    const { component } = buildComponent({
      createOrder$: NEVER,
      listOrders$: NEVER
    });

    component.submitPayment();

    expect(component.loading).toBe(true);

    await vi.advanceTimersByTimeAsync(20000);
    await Promise.resolve();

    expect(component.loading).toBe(false);
    expect(component.toast?.type).toBe('error');
    expect(component.toast?.message).toContain('demoro demasiado');
  });

  it('allows manual cancel while loading and clears the blocked state', () => {
    const { component } = buildComponent({
      createOrder$: NEVER
    });

    component.submitPayment();
    expect(component.loading).toBe(true);

    component.closePaymentDrawer();

    expect(component.loading).toBe(false);
    expect(component.showPaymentDrawer).toBe(false);
    expect(component.toast?.type).toBe('info');
    expect(component.toast?.message).toContain('cerrado manualmente');
  });
});
