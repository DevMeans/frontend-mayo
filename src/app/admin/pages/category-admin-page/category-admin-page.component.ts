import { Component, inject, OnInit } from '@angular/core';
import { CategoryModalComponent } from '../../components/category-modal/category-modal.component';
import { CategoryService } from '../../../category/services/Category.service';
import { Category } from '../../../category/interfaces/category.interface';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-admin-page',
  templateUrl: './category-admin-page.component.html',
  styleUrls: ['./category-admin-page.component.css'],
  standalone: true,
  imports: [CategoryModalComponent]
})
export class CategoryAdminPageComponent implements OnInit {

  ListaCategorias: Category[] = [];
  constructor(private categoryService: CategoryService) {


  }

  ngOnInit() {
    console.log('CategoryAdminPageComponent initialized');


  }
  productResource = rxResource({
    params: () => ({}),
    stream: () => {
      console.log('Ejecutando rxResource stream');
      return this.categoryService.getCategories({ skip: 1, take: 10 });
    }
  })

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
