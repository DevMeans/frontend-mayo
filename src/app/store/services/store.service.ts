import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../interfaces/store.interface';

const baseurl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private http = inject(HttpClient);

  getStores(options: { skip: number; take: number; search?: string; type?: string; includeInactive?: boolean }): Observable<Store[]> {
    const params = new URLSearchParams({
      skip: options.skip.toString(),
      take: options.take.toString()
    });

    if (options.search) {
      params.set('search', options.search);
    }
    if (options.type) {
      params.set('type', options.type);
    }
    if (options.includeInactive !== undefined) {
      params.set('includeInactive', String(options.includeInactive));
    }

    return this.http.get<Store[]>(`${baseurl}/stores?${params.toString()}`);
  }

  createStore(body: { name: string; code: string; type: string; address?: string }): Observable<Store> {
    return this.http.post<Store>(`${baseurl}/stores`, body);
  }

  updateStore(id: number, body: { name: string; code: string; type: string; address?: string }): Observable<Store> {
    return this.http.put<Store>(`${baseurl}/stores/${id}`, body);
  }

  deactivateStore(id: number): Observable<Store> {
    return this.http.patch<Store>(`${baseurl}/stores/${id}/deactivate`, {});
  }
}
