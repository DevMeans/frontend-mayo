import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryResponse } from '../interfaces/category.interface';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
const baseurl = environment.apiUrl;
interface OptionsCategory {
  skip: number;
  take: number;
  isActive?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() {
  }
  private http = inject(HttpClient);
  getCategories(options: OptionsCategory): Observable<CategoryResponse> {
    let params = new URLSearchParams({
      skip: options.skip.toString(),
      take: options.take.toString(),
    });
    if (options.isActive !== undefined) {
      params.set('isActive', String(options.isActive));
    }
    const url = `${baseurl}/categorie?${params.toString()}`;

    return this.http.get<CategoryResponse>(url).pipe(
      map(response => {
        const data = options.isActive === undefined ? response.data : response.data.filter(category => category.isActive === options.isActive);
        return { ...response, data };
      }),
      tap(response => console.log('Categorías obtenidas:', response)),
      catchError(error => {
        console.error('Error al obtener categorías:', error);
        return throwError(() => error);
      })
    );
  }
  createCategory(name: string): Observable<Category> {
    const url = `${baseurl}/categorie`;
    return this.http.post<Category>(url, { name }).pipe(
      tap(response => console.log('Categoría creada:', response)),
      catchError(error => {
        console.error('Error al crear categoría:', error);
        return throwError(() => new Error('Error al crear categoría'));
      })
    );
  }
  findByName(name: string, isActive?: boolean): Observable<Category[]> {
    let params = new URLSearchParams({
      name: encodeURIComponent(name),
    });
    if (isActive !== undefined) {
      params.set('isActive', String(isActive));
    }
    const url = `${baseurl}/categorie/search?${params.toString()}`;

    return this.http.get<Category[]>(url).pipe(
      map(response => isActive === undefined ? response : response.filter(category => category.isActive === isActive)),
      tap(response => console.log('Categorías encontradas:', response)),
      catchError(error => {
        console.error('Error al buscar categorías por nombre:', error);
        return throwError(() => new Error('Error al buscar categorías por nombre'));
      })
    );
  }

}
