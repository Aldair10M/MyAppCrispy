import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonImg, CommonModule, FormsModule]
})
export class ProductoPage implements OnInit {
  item: any = null;
  qty: number = 1;

  constructor(private router: Router) { }

  ngOnInit() {
    // Try to read navigation state (set by menu.buy)
    const nav = (this.router as any).getCurrentNavigation?.();
    if (nav && (nav.extras as any)?.state) {
      const s: any = (nav.extras as any).state;
      this.item = s.item || null;
      this.qty = s.qty || 1;
    } else {
      // fallback to history.state (works after navigation)
      const s: any = history.state || {};
      this.item = s.item || null;
      this.qty = s.qty || 1;
    }
  }

  increment() {
    this.qty = (this.qty || 0) + 1;
  }

  decrement() {
    if ((this.qty || 0) > 0) this.qty = this.qty - 1;
  }

  addToCart() {
    if (!this.item) return;
    try {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      const id = this.item.id || this.item.name;
      const existing = cart.find((c: any) => c.id === id);
      if (existing) {
        existing.qty = (existing.qty || 0) + (this.qty || 1);
      } else {
        cart.push({ id, name: this.item.name, qty: this.qty || 1, price: this.item.price, img: this.item.imageUrl || this.item.img });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart', e);
    }
  }

  buyNow() {
    if (!this.item) return;
    this.addToCart();
    this.router.navigateByUrl('/home/carrito');
  }
}
