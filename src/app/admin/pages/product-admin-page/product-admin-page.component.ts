import { Component, inject, OnInit, OnDestroy, signal, computed, ViewChild, ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';
import { ProductService } from '../../../product/services/product.service';
import { Product } from '../../../product/interfaces/product.interface';
import { CategoryService } from '../../../category/services/Category.service';
import { ColorService } from '../../../color/services/color.service';
import { SizeService } from '../../../size/services/size.service';
import { Category } from '../../../category/interfaces/category.interface';
import { Color } from '../../../color/interfaces/color.interface';
import { Size } from '../../../size/interfaces/size.interface';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-product-admin-page',
  templateUrl: './product-admin-page.component.html',
  styleUrls: ['./product-admin-page.component.css'],
  standalone: true,
  imports: [ProductModalComponent, AlertComponent, ConfirmModalComponent]
})
export class ProductAdminPageComponent implements OnInit, OnDestroy {
  @ViewChild(ProductModalComponent) productModal!: ProductModalComponent;

  private productsData = signal<Product[]>([]);
  private searchSubject = new Subject<string>();
  private searchParam = signal<string>('');
  activeChecked = signal<boolean>(true);
  inactiveChecked = signal<boolean>(true);

  categories = signal<Category[]>([]);
  colors = signal<Color[]>([]);
  sizes = signal<Size[]>([]);

  private getFilteredProducts() {
    const search = this.searchParam().toLowerCase();
    const isActive = this.isActiveParam;
    const products = this.productsData();

    return products.filter((product) => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search);
      const matchesActive = isActive === undefined || product.isActive === isActive;
      return matchesSearch && matchesActive;
    });
  }

  ListaProductos = computed(() => this.getFilteredProducts());

  private get isActiveParam(): boolean | undefined {
    const active = this.activeChecked();
    const inactive = this.inactiveChecked();
    if (active && !inactive) return true;
    if (!active && inactive) return false;
    return undefined;
  }

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private alertService: AlertService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInitialProducts();
    this.loadMetadata();
    this.searchSubject.pipe(debounceTime(500)).subscribe((param) => {
      this.searchParam.set(param);
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  private loadInitialProducts() {
    this.productService.getProducts({ skip: 1, take: 100 }).subscribe({
      next: (response) => {
        this.productsData.set(response.data);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.alertService.show('Error al cargar los productos', 'error', 2000);
      }
    });
  }

  private loadMetadata() {
    this.categoryService.getCategories({ skip: 1, take: 100, isActive: true }).subscribe({
      next: (response) => this.categories.set(response.data),
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });

    this.colorService.getColors({ skip: 1, take: 100, isActive: true }).subscribe({
      next: (response) => this.colors.set(response.data),
      error: (error) => {
        console.error('Error al cargar colores:', error);
      }
    });

    this.sizeService.getSizes({ skip: 1, take: 100, isActive: true }).subscribe({
      next: (response) => this.sizes.set(response.data),
      error: (error) => {
        console.error('Error al cargar tallas:', error);
      }
    });
  }

  setActiveChecked(value: boolean) {
    this.activeChecked.set(value);
  }

  setInactiveChecked(value: boolean) {
    this.inactiveChecked.set(value);
  }

  obtenerProductos(param: string) {
    this.searchSubject.next(param);
  }

  getCategoryName(categoryId: number, categoryName?: string) {
    if (categoryName) {
      return categoryName;
    }

    const category = this.categories().find((item) => item.id === categoryId);
    return category ? category.name : String(categoryId);
  }

  openModal() {
    this.productModal.setEditingProduct(null);
    const modal = document.getElementById('product-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  async openModalForEdit(product: Product) {
    try {
      const detailedProduct = await firstValueFrom(this.productService.getProductById(product.id));
      this.productModal.setEditingProduct(detailedProduct);
      const modal = document.getElementById('product-modal') as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    } catch (error) {
      console.error('Error al cargar el producto para edición:', error);
      this.alertService.show('No se pudo cargar el producto para edición', 'error', 2000);
    }
  }

  async deactivateProduct(product: Product) {
    const confirmed = await this.confirmService.confirm({
      title: 'Desactivar Producto',
      message: `¿Deseas desactivar el producto "${product.name}"?`,
      acceptText: 'Desactivar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    this.productService.setProductActive(product.id, false).subscribe({
      next: (response) => {
        this.productsData.update((products) =>
          products.map((item) => (item.id === product.id ? { ...item, isActive: false } : item))
        );
        this.cdr.markForCheck();
        this.alertService.show(`Producto "${product.name}" desactivado`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al desactivar producto:', error);
        this.alertService.show('Error al desactivar el producto', 'error', 2000);
      }
    });
  }

  async activateProduct(product: Product) {
    const confirmed = await this.confirmService.confirm({
      title: 'Activar Producto',
      message: `¿Deseas activar el producto "${product.name}"?`,
      acceptText: 'Activar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    this.productService.setProductActive(product.id, true).subscribe({
      next: (response) => {
        this.productsData.update((products) =>
          products.map((item) => (item.id === product.id ? { ...item, isActive: true } : item))
        );
        this.cdr.markForCheck();
        this.alertService.show(`Producto "${product.name}" activado`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al activar producto:', error);
        this.alertService.show('Error al activar el producto', 'error', 2000);
      }
    });
  }

  onProductSaved(event: { mode: 'create' | 'edit'; id?: number; payload: any }) {
    if (event.mode === 'edit') {
      if (!event.id) {
        return;
      }
      this.productService.updateProduct(event.id, event.payload).subscribe({
        next: (response) => {
          const updated = response.product;
          this.productsData.update((products) =>
            products.map((product) => (product.id === updated.id ? updated : product))
          );
          this.alertService.show(`Producto "${updated.name}" actualizado`, 'success', 2000);
          this.productModal.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
          this.alertService.show('Error al actualizar el producto', 'error', 2000);
        }
      });
      return;
    }

    this.productService.createProduct(event.payload).subscribe({
      next: (response) => {
        this.productsData.update((products) => [...products, response.product]);
        this.alertService.show(`Producto "${response.product.name}" creado`, 'success', 2000);
        this.productModal.closeModal();
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.alertService.show('Error al crear el producto', 'error', 2000);
      }
    });
  }
}
