import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class GenericModalComponent implements OnInit {
  @Input() createTitle: string = 'Crear';
  @Input() createDescription: string = 'Agrega un nuevo elemento';
  @Input() editTitle: string = 'Editar';
  @Input() editDescription: string = 'Modifica los datos del elemento';
  @Input() fieldLabel: string = 'Nombre';
  @Input() fieldPlaceholder: string = 'Ingresa el nombre...';
  @Output() itemSaved = new EventEmitter<any>();

  itemForm!: FormGroup;
  submitted = false;
  isEditing = signal<boolean>(false);
  editingItem = signal<any>(null);

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  setEditingItem(item: any | null) {
    this.editingItem.set(item);
    if (item) {
      this.isEditing.set(true);
      this.itemForm.patchValue({ name: item.name });
    } else {
      this.isEditing.set(false);
      this.itemForm.reset();
      this.submitted = false;
      Object.keys(this.itemForm.controls).forEach(key => {
        this.itemForm.get(key)?.markAsUntouched();
      });
    }
  }

  saveItem() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const itemName = this.itemForm.value.name?.trim();
    if (!itemName) {
      return;
    }

    const item = {
      ...this.editingItem(),
      name: itemName
    };

    this.itemSaved.emit(item);
  }

  closeModal() {
    const modal = document.getElementById('generic-modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    this.setEditingItem(null);
  }
}
