import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GenerateVariantsRequest,
  GenerateVariantsResponse,
  Product,
  ProductCreateRequest,
  ProductResponse,
  ProductUpdateRequest
} from '../interfaces/product.interface';

const baseurl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(options: { skip: number; take: number; search?: string; isActive?: boolean }): Observable<ProductResponse> {
    const params = new URLSearchParams({
      skip: options.skip.toString(),
      take: options.take.toString()
    });

    if (options.search) {
      params.set('search', options.search);
    }
    if (options.isActive !== undefined) {
      params.set('isActive', String(options.isActive));
    }

    return this.http.get<ProductResponse>(`${baseurl}/products?${params.toString()}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${baseurl}/products/${id}`);
  }

  createProduct(body: ProductCreateRequest): Observable<{ product: Product; variants: any[]; images: string[]; message: string }> {
    return this.http.post<{ product: Product; variants: any[]; images: string[]; message: string }>(`${baseurl}/products`, body);
  }

  generateVariants(body: GenerateVariantsRequest): Observable<GenerateVariantsResponse> {
    return this.http.post<GenerateVariantsResponse>(`${baseurl}/products/generate-variants`, body);
  }

  updateProduct(id: number, body: ProductUpdateRequest): Observable<{ product: Product; message: string }> {
    return this.http.patch<{ product: Product; message: string }>(`${baseurl}/products/${id}`, body);
  }

  setProductActive(id: number, isActive: boolean): Observable<{ product: Product; message: string }> {
    return this.http.patch<{ product: Product; message: string }>(`${baseurl}/products/${id}`, { isActive });
  }

  deleteImage(publicId: string): Observable<{ message: string }> {
    const encodedPublicId = encodeURIComponent(publicId);
    return this.http.delete<{ message: string }>(`${baseurl}/products/image/${encodedPublicId}`);
  }
}
