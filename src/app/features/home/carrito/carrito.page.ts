import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, IonImg, IonFooter } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ApiService } from '../../../core/services/api.service';
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

  async confirmOrder() {
    if (!this.cart || this.cart.length === 0) {
      // Prevent confirming an empty order
      alert('No hay productos en el carrito. Agrega productos antes de confirmar.');
      return;
    }

    // Build a full order object. In a real app this would be sent to a backend API.
    const order = {
      id: 'order_' + Date.now(),
      items: this.cart.map(c => ({ id: c.id, name: c.name, qty: c.qty, price: c.price, img: c.img })),
      subtotal: this.subtotal,
      shipping: this.shipping,
      total: this.total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    console.log('Order confirmed', order);

    // Persist order to backend (Firestore) and locally as fallback
  try {
      // attach user email if available
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        (order as any).email = u.email;
        (order as any).userId = u.uid || u.id || null;
      }

      this.api.post('orders', order).subscribe({
        next: async (res: any) => {
          console.log('Order saved to server', res);
          // persist to local history as well
          try {
            const raw = localStorage.getItem('orders');
            const orders = raw ? JSON.parse(raw) : [];
            orders.push(res.order || order);
            localStorage.setItem('orders', JSON.stringify(orders));
          } catch (e) {
            console.warn('Could not persist orders history locally', e);
          }

          // show success toast and then clear cart
          const t = await this.toast.create({
            message: 'Pedido confirmado y guardado ✅',
            duration: 2500,
            color: 'success'
          });
          await t.present();

          // clear cart
          this.cartService.clear();
        },
        error: async (err: any) => {
          console.error('Error saving order to server', err);
          // fallback: persist locally so user doesn't lose order
          try {
            const raw = localStorage.getItem('orders');
            const orders = raw ? JSON.parse(raw) : [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
          } catch (e) {
            console.warn('Could not persist orders history locally', e);
          }

          const t = await this.toast.create({
            message: 'No se pudo guardar en el servidor — pedido guardado localmente',
            duration: 3500,
            color: 'warning'
          });
          await t.present();

          this.cartService.clear();
        }
      });
    } catch (e) {
      console.warn('Could not persist orders history', e);
      const t = await this.toast.create({
        message: 'Error procesando el pedido',
        duration: 2500,
        color: 'danger'
      });
      await t.present();
      this.cartService.clear();
    }
  }

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private api: ApiService,
    private toast: ToastController
  ) { }

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
