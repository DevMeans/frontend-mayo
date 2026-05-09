import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Category } from '../../../category/interfaces/category.interface';
import { Color } from '../../../color/interfaces/color.interface';
import { Size } from '../../../size/interfaces/size.interface';
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductVariant
} from '../../../product/interfaces/product.interface';
import { ProductService } from '../../../product/services/product.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() colors: Color[] = [];
  @Input() sizes: Size[] = [];
  @Output() productSaved = new EventEmitter<{
    mode: 'create' | 'edit';
    id?: number;
    payload: ProductCreateRequest | ProductUpdateRequest;
  }>();

  productForm!: FormGroup;
  submitted = false;
  editingProduct = signal<Product | null>(null);
  variants = signal<ProductVariant[]>([]);
  selectedColorIds = signal<number[]>([]);
  selectedSizeIds = signal<number[]>([]);
  formError = signal<string>('');

  private productService = inject(ProductService);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.productForm = new FormBuilder().group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      categoryId: [null, Validators.required],
      isActive: [true],
      imageUrls: ['']
    });
  }

  setEditingProduct(product: Product | null) {
    this.submitted = false;
    this.formError.set('');
    this.variants.set([]);
    this.selectedColorIds.set([]);
    this.selectedSizeIds.set([]);
    this.editingProduct.set(product);

    if (product) {
      this.productForm.patchValue({
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId,
        isActive: product.isActive,
        imageUrls: ''
      });
    } else {
      this.productForm.reset({
        name: '',
        description: '',
        categoryId: null,
        isActive: true,
        imageUrls: ''
      });
    }
  }

  get isEditing() {
    return this.editingProduct() !== null;
  }

  toggleColor(colorId: number, checked: boolean) {
    const current = this.selectedColorIds();
    if (checked) {
      this.selectedColorIds.set([...current, colorId]);
    } else {
      this.selectedColorIds.set(current.filter((id) => id !== colorId));
    }
  }

  toggleSize(sizeId: number, checked: boolean) {
    const current = this.selectedSizeIds();
    if (checked) {
      this.selectedSizeIds.set([...current, sizeId]);
    } else {
      this.selectedSizeIds.set(current.filter((id) => id !== sizeId));
    }
  }

  async generateVariants() {
    this.formError.set('');
    const colors = this.selectedColorIds();
    const sizes = this.selectedSizeIds();

    if (!colors.length || !sizes.length) {
      this.formError.set('Selecciona al menos un color y una talla para generar variantes.');
      return;
    }

    const response = await firstValueFrom(this.productService.generateVariants({ colorIds: colors, sizeIds: sizes }));
    const generated = response.variants.map((variant) => ({
      colorId: variant.colorId,
      sizeId: variant.sizeId,
      price: 0,
      imageUrl: ''
    }));
    this.variants.set(generated);
  }

  onVariantPriceChange(index: number, value: string) {
    const price = Number(value);
    this.variants.update((current) => {
      const next = [...current];
      next[index] = { ...next[index], price: Number.isNaN(price) ? 0 : price };
      return next;
    });
  }

  onVariantImageChange(index: number, value: string) {
    this.variants.update((current) => {
      const next = [...current];
      next[index] = { ...next[index], imageUrl: value.trim() || undefined };
      return next;
    });
  }

  saveProduct() {
    this.submitted = true;
    this.formError.set('');

    if (this.productForm.invalid) {
      return;
    }

    const name = this.productForm.value.name.trim();
    const description = this.productForm.value.description?.trim();
    const categoryId = Number(this.productForm.value.categoryId);
    const isActive = this.productForm.value.isActive;
    const rawImages = this.productForm.value.imageUrls || '';
    const imageUrls = rawImages
      .split(/\r?\n|,/)
      .map((image: string) => image.trim())
      .filter((image: string) => image.length > 0);

    if (this.isEditing) {
      this.productSaved.emit({
        mode: 'edit',
        id: this.editingProduct()?.id,
        payload: {
          name,
          description,
          categoryId,
          isActive
        }
      });
      return;
    }

    const currentVariants = this.variants();
    if (!currentVariants.length) {
      this.formError.set('Genera las variantes antes de crear el producto.');
      return;
    }

    const invalidVariant = currentVariants.some((variant) => variant.price <= 0);
    if (invalidVariant) {
      this.formError.set('Cada variante debe tener un precio mayor que 0.');
      return;
    }

    const payload: ProductCreateRequest = {
      name,
      description,
      categoryId,
      colorIds: this.selectedColorIds(),
      sizeIds: this.selectedSizeIds(),
      imageUrls: imageUrls.length ? imageUrls : undefined,
      variants: currentVariants.map((variant) => ({
        colorId: variant.colorId,
        sizeId: variant.sizeId,
        price: variant.price,
        imageUrl: variant.imageUrl || undefined
      }))
    };

    this.productSaved.emit({
      mode: 'create',
      payload
    });
  }

  closeModal() {
    const modal = document.getElementById('product-modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    this.setEditingProduct(null);
  }

  get colorLabels() {
    return this.colors;
  }

  get sizeLabels() {
    return this.sizes;
  }

  getColorName(colorId: number): string {
    return this.colors.find((color) => color.id === colorId)?.name ?? 'N/A';
  }

  getSizeName(sizeId: number): string {
    return this.sizes.find((size) => size.id === sizeId)?.name ?? 'N/A';
  }
}
