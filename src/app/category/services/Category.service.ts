import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryResponse } from '../interfaces/category.interface';
import { Observable, catchError, throwError } from 'rxjs';
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
      catchError(error => {
        console.error('Error en getCategories:', error);
        let userMessage = 'Error desconocido';
        if (error.status === 400) {
          userMessage = error.error?.message || 'Datos inválidos';
        } else if (error.status === 500) {
          userMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
        }
        const customError = { ...error, userMessage };
        return throwError(customError);
      })
    );
  }
  createCategory(name:string): Observable<Category> {
    const url = `${baseurl}/categorie`;
    return this.http.post<Category>(url,{name})
  }
}
