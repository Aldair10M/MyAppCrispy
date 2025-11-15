import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Promo } from '../models/promo.model';

@Injectable({ providedIn: 'root' })
export class PromoService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Promo[]> {
    return this.api.get<Promo[]>('promos');
  }

  getById(id: string): Observable<Promo> {
    return this.api.get<Promo>(`promos/${id}`);
  }

  create(promo: Promo): Observable<any> {
    return this.api.post('promos', promo);
  }

  update(id: string, updates: Partial<Promo>): Observable<any> {
    return this.api.put(`promos/${id}`, updates);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`promos/${id}`);
  }
}
