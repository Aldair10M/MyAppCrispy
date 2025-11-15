import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  create(order: any): Observable<any> {
    return this.api.post('orders', order);
  }

  listByEmail(email: string): Observable<any[]> {
    return this.api.get<any[]>(`orders?email=${encodeURIComponent(email)}`);
  }

  listByUserId(userId: string): Observable<any[]> {
    return this.api.get<any[]>(`orders?userId=${encodeURIComponent(userId)}`);
  }

  update(id: string, updates: Partial<any>): Observable<any> {
    return this.api.put(`orders/${id}`, updates);
  }

  list(status?: string): Observable<any[]> {
    if (status) return this.api.get<any[]>(`orders?status=${encodeURIComponent(status)}`);
    return this.api.get<any[]>(`orders`);
  }
}
