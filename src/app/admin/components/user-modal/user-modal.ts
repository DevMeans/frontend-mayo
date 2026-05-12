import { Component, Input, Output, EventEmitter, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, Role } from '../../../shared/services/user.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.html',
  styleUrls: ['./user-modal.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserModalComponent implements OnInit {
  @Input() roles: Role[] = [];
  @Output() userSaved = new EventEmitter<any>();
  @ViewChild('userModal') userModal!: ElementRef;

  userForm!: FormGroup;
  submitted = false;
  isLoading = false;
  isEditing = signal<boolean>(false);
  editingUser = signal<User | null>(null);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required],
      isActive: ['true']
    });
  }

  setEditingUser(user: User | null) {
    this.editingUser.set(user);
    if (user) {
      this.isEditing.set(true);
      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: String(user.role.id),
        isActive: String(user.isActive)
      });
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.isEditing.set(false);
      this.userForm.reset({ isActive: true });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
      this.submitted = false;
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsUntouched();
      });
    }
  }

  openModal() {
    const dialog = document.getElementById('user-modal') as HTMLDialogElement;
    dialog?.showModal();
  }

  closeModal() {
    const dialog = document.getElementById('user-modal') as HTMLDialogElement;
    dialog?.close();
    this.setEditingUser(null);
  }

  saveUser() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.isLoading = true;
      const formValue = { ...this.userForm.value } as any;
      formValue.roleId = Number(formValue.roleId);
      formValue.isActive = formValue.isActive === 'true' || formValue.isActive === true;
      if (this.isEditing()) {
        delete formValue.password;
      }

      this.userSaved.emit({
        isEditing: this.isEditing(),
        data: formValue,
        userId: this.editingUser()?.id
      });
      setTimeout(() => {
        this.isLoading = false;
        this.closeModal();
      }, 500);
    }
  }
}
