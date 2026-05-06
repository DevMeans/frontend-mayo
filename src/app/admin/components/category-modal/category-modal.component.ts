import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';

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
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  saveCategory() {
    this.submitted = true;
    if (this.categoryForm.valid) {
      const categoryName = this.categoryForm.value.name;
      console.log('Guardando categoría:', categoryName);

      // Aquí irían las llamadas a la API
      this.alertService.show(`Categoría "${categoryName}" guardada exitosamente`, 'success', 1000);

      // Cerrar el modal
      const modal = document.getElementById('category-modal') as HTMLDialogElement;
      if (modal) {
        modal.close();
      }

      // Limpiar el formulario y resetear estado
      this.categoryForm.reset();
      this.categoryForm.markAsUntouched();
      this.submitted = false;
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsUntouched();
      });
    } else {
      this.alertService.show('Por favor completa el formulario correctamente', 'error', 1000);
    }
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
