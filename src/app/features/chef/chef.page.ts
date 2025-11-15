import { Component, AfterViewInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
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
export class ChefPage implements AfterViewInit, OnDestroy {
  title = 'Zona Chef';

  mode: 'idle' | 'pending' | 'ready' = 'idle';
  loading = false;
  pendingOrders: any[] = [];
  readyOrders: any[] = [];

  private _observer: MutationObserver | null = null;

  constructor(private orderService: OrderService, private router: Router, private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // remove any Ionic inline bottom padding that was injected
    setTimeout(() => {
      this.removeScrollPadding();
      this.setupScrollPaddingObserver();
    }, 50);
  }

  private removeScrollPadding() {
    try {
      // try to find inner scroll inside this component first
      let el: any = this.elRef?.nativeElement?.querySelector?.('.inner-scroll.scroll-y');
      if (!el) el = document.querySelector('ion-content .inner-scroll.scroll-y') || document.querySelector('.inner-scroll.scroll-y') || document.querySelector('.scroll-content');
      if (el) {
        // remove inline styles that cause extra bottom spacing
        try { this.renderer.removeStyle(el, 'padding-bottom'); } catch(e) {}
        try { this.renderer.removeStyle(el, 'paddingBottom'); } catch(e) {}
        try { this.renderer.removeStyle(el, 'margin-bottom'); } catch(e) {}
        try { this.renderer.removeStyle(el, 'marginBottom'); } catch(e) {}
        try { this.renderer.removeStyle(el, 'min-height'); } catch(e) {}
        try { this.renderer.removeStyle(el, 'minHeight'); } catch(e) {}
        try { this.renderer.removeStyle(el, 'height'); } catch(e) {}
        // also set to zero values just in case
        this.renderer.setStyle(el, 'padding-bottom', '0px');
        this.renderer.setStyle(el, 'margin-bottom', '0px');
        this.renderer.setStyle(el, 'min-height', '0px');
        this.renderer.setStyle(el, 'height', 'auto');
      }
    } catch (e) {
      // ignore
    }
  }

  private setupScrollPaddingObserver() {
    try {
      const target = this.elRef?.nativeElement?.querySelector?.('.inner-scroll.scroll-y') || document.querySelector('ion-content .inner-scroll.scroll-y') || document.querySelector('.inner-scroll.scroll-y') || document.querySelector('.scroll-content');
      if (!target) return;
      // disconnect existing
      if (this._observer) { try { this._observer.disconnect(); } catch(e) {} }
      this._observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'class')) {
            this.removeScrollPadding();
          }
        }
      });
      this._observer.observe(target, { attributes: true, attributeFilter: ['style', 'class'] });
    } catch (e) {
      // ignore
    }
  }

  ngOnDestroy(): void {
    try { if (this._observer) this._observer.disconnect(); } catch (e) {}
  }

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
