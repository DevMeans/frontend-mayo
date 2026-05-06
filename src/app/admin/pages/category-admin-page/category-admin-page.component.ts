import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CategoryModalComponent } from '../../components/category-modal/category-modal.component';
import { CategoryService } from '../../../category/services/Category.service';
import { Category, CategoryResponse } from '../../../category/interfaces/category.interface';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-category-admin-page',
  templateUrl: './category-admin-page.component.html',
  styleUrls: ['./category-admin-page.component.css'],
  standalone: true,
  imports: [CategoryModalComponent]
})
export class CategoryAdminPageComponent implements OnInit, OnDestroy {

  ListaCategorias = computed(() => this.productResource.value()?.data || []);
  private searchSubject = new Subject<string>();
  private searchParam = signal<string>('');
  activeChecked = signal<boolean>(true);
  inactiveChecked = signal<boolean>(false);
  private filterParams = computed(() => ({ search: this.searchParam(), isActive: this.isActiveParam }));

  private get isActiveParam(): boolean | undefined {
    const active = this.activeChecked();
    const inactive = this.inactiveChecked();
    if (active && !inactive) return true;
    if (!active && inactive) return false;
    return undefined;
  }

  constructor(private categoryService: CategoryService) {


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
    const modal = document.getElementById('category-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
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
