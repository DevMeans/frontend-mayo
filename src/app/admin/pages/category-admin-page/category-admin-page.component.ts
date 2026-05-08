import { Component, inject, OnInit, OnDestroy, signal, computed, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GenericModalComponent } from '../../components/generic-modal/generic-modal.component';
import { CategoryService } from '../../../category/services/Category.service';
import { Category, CategoryResponse } from '../../../category/interfaces/category.interface';
import { rxResource } from '@angular/core/rxjs-interop';
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
  imports: [GenericModalComponent, AlertComponent, ConfirmModalComponent]
})
export class CategoryAdminPageComponent implements OnInit, OnDestroy {

  @ViewChild(GenericModalComponent) genericModal!: GenericModalComponent;

  private categoriesData = signal<Category[]>([]);
  private searchSubject = new Subject<string>();
  private searchParam = signal<string>('');
  activeChecked = signal<boolean>(true);
  inactiveChecked = signal<boolean>(true);
  private filterParams = computed(() => ({ search: this.searchParam(), isActive: this.isActiveParam }));

  ListaCategorias = computed(() => this.getFilteredCategories());

  private get isActiveParam(): boolean | undefined {
    const active = this.activeChecked();
    const inactive = this.inactiveChecked();
    if (active && !inactive) return true;
    if (!active && inactive) return false;
    return undefined;
  }

  private getFilteredCategories(): Category[] {
    const search = this.searchParam().toLowerCase();
    const isActive = this.isActiveParam;
    const categories = this.categoriesData();

    return categories.filter(category => {
      const matchesSearch = !search || category.name.toLowerCase().includes(search);
      const matchesActive = isActive === undefined || category.isActive === isActive;
      return matchesSearch && matchesActive;
    });
  }

  constructor(private categoryService: CategoryService, private alertService: AlertService, private cdr: ChangeDetectorRef, private confirmService: ConfirmService) {


  }

  ngOnInit() {
    console.log('CategoryAdminPageComponent initialized');
    this.loadInitialCategories();
    this.searchSubject.pipe(debounceTime(500)).subscribe(param => {
      console.log('Búsqueda actualizada:', param);
      this.searchParam.set(param);
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  private loadInitialCategories() {
    this.categoryService.getCategories({ skip: 1, take: 100 }).subscribe({
      next: (response) => {
        console.log('Categorías cargadas:', response.data);
        this.categoriesData.set(response.data);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.alertService.show('Error al cargar categorías', 'error', 2000);
      }
    });
  }

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
    this.genericModal.setEditingItem(null);
    const modal = document.getElementById('generic-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  openModalForEdit(category: Category) {
    console.log('Opening modal for editing category:', category);
    this.genericModal.setEditingItem(category);
    const modal = document.getElementById('generic-modal') as HTMLDialogElement;
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
        this.categoriesData.update(categories =>
          categories.map(c => c.id === category.id ? { ...c, isActive: false } : c)
        );
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
        this.categoriesData.update(categories =>
          categories.map(c => c.id === category.id ? { ...c, isActive: true } : c)
        );
        this.cdr.markForCheck();
        this.alertService.show(`Categoría "${category.name}" activada exitosamente`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al activar categoría:', error);
        this.alertService.show('Error al activar categoría', 'error', 2000);
      }
    });
  }

  onCategorySaved(category: Category) {
    const editingItem = this.genericModal.editingItem();
    if (editingItem?.id) {
      // Modo edición
      console.log('Actualizando categoría:', category.name);
      this.categoryService.updateCategory(editingItem.id, category.name).subscribe({
        next: (updatedCategory) => {
          console.log('Categoría actualizada:', updatedCategory);
          this.categoriesData.update(categories =>
            categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
          );
          this.alertService.show(`Categoría "${category.name}" actualizada exitosamente`, 'success', 2000);
          this.genericModal.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          this.alertService.show('Error al actualizar categoría', 'error', 2000);
        }
      });
    } else {
      // Modo creación
      console.log('Creando nueva categoría:', category.name);
      this.categoryService.createCategory(category.name).subscribe({
        next: (newCategory) => {
          console.log('Categoría creada:', newCategory);
          this.categoriesData.update(categories => [...categories, newCategory]);
          this.alertService.show(`Categoría "${category.name}" creada exitosamente`, 'success', 2000);
          this.genericModal.closeModal();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.alertService.show('Error al crear categoría', 'error', 2000);
        }
      });
    }
  }

  get errorMessage(): string {
    return '';
  }

}
