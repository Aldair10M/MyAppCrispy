import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonToolbar,
  IonMenu,
  IonMenuButton,
  IonButton,
  IonTitle,
  IonList,
  IonItem,

} from '@ionic/angular/standalone';
import { FooterComponent } from '../../../shared/footer/footer.component';

import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Product } from '../../../core/models/product.model';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonMenu,
    IonMenuButton,
    IonIcon,
    IonButton,
    IonTitle,
    IonList,
    IonItem,
    FooterComponent,
    CommonModule,
    FormsModule
  ]
})
export class MenuPage implements OnInit, OnDestroy {

  userName: string | null = null;

  searchTerm: string = '';
  categories: Array<{ name: string; image: string }> = [
    { name: 'Pollo Crispy', image: 'assets/img/pollo-crispy.png' },
    { name: 'Alitas', image: 'assets/img/alitas.png' },
    { name: 'Salchipapa', image: 'assets/img/salchipapa.png' },
    { name: 'Burgers', image: 'assets/img/burgers.png' },
    { name: 'Wraps', image: 'assets/img/wraps.png' },
    { name: 'Bebidas', image: 'assets/img/bebidas.png' }
  ];
  selectedCategory: string | null = null;

  menuItems: Product[] = [];
  selectedItemId: string | null = null;
  quantities: Record<string, number | undefined> = {};
  cartItems: Array<{ id: string; name: string; qty: number; price?: number }> = [];
  cartCount: number = 0;
  private _cartSub: any;

  activeTab: 'home' | 'search' | 'orders' | 'profile' = 'home';

  footerImages = {
    home: 'assets/img/inicio.png',
    search: 'assets/img/buscar.png',
    orders: 'assets/img/pedido.png',
    profile: 'assets/img/perfil.png'
  };

  constructor(private productService: ProductService, private router: Router, private cartService: CartService) { }


  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url: string = e.urlAfterRedirects || e.url || '';
      this.activeTab = this.mapUrlToTab(url);
    });
    this.loadProducts();
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        this.userName = u?.username || u?.name || null;
      }
    } catch (e) {
      this.userName = null;
    }

    this._cartSub = this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart || [];
      this.cartCount = this.cartItems.reduce((s, it) => s + (it.qty || 0), 0);
    });
  }

  ngOnDestroy() {
    try {
      this._cartSub?.unsubscribe?.();
    } catch (e) {
    }
  }

  mapUrlToTab(url: string): 'home' | 'search' | 'orders' | 'profile' {
    if (!url) return 'home';
    if (url.startsWith('/home/perfil') || url.startsWith('/perfil') || url.startsWith('/profile')) return 'profile';
    if (url.startsWith('/home/pedidos') || url.startsWith('/pedidos') || url.startsWith('/orders') || url.startsWith('/cart')) return 'orders';
    if (url.startsWith('/search')) return 'search';
    if (url.startsWith('/home')) return 'home';
    if (url.startsWith('/auth')) return 'home';
    return 'home';
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
        setTimeout(() => this.focusSearchInput(), 60);
      });
    }
  }

  private focusSearchInput() {
    try {
      const el = document.getElementById('search') as HTMLInputElement | null;
      if (el) {
        el.focus();
        try { el.select(); } catch (e) { }
      }
    } catch (e) {
    }
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (items: Product[]) => {
        this.menuItems = items as Product[];
      },
      error: (err: any) => {
        console.error('Error loading products', err);
      }
    });
  }

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
  }

  selectItem(item: Product) {
    const id = item.id || item.name;
    if (this.selectedItemId === id) {
      this.selectedItemId = null;
    } else {
      this.selectedItemId = id;
      this.quantities[id] = 1;
      setTimeout(() => {
        try {
          const el = document.getElementById(this.getCardId(item));
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          }
        } catch (e) {
          console.warn('Could not scroll to selected item', e);
        }
      }, 60);
    }
  }

  getCardId(item: Product) {
    const raw = (item.id || item.name || '').toString();
    return 'menu-card-' + encodeURIComponent(raw.replace(/\s+/g, '-'));
  }

  increment(item: Product) {
    const id = item.id || item.name;
    this.quantities[id] = (this.quantities[id] ?? 0) + 1;
  }

  decrement(item: Product) {
    const id = item.id || item.name;
    const current = this.quantities[id] ?? 0;
    if (current > 0) {
      this.quantities[id] = current - 1;
      if (this.quantities[id] === 0 && this.selectedItemId === id) {
        this.selectedItemId = null;
      }
    }
  }

  buy(item: Product) {
    const id = item.id || item.name;
    const qty = this.quantities[id] || 1;
    this.addToCart(item);
    this.selectedItemId = null;
    try {
      sessionStorage.setItem('selectedProduct', JSON.stringify({ item, qty }));
    } catch (e) {
      console.warn('Could not write selectedProduct to sessionStorage', e);
    }
    this.router.navigate(['/home/producto'], { state: { item, qty } });
  }

  addToCart(item: Product) {
    const qty = this.quantities[item.id || item.name] || 1;
    try {
      this.cartService.addItem(item, qty);
    } catch (e) {
      console.warn('Could not add item to cart', e);
    }
  }

  goToCompras() {
    this.router.navigateByUrl('/home/carrito');
  }

  get filteredItems(): Product[] {
    const term = (this.searchTerm || '').toString().trim().toLowerCase();
    return this.menuItems.filter(item => {
      if (item.available === false) return false;

      if (this.selectedCategory && item.category !== this.selectedCategory) return false;

      if (!term) return true;
      const name = (item.name || '').toString().toLowerCase();
      const desc = (item.description || '').toString().toLowerCase();
      return name.includes(term) || desc.includes(term);
    });
  }

}
