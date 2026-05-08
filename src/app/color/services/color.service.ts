import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Color, ColorResponse } from '../interfaces/color.interface';
import { Observable, catchError, throwError, tap, map } from 'rxjs';

const baseurl = environment.apiUrl;

interface OptionsColor {
  skip: number;
  take: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() {
  }
  private http = inject(HttpClient);

  getColors(options: OptionsColor): Observable<ColorResponse> {
    let params = new URLSearchParams({
      skip: options.skip.toString(),
      take: options.take.toString(),
    });
    if (options.isActive !== undefined) {
      params.set('isActive', String(options.isActive));
    }
    const url = `${baseurl}/color?${params.toString()}`;

    return this.http.get<ColorResponse>(url).pipe(
      map(response => {
        const data = options.isActive === undefined ? response.data : response.data.filter(color => color.isActive === options.isActive);
        return { ...response, data };
      }),
      tap(response => console.log('Colores obtenidos:', response)),
      catchError(error => {
        console.error('Error al obtener colores:', error);
        return throwError(() => error);
      })
    );
  }

  createColor(name: string): Observable<Color> {
    const url = `${baseurl}/color`;
    return this.http.post<Color>(url, { name }).pipe(
      tap(response => console.log('Color creado:', response)),
      catchError(error => {
        console.error('Error al crear color:', error);
        return throwError(() => new Error('Error al crear color'));
      })
    );
  }

  findByName(name: string, isActive?: boolean): Observable<Color[]> {
    let params = new URLSearchParams({
      name: encodeURIComponent(name),
    });
    if (isActive !== undefined) {
      params.set('isActive', String(isActive));
    }
    const url = `${baseurl}/color/search?${params.toString()}`;

    return this.http.get<Color[]>(url).pipe(
      map(response => isActive === undefined ? response : response.filter(color => color.isActive === isActive)),
      tap(response => console.log('Colores encontrados:', response)),
      catchError(error => {
        console.error('Error al buscar colores por nombre:', error);
        return throwError(() => new Error('Error al buscar colores por nombre'));
      })
    );
  }

  updateColor(id: number, name: string): Observable<Color> {
    const url = `${baseurl}/color/${id}`;
    return this.http.put<Color>(url, { name }).pipe(
      tap(response => console.log('Color actualizado:', response)),
      catchError(error => {
        console.error('Error al actualizar color:', error);
        return throwError(() => new Error('Error al actualizar color'));
      })
    );
  }

  deactivateColor(id: number): Observable<Color> {
    const url = `${baseurl}/color/${id}`;
    return this.http.put<Color>(url, { isActive: false }).pipe(
      tap(response => console.log('Color desactivado:', response)),
      catchError(error => {
        console.error('Error al desactivar color:', error);
        return throwError(() => new Error('Error al desactivar color'));
      })
    );
  }

  activateColor(id: number): Observable<Color> {
    const url = `${baseurl}/color/${id}`;
    return this.http.put<Color>(url, { isActive: true }).pipe(
      tap(response => console.log('Color activado:', response)),
      catchError(error => {
        console.error('Error al activar color:', error);
        return throwError(() => new Error('Error al activar color'));
      })
    );
  }
}
