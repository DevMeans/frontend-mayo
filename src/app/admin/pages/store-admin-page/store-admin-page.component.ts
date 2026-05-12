import { Component, inject, OnInit, OnDestroy, signal, computed, ChangeDetectorRef } from '@angular/core';
import { StoreService } from '../../../store/services/store.service';
import { Store } from '../../../store/interfaces/store.interface';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-store-admin-page',
  templateUrl: './store-admin-page.component.html',
  styleUrls: ['./store-admin-page.component.css'],
  standalone: true,
  imports: [AlertComponent]
})
export class StoreAdminPageComponent implements OnInit, OnDestroy {
  private storeService = inject(StoreService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  storesData = signal<Store[]>([]);
  private searchSubject = new Subject<string>();
  searchParam = signal<string>('');
  filterType = signal<string>('');
  includeInactive = signal<boolean>(false);

  editingStore = signal<Store | null>(null);
  name = signal<string>('');
  code = signal<string>('');
  type = signal<'STORE' | 'WAREHOUSE'>('STORE');
  address = signal<string>('');
  saving = signal<boolean>(false);

  get formTitle() {
    return this.editingStore() ? 'Editar tienda o almacén' : 'Crear tienda o almacén';
  }

  get canSave() {
    return !!this.name()?.trim() && !!this.code()?.trim() && !!this.type() && !this.saving();
  }

  ngOnInit() {
    this.loadStores();
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.loadStores();
    });
  }

  loadStores() {
    this.storeService.getStores({
      skip: 1,
      take: 100,
      search: this.searchParam(),
      type: this.filterType() || undefined,
      includeInactive: this.includeInactive()
    }).subscribe({
      next: (stores) => {
        this.storesData.set(stores);
      },
      error: (error: unknown) => {
        console.error('Error al cargar tiendas:', error);
        this.alertService.show('Error al cargar tiendas', 'error', 3000);
      }
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  onSearch(param: string) {
    this.searchParam.set(param);
    this.searchSubject.next(param);
  }

  setFilterType(value: string) {
    this.filterType.set(value);
    this.loadStores();
  }

  toggleIncludeInactive(value: boolean) {
    this.includeInactive.set(value);
    this.loadStores();
  }

  openModal() {
    this.editingStore.set(null);
    this.resetForm();
    this.showModal();
  }

  openModalForEdit(store: Store) {
    this.editingStore.set(store);
    this.name.set(store.name);
    this.code.set(store.code);
    this.type.set(store.type ?? 'STORE');
    this.address.set(store.address ?? '');
    this.showModal();
  }

  async deactivateStore(store: Store) {
    const confirmed = window.confirm(`¿Deseas desactivar ${store.name}?`);
    if (!confirmed) {
      return;
    }

    this.storeService.deactivateStore(store.id).subscribe({
      next: (updatedStore) => {
        this.storesData.update((items) =>
          items.map((item) => item.id === updatedStore.id ? updatedStore : item)
        );
        this.alertService.show(`Tienda ${updatedStore.name} desactivada`, 'success', 3000);
      },
      error: (error: unknown) => {
        console.error('Error al desactivar tienda:', error);
        this.alertService.show('Error al desactivar tienda', 'error', 3000);
      }
    });
  }

  saveStore() {
    if (!this.canSave) {
      return;
    }

    this.saving.set(true);
    const payload = {
      name: this.name().trim(),
      code: this.code().trim(),
      type: this.type(),
      address: this.address()?.trim() || undefined,
    };

    const request = this.editingStore()
      ? this.storeService.updateStore(this.editingStore()!.id, payload)
      : this.storeService.createStore(payload);

    request.subscribe({
      next: (store) => {
        if (this.editingStore()) {
          this.storesData.update((items) =>
            items.map((item) => item.id === store.id ? store : item)
          );
          this.alertService.show('Tienda actualizada correctamente', 'success', 3000);
        } else {
          this.storesData.update((items) => [...items, store]);
          this.alertService.show('Tienda creada correctamente', 'success', 3000);
        }
        this.closeModal();
      },
      error: (error: unknown) => {
        console.error('Error al guardar tienda:', error);
        this.alertService.show('Error al guardar tienda', 'error', 3000);
      },
      complete: () => {
        this.saving.set(false);
      }
    });
  }

  private resetForm() {
    this.name.set('');
    this.code.set('');
    this.type.set('STORE');
    this.address.set('');
  }

  private showModal() {
    const modal = document.getElementById('store-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  closeModal() {
    const modal = document.getElementById('store-modal') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    this.resetForm();
  }
}
