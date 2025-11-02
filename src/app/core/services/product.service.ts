import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private api: ApiService) { }

  getAll(): Observable<Product[]> {
    return this.api.get<Product[]>('products');
  }

  getById(id: string): Observable<Product> {
    return this.api.get<Product>(`products/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.api.post<Product>('products', product);
  }

  update(id: string, updates: Partial<Product>): Observable<Product> {
    return this.api.put<Product>(`products/${id}`, updates);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`products/${id}`);
  }
}
