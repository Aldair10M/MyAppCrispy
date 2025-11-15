import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.page.html',
  styleUrls: ['./chef.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule]
})
export class ChefPage {
  title = 'Zona Chef';

  mode: 'idle' | 'pending' | 'ready' = 'idle';
  loading = false;
  pendingOrders: any[] = [];
  readyOrders: any[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  logout() {
    try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
    this.router.navigateByUrl('/auth/login');
  }

  showPending() {
    this.mode = 'pending';
    this.loadPending();
  }

  showReady() {
    this.mode = 'ready';
    this.loadReady();
  }

  loadPending() {
    this.loading = true;
    this.orderService.list('pending').subscribe({
      next: (items: any[]) => {
        this.pendingOrders = (items || []).map(o => ({
          ...o,
          _displayName: o.username || (o.user && (o.user.username || o.user.name)) || o.email || (o.userId ? `User-${String(o.userId).slice(0,6)}` : 'Anónimo')
        }));
        this.loading = false;
      },
      error: (err: any) => { console.error('Error loading pending orders', err); this.loading = false; }
    });
  }

  loadReady() {
    this.loading = true;
    this.orderService.list('listo').subscribe({
      next: (items: any[]) => {
        this.readyOrders = (items || []).map(o => ({
          ...o,
          _displayName: o.username || (o.user && (o.user.username || o.user.name)) || o.email || (o.userId ? `User-${String(o.userId).slice(0,6)}` : 'Anónimo')
        }));
        this.loading = false;
      },
      error: (err: any) => { console.error('Error loading ready orders', err); this.loading = false; }
    });
  }

  attendOrder(order: any) {
    if (!order?.id) return;
    this.orderService.update(order.id, { status: 'listo' }).subscribe({
      next: (res: any) => {
        // remove from pending and optionally add to ready
        this.pendingOrders = this.pendingOrders.filter(o => o.id !== order.id);
      },
      error: (err: any) => console.error('Error updating order', err)
    });
  }
}
