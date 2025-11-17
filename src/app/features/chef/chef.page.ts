import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  constructor(private orderService: OrderService, private userService: UserService, private router: Router) {}

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
        const base = (items || []).map(o => this.withBaseUserFields(o));
        this.enrichOrders(base, 'pending');
      },
      error: (err: any) => { console.error('Error loading pending orders', err); this.loading = false; }
    });
  }

  loadReady() {
    this.loading = true;
    this.orderService.list('listo').subscribe({
      next: (items: any[]) => {
        const base = (items || []).map(o => this.withBaseUserFields(o));
        this.enrichOrders(base, 'ready');
      },
      error: (err: any) => { console.error('Error loading ready orders', err); this.loading = false; }
    });
  }

  private withBaseUserFields(o: any) {
    const name = o.username || o.name || o.displayName || (o.user && (o.user.username || o.user.name || o.user.displayName)) || null;
    const email = o.email || (o.user && o.user.email) || null;
    return {
      ...o,
      _name: name,
      _email: email
    };
  }

  private enrichOrders(list: any[], target: 'pending' | 'ready') {
    const emailsToFetch = Array.from(new Set(list.filter(o => !o._name && o._email).map(o => o._email)));

    if (emailsToFetch.length === 0) {
      if (target === 'pending') this.pendingOrders = list.map(o => ({ ...o, _name: o._name || 'Anónimo' }));
      else this.readyOrders = list.map(o => ({ ...o, _name: o._name || 'Anónimo' }));
      this.loading = false;
      return;
    }

    const requests = emailsToFetch.map(email => this.userService.getByEmail(email).pipe(catchError(() => of(null))));
    forkJoin(requests).subscribe({
      next: (users: any[]) => {
        const mapByEmail = new Map<string, any>();
        users.forEach((u, idx) => {
          const email = emailsToFetch[idx];
          if (u) mapByEmail.set(email, u);
        });
        const merged = list.map(o => {
          if (!o._name && o._email && mapByEmail.has(o._email)) {
            const u = mapByEmail.get(o._email);
            const uName = u?.username || u?.name || u?.displayName || null;
            return { ...o, _name: uName || 'Anónimo' };
          }
          return { ...o, _name: o._name || 'Anónimo' };
        });
        if (target === 'pending') this.pendingOrders = merged;
        else this.readyOrders = merged;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error enriching orders', err);
        if (target === 'pending') this.pendingOrders = list.map(o => ({ ...o, _name: o._name || 'Anónimo' }));
        else this.readyOrders = list.map(o => ({ ...o, _name: o._name || 'Anónimo' }));
        this.loading = false;
      }
    });
  }

  attendOrder(order: any) {
    if (!order?.id) return;
    this.orderService.update(order.id, { status: 'listo' }).subscribe({
      next: (res: any) => {
        this.pendingOrders = this.pendingOrders.filter(o => o.id !== order.id);
      },
      error: (err: any) => console.error('Error updating order', err)
    });
  }
}
