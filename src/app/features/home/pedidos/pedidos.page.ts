import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { FooterComponent } from '../../../shared/footer/footer.component';

interface OrderItem { name: string; qty: number; price: number; imageUrl?: string }
interface Order { id?: string; items: OrderItem[]; subtotal: number; shipping: number; total: number; status?: string; createdAt?: number; email?: string }

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, FooterComponent, CommonModule, FormsModule]
})

export class PedidosPage implements OnInit {

  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.loadOrders();
  }

  goHome() {
    try {
      this.router.navigateByUrl('/home');
    } catch (e) {
      console.warn('Error navigating to /home', e);
    }
  }

  private loadOrders() {
    this.loading = true; this.error = null;
    let email: string | null = null;
    try {
      const raw = localStorage.getItem('user');
      if (raw) email = (JSON.parse(raw) as any)?.email || null;
    } catch {}

    if (!email) {
      // Fallback a pedidos locales si no hay sesión
      try {
        const raw = localStorage.getItem('orders');
        this.orders = raw ? JSON.parse(raw) : [];
      } catch { this.orders = []; }
      this.loading = false;
      return;
    }

    this.api.get<Order[]>(`orders?email=${encodeURIComponent(email)}`).subscribe({
      next: (list) => {
        // Si backend vacío, mezclar con local como respaldo
        if (!list || list.length === 0) {
          try {
            const raw = localStorage.getItem('orders');
            const local = raw ? JSON.parse(raw) : [];
            this.orders = local;
          } catch { this.orders = []; }
        } else {
          this.orders = list;
        }
        this.loading = false;
      },
      error: (_) => {
        try {
          const raw = localStorage.getItem('orders');
          this.orders = raw ? JSON.parse(raw) : [];
        } catch { this.orders = []; }
        this.loading = false;
      }
    });
  }

}
