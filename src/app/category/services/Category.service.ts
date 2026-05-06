import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryResponse } from '../interfaces/category.interface';
import { Observable, catchError, throwError, tap } from 'rxjs';
const baseurl = environment.apiUrl;
interface OptionsCategory {
  skip: number;
  take: number;
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() {

  }
  private http = inject(HttpClient);
  getCategories(options: OptionsCategory): Observable<CategoryResponse> {
    const url = `${baseurl}/categorie?skip=${options.skip}&take=${options.take}`;
    return this.http.get<CategoryResponse>(url).pipe(
      tap(response => console.log('Categorías obtenidas:', response)),
      catchError(error => {
        console.error('Error al obtener categorías:', error);
        return throwError(() => error);
      })
    );
  }
  createCategory(name:string): Observable<Category> {
    const url = `${baseurl}/categorie`;
    return this.http.post<Category>(url,{name}).pipe(
      tap(response => console.log('Categoría creada:', response)),
      catchError(error => {
        console.error('Error al crear categoría:', error);
        return throwError(() => new Error('Error al crear categoría'));
      })
    );
  }
}
