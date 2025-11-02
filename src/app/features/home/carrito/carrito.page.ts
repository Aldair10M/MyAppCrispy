import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, IonImg, IonFooter } from '@ionic/angular/standalone';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButton, IonImg, IonFooter, CommonModule, FormsModule]
})
export class CarritoPage implements OnInit {
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
    this.cartService.inc(item.id);
  }

  dec(item: any) {
    if ((item.qty || 0) > 1) {
      this.cartService.dec(item.id);
    }
  }

  remove(item: any) {
    this.cartService.remove(item.id);
  }

  confirmOrder() {
    if (!this.cart || this.cart.length === 0) {
      // Prevent confirming an empty order
      alert('No hay productos en el carrito. Agrega productos antes de confirmar.');
      return;
    }

    console.log('Order confirmed', { subtotal: this.subtotal, total: this.total });
    // Placeholder: in a real app you'd call an order API here.
    // Clear cart after confirming
    this.cartService.clear();
  }

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit() {
    // subscribe to cart stored in CartService
    this.cart = this.cart || [];
    this.cartService.cart$.subscribe((cart: any) => {
      this.cart = cart || [];
      // when cart changes, enrich items with product metadata
      this.enrichCartItems();
    });

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
