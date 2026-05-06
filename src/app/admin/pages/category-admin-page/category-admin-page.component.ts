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
    stream: () => this.categoryService.getCategories({ skip: 1, take: 10 })
  })

  openModal() {
    console.log('Opening modal');
    const modal = document.getElementById('category-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }
  get errorMessage(): string {

    const error = this.productResource.error() as HttpErrorResponse;

    if (!error) return '';

    switch (error.status) {

      case 400:
        return error.error?.message || 'Solicitud inválida';

      case 500:
        return 'Error interno del servidor';

      default:
        return 'Error inesperado';
    }
  }

}
