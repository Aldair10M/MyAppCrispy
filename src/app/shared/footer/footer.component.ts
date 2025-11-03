import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonFooter, IonButton } from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFooter, IonButton, CommonModule]
})
export class FooterComponent implements OnInit, OnDestroy {

  activeTab: 'home' | 'search' | 'orders' | 'profile' = 'home';

  footerImages = {
    home: 'assets/img/inicio.png',
    search: 'assets/img/buscar.png',
    orders: 'assets/img/pedido.png',
    profile: 'assets/img/perfil.png'
  };

  private _sub: Subscription | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    try {
      const url = (this.router.url as string) || '';
      this.activeTab = this.mapUrlToTab(url);
    } catch (e) { }

    this._sub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url: string = e.urlAfterRedirects || e.url || '';
      this.activeTab = this.mapUrlToTab(url);
    });
  }

  ngOnDestroy() {
    try { this._sub?.unsubscribe(); } catch (e) { }
  }

  navigateToTab(tab: 'home' | 'search' | 'orders' | 'profile') {
    this.activeTab = tab;
    if (tab === 'home') {
      this.router.navigateByUrl('/home');
    } else if (tab === 'profile') {
      this.router.navigateByUrl('/home/perfil');
    } else if (tab === 'orders') {
      this.router.navigateByUrl('/home/pedidos');
    } else if (tab === 'search') {
      this.router.navigateByUrl('/home').then(() => {
        setTimeout(() => {
          try {
            const el = document.getElementById('search') as HTMLInputElement | null;
            if (el) el.focus();
          } catch (e) { }
        }, 60);
      });
    }
  }

  private mapUrlToTab(url: string): 'home' | 'search' | 'orders' | 'profile' {
    if (!url) return 'home';
    if (url.startsWith('/home/perfil') || url.startsWith('/perfil') || url.startsWith('/profile')) return 'profile';
    if (url.startsWith('/home/pedidos') || url.startsWith('/pedidos') || url.startsWith('/orders') || url.startsWith('/cart')) return 'orders';
    if (url.startsWith('/search')) return 'search';
    if (url.startsWith('/home')) return 'home';
    if (url.startsWith('/auth')) return 'home';
    return 'home';
  }

}
