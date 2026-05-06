import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryResponse } from '../interfaces/category.interface';
import { Observable, catchError, throwError, tap } from 'rxjs';
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
  getCategories(options: OptionsCategory, isActive?: boolean): Observable<CategoryResponse> {
    let url = `${baseurl}/categorie?skip=${options.skip}&take=${options.take}`;
    if (isActive !== undefined) {
      url += `&isActive=${isActive}`;
    }
    return this.http.get<CategoryResponse>(url).pipe(
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
    let url = `${baseurl}/categorie/search?name=${encodeURIComponent(name)}`;
    if (isActive !== undefined) {
      url += `&isActive=${isActive}`;
    }
    return this.http.get<Category[]>(url).pipe(
      tap(response => console.log('Categorías encontradas:', response)),
      catchError(error => {
     
        return throwError(() => new Error('Error al buscar categorías por nombre'));
      })
    );
  }

}
