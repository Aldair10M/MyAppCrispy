import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, IonImg, IonFooter } from '@ionic/angular/standalone';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButton, IonImg, IonFooter, CommonModule, FormsModule]
})
export class ComprasPage implements OnInit {
  // cart items are persisted in localStorage by the Menu page as { id, name, qty, price }
  cart: Array<any> = [];
  productsCache: Product[] = [];

  get subtotal() {
    return this.cart.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  }

  shipping = 7.5;

  get total() {
    return this.subtotal + this.shipping;
  }

  inc(item: any) {
    item.qty = (item.qty || 0) + 1;
    this.persistCart();
  }

  dec(item: any) {
    if ((item.qty || 0) > 1) {
      item.qty -= 1;
      this.persistCart();
    }
  }

  remove(item: any) {
    this.cart = this.cart.filter((c) => c.id !== item.id);
    this.persistCart();
  }

  confirmOrder() {
    console.log('Order confirmed', { subtotal: this.subtotal, total: this.total });
    // Placeholder: in a real app you'd call an order API here.
    // Clear cart after confirming
    this.cart = [];
    this.persistCart();
  }

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadCartFromStorage();
    // Load products to enhance cart items (images, updated prices)
    this.productService.getAll().subscribe({
      next: (items: Product[]) => {
        this.productsCache = items || [];
        this.enrichCartItems();
      },
      error: (err) => {
        // If product fetch fails, we still show cart from localStorage
        console.warn('Could not load products to enrich cart', err);
      }
    });
  }

  private loadCartFromStorage() {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        this.cart = JSON.parse(raw) as any[];
      } else {
        this.cart = [];
      }
    } catch (e) {
      console.warn('Could not parse cart from storage', e);
      this.cart = [];
    }
  }

  private persistCart() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Could not persist cart', e);
    }
  }

  private enrichCartItems() {
    if (!this.productsCache?.length) return;
    this.cart = this.cart.map(ci => {
      const pid = ci.id?.toString();
      const found = this.productsCache.find(p => (p.id && p.id.toString() === pid) || p.name === ci.name);
      if (found) {
        return { ...ci, img: found.imageUrl || (found as any).img || ci.img };
      }
      return ci;
    });
  }
}
