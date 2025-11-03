import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cartSubject = new BehaviorSubject<any[]>(this._loadFromStorage());
  cart$ = this._cartSubject.asObservable();

  constructor() {}

  private _loadFromStorage(): any[] {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('CartService: could not read cart from storage', e);
      return [];
    }
  }

  private _persist(cart: any[]) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('CartService: could not persist cart', e);
    }
    
    this._cartSubject.next(cart);
  }

  getCart(): any[] {
    return this._cartSubject.getValue();
  }

  addItem(item: any, qty: number = 1) {
    const id = item.id || item.name;
    const cart = this.getCart().slice();
    const existing = cart.find(c => c.id === id);
    if (existing) {
      existing.qty = (existing.qty || 0) + (qty || 1);
    } else {
      cart.push({ id, name: item.name, qty: qty || 1, price: item.price, img: item.imageUrl || item.img });
    }
    this._persist(cart);
  }

  inc(id: string) {
    const cart = this.getCart().slice();
    const e = cart.find(c => c.id === id);
    if (e) {
      e.qty = (e.qty || 0) + 1;
      this._persist(cart);
    }
  }

  dec(id: string) {
    const cart = this.getCart().slice();
    const e = cart.find(c => c.id === id);
    if (e && (e.qty || 0) > 1) {
      e.qty = e.qty - 1;
      this._persist(cart);
    }
  }

  remove(id: string) {
    const cart = this.getCart().filter(c => c.id !== id);
    this._persist(cart);
  }

  clear() {
    this._persist([]);
  }
}
