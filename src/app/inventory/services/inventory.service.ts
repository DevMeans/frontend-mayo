import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../interfaces/inventory.interface';

const baseurl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);

  getInventories(options: { skip: number; take: number; search?: string; includeZero?: boolean; storeId?: number; variantId?: number }): Observable<Inventory[]> {
    const params = new URLSearchParams({
      skip: options.skip.toString(),
      take: options.take.toString()
    });

    if (options.search) {
      params.set('search', options.search);
    }
    if (options.includeZero !== undefined) {
      params.set('includeZero', String(options.includeZero));
    }
    if (options.storeId !== undefined) {
      params.set('storeId', String(options.storeId));
    }
    if (options.variantId !== undefined) {
      params.set('variantId', String(options.variantId));
    }

    return this.http.get<Inventory[]>(`${baseurl}/inventory?${params.toString()}`);
  }

  createInventoryEntry(body: { storeId: number; variantId: number; quantity: number }): Observable<{ inventory: Inventory; movement: any }> {
    return this.http.post<{ inventory: Inventory; movement: any }>(`${baseurl}/inventory/movements`, {
      storeId: body.storeId,
      variantId: body.variantId,
      type: 'IN',
      quantity: body.quantity
    });
  }
}
