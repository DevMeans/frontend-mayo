import { Component, inject, OnInit, OnDestroy, signal, computed, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GenericModalComponent } from '../../components/generic-modal/generic-modal.component';
import { ColorService } from '../../../color/services/color.service';
import { Color, ColorResponse } from '../../../color/interfaces/color.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AlertService } from '../../../shared/services/alert.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-color-admin-page',
  templateUrl: './color-admin-page.component.html',
  styleUrls: ['./color-admin-page.component.css'],
  standalone: true,
  imports: [GenericModalComponent, AlertComponent, ConfirmModalComponent]
})
export class ColorAdminPageComponent implements OnInit, OnDestroy {

  @ViewChild(GenericModalComponent) genericModal!: GenericModalComponent;

  private colorsData = signal<Color[]>([]);
  private searchSubject = new Subject<string>();
  private searchParam = signal<string>('');
  activeChecked = signal<boolean>(true);
  inactiveChecked = signal<boolean>(true);
  private filterParams = computed(() => ({ search: this.searchParam(), isActive: this.isActiveParam }));

  ListaColores = computed(() => this.getFilteredColors());

  private get isActiveParam(): boolean | undefined {
    const active = this.activeChecked();
    const inactive = this.inactiveChecked();
    if (active && !inactive) return true;
    if (!active && inactive) return false;
    return undefined;
  }

  private getFilteredColors(): Color[] {
    const search = this.searchParam().toLowerCase();
    const isActive = this.isActiveParam;
    const colors = this.colorsData();

    return colors.filter(color => {
      const matchesSearch = !search || color.name.toLowerCase().includes(search);
      const matchesActive = isActive === undefined || color.isActive === isActive;
      return matchesSearch && matchesActive;
    });
  }

  constructor(private colorService: ColorService, private alertService: AlertService, private cdr: ChangeDetectorRef, private confirmService: ConfirmService) {

  }

  ngOnInit() {
    console.log('ColorAdminPageComponent initialized');
    this.loadInitialColors();
    this.searchSubject.pipe(debounceTime(500)).subscribe(param => {
      console.log('Búsqueda actualizada:', param);
      this.searchParam.set(param);
    });
  }

  ngOnDestroy() {
    this.searchSubject.unsubscribe();
  }

  private loadInitialColors() {
    this.colorService.getColors({ skip: 1, take: 100 }).subscribe({
      next: (response) => {
        console.log('Colores cargados:', response.data);
        this.colorsData.set(response.data);
      },
      error: (error) => {
        console.error('Error al cargar colores:', error);
        this.alertService.show('Error al cargar colores', 'error', 2000);
      }
    });
  }

  setActiveChecked(value: boolean) {
    this.activeChecked.set(value);
  }

  setInactiveChecked(value: boolean) {
    this.inactiveChecked.set(value);
  }

  obtenerColores(param: string) {
    console.log('Param recibido en obtenerColores:', param);
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

  openModalForEdit(color: Color) {
    console.log('Opening modal for editing color:', color);
    this.genericModal.setEditingItem(color);
    const modal = document.getElementById('generic-modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  async deactivateColor(color: Color) {
    const confirmed = await this.confirmService.confirm({
      title: 'Desactivar Color',
      message: `¿Estás seguro de que deseas desactivar el color "${color.name}"?`,
      acceptText: 'Desactivar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    console.log('Desactivando color:', color);
    this.colorService.deactivateColor(color.id).subscribe({
      next: (deactivatedColor) => {
        console.log('Color desactivado:', deactivatedColor);
        this.colorsData.update(colors =>
          colors.map(c => c.id === color.id ? { ...c, isActive: false } : c)
        );
        this.cdr.markForCheck();
        this.alertService.show(`Color "${color.name}" desactivado exitosamente`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al desactivar color:', error);
        this.alertService.show('Error al desactivar color', 'error', 2000);
      }
    });
  }

  async activateColor(color: Color) {
    const confirmed = await this.confirmService.confirm({
      title: 'Activar Color',
      message: `¿Estás seguro de que deseas activar el color "${color.name}"?`,
      acceptText: 'Activar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    console.log('Activando color:', color);
    this.colorService.activateColor(color.id).subscribe({
      next: (activatedColor) => {
        console.log('Color activado:', activatedColor);
        this.colorsData.update(colors =>
          colors.map(c => c.id === color.id ? { ...c, isActive: true } : c)
        );
        this.cdr.markForCheck();
        this.alertService.show(`Color "${color.name}" activado exitosamente`, 'success', 2000);
      },
      error: (error) => {
        console.error('Error al activar color:', error);
        this.alertService.show('Error al activar color', 'error', 2000);
      }
    });
  }

  onColorSaved(color: Color) {
    const editingItem = this.genericModal.editingItem();
    if (editingItem?.id) {
      // Modo edición
      console.log('Actualizando color:', color.name);
      this.colorService.updateColor(editingItem.id, color.name).subscribe({
        next: (updatedColor) => {
          console.log('Color actualizado:', updatedColor);
          this.colorsData.update(colors =>
            colors.map(c => c.id === updatedColor.id ? updatedColor : c)
          );
          this.alertService.show(`Color "${color.name}" actualizado exitosamente`, 'success', 2000);
          this.genericModal.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar color:', error);
          this.alertService.show('Error al actualizar color', 'error', 2000);
        }
      });
    } else {
      // Modo creación
      console.log('Creando nuevo color:', color.name);
      this.colorService.createColor(color.name).subscribe({
        next: (newColor) => {
          console.log('Color creado:', newColor);
          this.colorsData.update(colors => [...colors, newColor]);
          this.alertService.show(`Color "${color.name}" creado exitosamente`, 'success', 2000);
          this.genericModal.closeModal();
        },
        error: (error) => {
          console.error('Error al crear color:', error);
          this.alertService.show('Error al crear color', 'error', 2000);
        }
      });
    }
  }

  get errorMessage(): string {
    return '';
  }
}
