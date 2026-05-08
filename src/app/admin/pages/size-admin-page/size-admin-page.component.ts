import { Component, inject, OnInit, OnDestroy, signal, computed, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GenericModalComponent } from '../../components/generic-modal/generic-modal.component';
import { SizeService } from '../../../size/services/size.service';
import { Size, SizeResponse } from '../../../size/interfaces/size.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-size-admin-page',
  templateUrl: './size-admin-page.component.html',
  styleUrls: ['./size-admin-page.component.css'],
  standalone: true,
  imports: [GenericModalComponent, AlertComponent, ConfirmModalComponent]
})
export class SizeAdminPageComponent implements OnInit, OnDestroy {

  @ViewChild(GenericModalComponent) genericModal!: GenericModalComponent;

  private sizesData = signal<Size[]>([]);
  private searchSubject = new Subject<string>();
  private searchParam = signal<string>('');
  activeChecked = signal<boolean>(true);
  inactiveChecked = signal<boolean>(true);
  private filterParams = computed(() => ({ search: this.searchParam(), isActive: this.isActiveParam }));

  ListaTamanos = computed(() => this.getFilteredSizes());

  private get isActiveParam(): boolean | undefined {
    const active = this.activeChecked();
    const inactive = this.inactiveChecked();
    if (active && !inactive) return true;
    if (!active && inactive) return false;
    return undefined;
  }

  private getFilteredSizes(): Size[] {
    const search = this.searchParam().toLowerCase();
    const isActive = this.isActiveParam;
    const sizes = this.sizesData();

    return sizes.filter(size => {
      const matchesSearch = !search || size.name.toLowerCase().includes(search);
      const matchesActive = isActive === undefined || size.isActive === isActive;
      return matchesSearch && matchesActive;
    });
  }

  constructor(private sizeService: SizeService, private alertService: AlertService, private cdr: ChangeDetectorRef, private confirmService: ConfirmService) {

  }

  ngOnInit() {
    console.log('SizeAdminPageComponent initialized');
    this.loadInitialSizes();
    this.searchSubject.pipe(debounceTime(500)).subscribe(param => {
      console.log('Búsqueda actualizada:', param);
      this.searchParam.set(param);
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  private loadInitialSizes() {
    this.sizeService.getSizes({ skip: 1, take: 100 }).subscribe({
      next: (response) => {
        console.log('Tamaños cargados:', response.data);
        this.sizesData.set(response.data);
      },
      error: (error) => {
        console.error('Error al cargar tamaños:', error);
        this.alertService.show('Error al cargar tamaños', 'error', 2000);
      }
    });
  }

  setActiveChecked(value: boolean) {
    this.activeChecked.set(value);
  }

  setInactiveChecked(value: boolean) {
    this.inactiveChecked.set(value);
  }

  obtenerTamanos(param: string) {
    console.log('Param recibido en obtenerTamanos:', param);
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

  openModalForEdit(size: Size) {
    console.log('Opening modal for editing size:', size);
    this.genericModal.setEditingItem(size);
    const modal = document.getElementById('generic-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  async deactivateSize(size: Size) {
    const confirmed = await this.confirmService.confirm({
      title: 'Desactivar Tamaño',
      message: `¿Estás seguro de que deseas desactivar el tamaño "${size.name}"?`,
      acceptText: 'Desactivar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    console.log('Desactivando tamaño:', size);
    this.sizeService.deactivateSize(size.id).subscribe({
      next: (deactivatedSize) => {
        console.log('Tamaño desactivado:', deactivatedSize);
        this.sizesData.update(sizes =>
          sizes.map(s => s.id === size.id ? { ...s, isActive: false } : s)
        );
        this.cdr.markForCheck();
        this.alertService.show(`Tamaño "${size.name}" desactivado exitosamente`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al desactivar tamaño:', error);
        this.alertService.show('Error al desactivar tamaño', 'error', 2000);
      }
    });
  }

  async activateSize(size: Size) {
    const confirmed = await this.confirmService.confirm({
      title: 'Activar Tamaño',
      message: `¿Estás seguro de que deseas activar el tamaño "${size.name}"?`,
      acceptText: 'Activar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    console.log('Activando tamaño:', size);
    this.sizeService.activateSize(size.id).subscribe({
      next: (activatedSize) => {
        console.log('Tamaño activado:', activatedSize);
        this.sizesData.update(sizes =>
          sizes.map(s => s.id === size.id ? { ...s, isActive: true } : s)
        );
        this.cdr.markForCheck();
        this.alertService.show(`Tamaño "${size.name}" activado exitosamente`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al activar tamaño:', error);
        this.alertService.show('Error al activar tamaño', 'error', 2000);
      }
    });
  }

  onSizeSaved(size: Size) {
    const editingItem = this.genericModal.editingItem();
    if (editingItem?.id) {
      // Modo edición
      console.log('Actualizando tamaño:', size.name);
      this.sizeService.updateSize(editingItem.id, size.name).subscribe({
        next: (updatedSize) => {
          console.log('Tamaño actualizado:', updatedSize);
          this.sizesData.update(sizes =>
            sizes.map(s => s.id === updatedSize.id ? updatedSize : s)
          );
          this.alertService.show(`Tamaño "${size.name}" actualizado exitosamente`, 'success', 2000);
          this.genericModal.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar tamaño:', error);
          this.alertService.show('Error al actualizar tamaño', 'error', 2000);
        }
      });
    } else {
      // Modo creación
      console.log('Creando nuevo tamaño:', size.name);
      this.sizeService.createSize(size.name).subscribe({
        next: (newSize) => {
          console.log('Tamaño creado:', newSize);
          this.sizesData.update(sizes => [...sizes, newSize]);
          this.alertService.show(`Tamaño "${size.name}" creado exitosamente`, 'success', 2000);
          this.genericModal.closeModal();
        },
        error: (error) => {
          console.error('Error al crear tamaño:', error);
          this.alertService.show('Error al crear tamaño', 'error', 2000);
        }
      });
    }
  }

  get errorMessage(): string {
    return '';
  }
}
