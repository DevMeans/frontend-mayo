import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Inventory } from '../../../inventory/interfaces/inventory.interface';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AlertService } from '../../../shared/services/alert.service';
import { StoreService } from '../../../store/services/store.service';
import { ProductService } from '../../../product/services/product.service';
import { Store } from '../../../store/interfaces/store.interface';
import { Product, ProductVariant } from '../../../product/interfaces/product.interface';

@Component({
  selector: 'app-inventory-admin-page',
  templateUrl: './inventory-admin-page.component.html',
  styleUrls: ['./inventory-admin-page.component.css'],
  standalone: true
})
export class InventoryAdminPageComponent implements OnInit, OnDestroy {
  private inventoryService = inject(InventoryService);
  private alertService = inject(AlertService);
  private storeService = inject(StoreService);
  private productService = inject(ProductService);

  inventoryData = signal<Inventory[]>([]);
  storeOptions = signal<Store[]>([]);
  variantOptions = signal<Array<{ variantId: number; label: string }>>([]);
  selectedStoreId = signal<number | null>(null);
  selectedProductId = signal<number | null>(null);
  selectedSizeId = signal<number | null>(null);
  selectedColorId = signal<number | null>(null);
  selectedVariantId = signal<number | null>(null);
  createQuantity = signal<number>(0);
  creatingInventory = signal<boolean>(false);
  searchSubject = new Subject<string>();
  searchParam = signal<string>('');
  skuFilter = signal<string>('');
  includeZero = signal<boolean>(true);
  reservedOnly = signal<boolean>(false);
  lowStockThreshold = signal<number>(0);

  productOptions = computed(() => {
    const products = new Map<number, string>();
    this.inventoryData().forEach((item) => {
      products.set(item.variant.product.id, item.variant.product.name);
    });
    return Array.from(products.entries()).map(([id, name]) => ({ id, name }));
  });

  sizeOptions = computed(() => {
    const sizes = new Map<number, string>();
    this.inventoryData().forEach((item) => {
      sizes.set(item.variant.size.id, item.variant.size.name);
    });
    return Array.from(sizes.entries()).map(([id, name]) => ({ id, name }));
  });

  colorOptions = computed(() => {
    const colors = new Map<number, string>();
    this.inventoryData().forEach((item) => {
      colors.set(item.variant.color.id, item.variant.color.name);
    });
    return Array.from(colors.entries()).map(([id, name]) => ({ id, name }));
  });

  ListaInventarios = computed(() => this.getFilteredInventories());

  get filteredCount() {
    return this.ListaInventarios().length;
  }

  get totalCount() {
    return this.inventoryData().length;
  }

  get canCreateInventory() {
    return !!this.selectedStoreId() && !!this.selectedVariantId() && this.createQuantity() > 0 && !this.creatingInventory();
  }

  private getFilteredInventories(): Inventory[] {
    const search = this.searchParam().toLowerCase();
    const skuSearch = this.skuFilter().trim().toLowerCase();
    const selectedStoreId = this.selectedStoreId();
    const selectedProductId = this.selectedProductId();
    const selectedSizeId = this.selectedSizeId();
    const selectedColorId = this.selectedColorId();
    const reservedOnly = this.reservedOnly();
    const lowStockThreshold = this.lowStockThreshold();

    return this.inventoryData().filter((item) => {
      const skuValue = item.variant.sku.toLowerCase();
      const productName = item.variant.product.name.toLowerCase();
      const storeName = item.store.name.toLowerCase();
      const sizeName = item.variant.size.name.toLowerCase();
      const colorName = item.variant.color.name.toLowerCase();
      const availableStock = this.computeAvailableStock(item);

      const matchesSearch =
        !search ||
        skuValue.includes(search) ||
        productName.includes(search) ||
        storeName.includes(search) ||
        sizeName.includes(search) ||
        colorName.includes(search);

      const matchesSku = !skuSearch || skuValue.includes(skuSearch);
      const matchesStore = !selectedStoreId || item.store.id === selectedStoreId;
      const matchesProduct = !selectedProductId || item.variant.product.id === selectedProductId;
      const matchesSize = !selectedSizeId || item.variant.size.id === selectedSizeId;
      const matchesColor = !selectedColorId || item.variant.color.id === selectedColorId;
      const matchesReservedOnly = !reservedOnly || item.reservedStock > 0;
      const matchesZero = this.includeZero() || item.stock > 0;
      const matchesLowStock = lowStockThreshold <= 0 || availableStock <= lowStockThreshold;

      return (
        matchesSearch &&
        matchesSku &&
        matchesStore &&
        matchesProduct &&
        matchesSize &&
        matchesColor &&
        matchesReservedOnly &&
        matchesZero &&
        matchesLowStock
      );
    });
  }

  ngOnInit() {
    this.loadInventories();
    this.loadStoreOptions();
    this.loadVariantOptions();
    this.searchSubject.pipe(debounceTime(400)).subscribe((param) => {
      this.searchParam.set(param);
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  private loadInventories() {
    this.inventoryService
      .getInventories({ skip: 1, take: 100, includeZero: this.includeZero() })
      .subscribe({
        next: (inventories: Inventory[]) => {
          this.inventoryData.set(inventories);
        },
        error: (error: unknown) => {
          console.error('Error al cargar inventario:', error);
          this.alertService.show('Error al cargar el inventario', 'error', 3000);
        }
      });
  }

  private loadStoreOptions() {
    this.storeService.getStores({ skip: 1, take: 100 }).subscribe({
      next: (stores: Store[]) => this.storeOptions.set(stores),
      error: (error: unknown) => {
        console.error('Error al cargar tiendas:', error);
        this.alertService.show('Error al cargar las tiendas', 'error', 3000);
      }
    });
  }

  private loadVariantOptions() {
    this.productService.getProducts({ skip: 1, take: 100, isActive: true }).subscribe({
      next: (response) => {
        const variants = response.data.flatMap((product: Product) => {
          const productName = product.name;
          return (product.variants ?? []).map((variant: any) => {
            const label = `${productName} - ${variant.sku ?? 'Sin SKU'} - ${variant.price ?? ''}`;
            return {
              variantId: variant.id,
              label,
            };
          });
        });
        this.variantOptions.set(variants);
      },
      error: (error: unknown) => {
        console.error('Error al cargar variantes:', error);
        this.alertService.show('Error al cargar variantes de productos', 'error', 3000);
      }
    });
  }

  createInventory() {
    if (!this.selectedStoreId() || !this.selectedVariantId() || this.createQuantity() <= 0) {
      this.alertService.show('Selecciona tienda, variante y cantidad válida', 'warning', 3000);
      return;
    }

    this.creatingInventory.set(true);

    this.inventoryService.createInventoryEntry({
      storeId: this.selectedStoreId()!,
      variantId: this.selectedVariantId()!,
      quantity: this.createQuantity()
    }).subscribe({
      next: () => {
        this.alertService.show('Inventario creado/actualizado correctamente', 'success', 3000);
        this.createQuantity.set(0);
        this.selectedStoreId.set(null);
        this.selectedVariantId.set(null);
        this.loadInventories();
      },
      error: (error: unknown) => {
        console.error('Error al crear inventario:', error);
        this.alertService.show('Error al crear inventario', 'error', 3000);
        this.creatingInventory.set(false);
      },
      complete: () => {
        this.creatingInventory.set(false);
      }
    });
  }

  setStoreId(value: string) {
    const id = Number(value);
    this.selectedStoreId.set(Number.isFinite(id) ? id : null);
  }

  setVariantId(value: string) {
    const id = Number(value);
    this.selectedVariantId.set(Number.isFinite(id) ? id : null);
  }

  setCreateQuantity(value: string) {
    const quantity = Number(value);
    this.createQuantity.set(Number.isFinite(quantity) ? quantity : 0);
  }

  refresh() {
    this.loadInventories();
  }

  onSearch(param: string) {
    this.searchSubject.next(param);
  }

  toggleIncludeZero(value: boolean) {
    this.includeZero.set(value);
    this.loadInventories();
  }

  setProductId(value: string) {
    const id = Number(value);
    this.selectedProductId.set(Number.isFinite(id) ? id : null);
  }

  setSizeId(value: string) {
    const id = Number(value);
    this.selectedSizeId.set(Number.isFinite(id) ? id : null);
  }

  setSkuFilter(value: string) {
    this.skuFilter.set(value);
  }

  toggleReservedOnly(value: boolean) {
    this.reservedOnly.set(value);
  }

  setLowStockThreshold(value: string) {
    const threshold = Number(value);
    this.lowStockThreshold.set(Number.isFinite(threshold) ? threshold : 0);
  }

  setColorId(value: string) {
    const id = Number(value);
    this.selectedColorId.set(Number.isFinite(id) ? id : null);
  }

  resetFilters() {
    this.searchParam.set('');
    this.skuFilter.set('');
    this.selectedStoreId.set(null);
    this.selectedProductId.set(null);
    this.selectedSizeId.set(null);
    this.selectedColorId.set(null);
    this.reservedOnly.set(false);
    this.lowStockThreshold.set(0);
    this.includeZero.set(true);
    this.searchSubject.next('');
  }

  computeAvailableStock(item: Inventory) {
    return item.stock - item.reservedStock;
  }
}
