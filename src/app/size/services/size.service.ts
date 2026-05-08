import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Size, SizeResponse } from '../interfaces/size.interface';
import { Observable, catchError, throwError, tap, map } from 'rxjs';

const baseurl = environment.apiUrl;

interface OptionsSize {
  skip: number;
  take: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  constructor() {
  }
  private http = inject(HttpClient);

  getSizes(options: OptionsSize): Observable<SizeResponse> {
    let params = new URLSearchParams({
      skip: options.skip.toString(),
      take: options.take.toString(),
    });
    if (options.isActive !== undefined) {
      params.set('isActive', String(options.isActive));
    }
    const url = `${baseurl}/size?${params.toString()}`;

    return this.http.get<SizeResponse>(url).pipe(
      map(response => {
        const data = options.isActive === undefined ? response.data : response.data.filter(size => size.isActive === options.isActive);
        return { ...response, data };
      }),
      tap(response => console.log('Tamaños obtenidos:', response)),
      catchError(error => {
        console.error('Error al obtener tamaños:', error);
        return throwError(() => error);
      })
    );
  }

  createSize(name: string): Observable<Size> {
    const url = `${baseurl}/size`;
    return this.http.post<Size>(url, { name }).pipe(
      tap(response => console.log('Tamaño creado:', response)),
      catchError(error => {
        console.error('Error al crear tamaño:', error);
        return throwError(() => new Error('Error al crear tamaño'));
      })
    );
  }

  findByName(name: string, isActive?: boolean): Observable<Size[]> {
    let params = new URLSearchParams({
      name: encodeURIComponent(name),
    });
    if (isActive !== undefined) {
      params.set('isActive', String(isActive));
    }
    const url = `${baseurl}/size/search?${params.toString()}`;

    return this.http.get<Size[]>(url).pipe(
      map(response => isActive === undefined ? response : response.filter(size => size.isActive === isActive)),
      tap(response => console.log('Tamaños encontrados:', response)),
      catchError(error => {
        console.error('Error al buscar tamaños por nombre:', error);
        return throwError(() => new Error('Error al buscar tamaños por nombre'));
      })
    );
  }

  updateSize(id: number, name: string): Observable<Size> {
    const url = `${baseurl}/size/${id}`;
    return this.http.put<Size>(url, { name }).pipe(
      tap(response => console.log('Tamaño actualizado:', response)),
      catchError(error => {
        console.error('Error al actualizar tamaño:', error);
        return throwError(() => new Error('Error al actualizar tamaño'));
      })
    );
  }

  deactivateSize(id: number): Observable<Size> {
    const url = `${baseurl}/size/${id}`;
    return this.http.put<Size>(url, { isActive: false }).pipe(
      tap(response => console.log('Tamaño desactivado:', response)),
      catchError(error => {
        console.error('Error al desactivar tamaño:', error);
        return throwError(() => new Error('Error al desactivar tamaño'));
      })
    );
  }

  activateSize(id: number): Observable<Size> {
    const url = `${baseurl}/size/${id}`;
    return this.http.put<Size>(url, { isActive: true }).pipe(
      tap(response => console.log('Tamaño activado:', response)),
      catchError(error => {
        console.error('Error al activar tamaño:', error);
        return throwError(() => new Error('Error al activar tamaño'));
      })
    );
  }
}
