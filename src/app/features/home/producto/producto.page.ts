import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, CommonModule, FormsModule]
})
export class ProductoPage implements OnInit {
  item: any = null;
  qty: number = 1;

  debugState: any = null;
  constructor(public router: Router, private cartService: CartService) { }

  ngOnInit() {
    let s: any = {};
    try {
      const nav = (this.router as any).getCurrentNavigation?.();
      if (nav && (nav.extras as any)?.state) {
        s = (nav.extras as any).state;
      } else {
        s = history.state || {};
      }
    } catch (e) {
      s = history.state || {};
    }

    if ((!s || Object.keys(s).length === 0) && typeof sessionStorage !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('selectedProduct');
        if (raw) {
          const parsed = JSON.parse(raw);
          s = { ...s, ...parsed };
          sessionStorage.removeItem('selectedProduct');
        }
      } catch (e) {
      }
    }

    this.debugState = s;
    this.item = s.item || null;
    this.qty = s.qty || 1;
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
      this.cartService.addItem(this.item, this.qty || 1);
    } catch (e) {
      console.warn('Could not add item to cart', e);
    }
  }

  buyNow() {
    if (!this.item) return;
    this.addToCart();
    this.router.navigateByUrl('/home/carrito');
  }
}
