import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { CategoryService } from '../../../category/services/Category.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class CategoryModalComponent implements OnInit {
  categoryForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    console.log('CategoryModalComponent initialized');
    this.initializeForm();
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  saveCategory() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.alertService.show('Por favor completa el formulario correctamente', 'error', 2000);
      return;
    }

    const categoryName = this.categoryForm.value.name?.trim();
    if (!categoryName) {
      this.alertService.show('El nombre de la categoría no puede quedar vacío', 'error', 2000);
      return;
    }

    console.log('Guardando categoría:', categoryName);
    this.categoryService.createCategory(categoryName).subscribe({
      next: (createdCategory) => {
        console.log('Categoría creada:', createdCategory);
        this.alertService.show(`Categoría "${categoryName}" guardada exitosamente`, 'success', 2000);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        this.alertService.show('Error al crear categoría', 'error', 2000);
      }
    });
  }

  closeModal() {
    const modal = document.getElementById('category-modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    // Reset del formulario y resetear submitted
    this.categoryForm.reset();
    this.categoryForm.markAsUntouched();
    this.submitted = false;
    Object.keys(this.categoryForm.controls).forEach(key => {
      this.categoryForm.get(key)?.markAsUntouched();
    });
  }
}
