import { Component, inject, OnInit, OnDestroy, signal, computed, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CategoryModalComponent } from '../../components/category-modal/category-modal.component';
import { CategoryService } from '../../../category/services/Category.service';
import { Category, CategoryResponse } from '../../../category/interfaces/category.interface';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-category-admin-page',
  templateUrl: './category-admin-page.component.html',
  styleUrls: ['./category-admin-page.component.css'],
  standalone: true,
  imports: [CategoryModalComponent, AlertComponent, ConfirmModalComponent]
})
export class CategoryAdminPageComponent implements OnInit, OnDestroy {

  @ViewChild(CategoryModalComponent) categoryModal!: CategoryModalComponent;

  ListaCategorias = computed(() => this.productResource.value()?.data || []);
  private searchSubject = new Subject<string>();
  private searchParam = signal<string>('');
  activeChecked = signal<boolean>(true);
  inactiveChecked = signal<boolean>(true);
  private filterParams = computed(() => ({ search: this.searchParam(), isActive: this.isActiveParam }));

  private get isActiveParam(): boolean | undefined {
    const active = this.activeChecked();
    const inactive = this.inactiveChecked();
    if (active && !inactive) return true;
    if (!active && inactive) return false;
    return undefined;
  }

  constructor(private categoryService: CategoryService, private alertService: AlertService, private cdr: ChangeDetectorRef, private confirmService: ConfirmService) {


  }

  ngOnInit() {
    console.log('CategoryAdminPageComponent initialized');
    this.searchSubject.pipe(debounceTime(1000)).subscribe(param => {
      console.log('Obteniendo categorías con filtro:', param);
      this.searchParam.set(param);
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }
  productResource = rxResource({
    params: () => this.filterParams(),
    stream: (params) => {
      const rawParams = (params as any)?.params || {};
      const search = rawParams.search?.trim();
      const isActive = rawParams.isActive;
      console.log('Ejecutando rxResource stream con params:', rawParams, 'search extraído:', search, 'isActive:', isActive);

      if (search) {
        console.log('Buscando por nombre:', search, 'isActive:', isActive);
        return this.categoryService.findByName(search, isActive).pipe(
          map(categories => {
            console.log('Categorías encontradas:', categories);
            return { data: categories, total: categories.length, page: 1, limit: categories.length } as CategoryResponse;
          })
        );
      }

      console.log('Listando categorías con isActive:', isActive);
      return this.categoryService.getCategories({ skip: 1, take: 100, isActive });
    }
  })

  setActiveChecked(value: boolean) {
    this.activeChecked.set(value);
  }

  setInactiveChecked(value: boolean) {
    this.inactiveChecked.set(value);
  }

  obtenerCategorias(param: string) {
    console.log('Param recibido en obtenerCategorias:', param);
    this.searchSubject.next(param);
  }
  openModal() {
    console.log('Opening modal');
    this.categoryModal.setEditingCategory(null);
    const modal = document.getElementById('category-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  openModalForEdit(category: Category) {
    console.log('Opening modal for editing category:', category);
    this.categoryModal.setEditingCategory(category);
    const modal = document.getElementById('category-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  async deactivateCategory(category: Category) {
    const confirmed = await this.confirmService.confirm({
      title: 'Desactivar Categoría',
      message: `¿Estás seguro de que deseas desactivar la categoría "${category.name}"?`,
      acceptText: 'Desactivar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    console.log('Desactivando categoría:', category);
    this.categoryService.deactivateCategory(category.id).subscribe({
      next: (deactivatedCategory) => {
        console.log('Categoría desactivada:', deactivatedCategory);
        // Actualizar el estado local sin recargar la lista
        category.isActive = false;
        this.cdr.markForCheck();
        this.alertService.show(`Categoría "${category.name}" desactivada exitosamente`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al desactivar categoría:', error);
        this.alertService.show('Error al desactivar categoría', 'error', 2000);
      }
    });
  }

  async activateCategory(category: Category) {
    const confirmed = await this.confirmService.confirm({
      title: 'Activar Categoría',
      message: `¿Estás seguro de que deseas activar la categoría "${category.name}"?`,
      acceptText: 'Activar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    console.log('Activando categoría:', category);
    this.categoryService.activateCategory(category.id).subscribe({
      next: (activatedCategory) => {
        console.log('Categoría activada:', activatedCategory);
        // Actualizar el estado local sin recargar la lista
        category.isActive = true;
        this.cdr.markForCheck();
        this.alertService.show(`Categoría "${category.name}" activada exitosamente`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al activar categoría:', error);
        this.alertService.show('Error al activar categoría', 'error', 2000);
      }
    });
  }

  onCategorySaved() {
    console.log('Categoría guardada, refrescando lista');
    this.searchSubject.next(this.searchParam());
  }

  get errorMessage(): string {
    const error = this.productResource.error();
    if (!error) return '';
    const httpError = error as HttpErrorResponse;

    if (httpError.status === 400) {
      return httpError.error?.message || httpError.message || 'Solicitud inválida';
    }
    if (httpError.status === 500) {
      return httpError.error?.message || 'Error interno del servidor';
    }
    return httpError.error?.message || httpError.message || 'Error desconocido';
  }

}
