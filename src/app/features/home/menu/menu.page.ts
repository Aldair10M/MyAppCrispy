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
  IonFooter
} from '@ionic/angular/standalone';

import { ProductService } from '../../../core/services/product.service';
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
    IonFooter,
    CommonModule,
    FormsModule
  ]
})
export class MenuPage implements OnInit {

  userName: string | null = null;

  searchTerm: string = '';
  // Categories now include image paths located in assets/img
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
  // allow undefined so templates can use the nullish coalescing operator (??)
  // e.g. quantities[id] ?? 1 — 0 must remain a valid value
  quantities: Record<string, number | undefined> = {};
  // simple cart stored in localStorage
  cartItems: Array<{ id: string; name: string; qty: number; price?: number }> = [];
  cartCount: number = 0;

  activeTab: 'home' | 'search' | 'orders' | 'profile' = 'home';

  constructor(private productService: ProductService, private router: Router) { }

  private _onCartChanged = () => {
    // reload cart from storage when someone notifies about a change
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        this.cartItems = JSON.parse(raw);
        this.cartCount = this.cartItems.reduce((s, it) => s + (it.qty || 0), 0);
      } else {
        this.cartItems = [];
        this.cartCount = 0;
      }
    } catch (e) {
      this.cartItems = [];
      this.cartCount = 0;
    }
  };

  ngOnInit() {
    // Track navigation to update the active footer tab based on current route
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

    // load cart from localStorage
    try {
      const c = localStorage.getItem('cart');
      if (c) {
        this.cartItems = JSON.parse(c);
        this.cartCount = this.cartItems.reduce((s, it) => s + (it.qty || 0), 0);
      }
    } catch (e) {
      this.cartItems = [];
      this.cartCount = 0;
    }

    // Listen to cart changes so this menu shows correct count when cart is modified elsewhere
    try {
      window.addEventListener('cart:changed', this._onCartChanged as EventListener);
    } catch (e) {
      // ignore (e.g., server-side rendering)
    }
  }

  ngOnDestroy() {
    try {
      window.removeEventListener('cart:changed', this._onCartChanged as EventListener);
    } catch (e) {
      // ignore
    }
  }

  mapUrlToTab(url: string): 'home' | 'search' | 'orders' | 'profile' {
    if (!url) return 'home';
    if (url.startsWith('/home')) return 'home';
    if (url.startsWith('/auth')) return 'home';
    if (url.startsWith('/home/perfil') || url.startsWith('/perfil') || url.startsWith('/profile')) return 'profile';
    if (url.startsWith('/home/pedidos') || url.startsWith('/pedidos') || url.startsWith('/orders') || url.startsWith('/cart')) return 'orders';
    if (url.startsWith('/search')) return 'search';
    return 'home';
  }

  navigateToTab(tab: 'home' | 'search' | 'orders' | 'profile') {
    this.activeTab = tab;
    // navigate when a real route exists, otherwise just set the tab visually
    if (tab === 'home') this.router.navigateByUrl('/home');
    else if (tab === 'profile') this.router.navigateByUrl('/home/perfil');
    else if (tab === 'orders') this.router.navigateByUrl('/home/pedidos');
    else if (tab === 'search') this.router.navigateByUrl('/home');
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
      // deselect
      this.selectedItemId = null;
    } else {
      this.selectedItemId = id;
      // initialize quantity
  // Reset quantity to 1 whenever the item is (re)selected
  this.quantities[id] = 1;
      // Bring the selected item into view (do not reorder the array).
      // Wait a tick so the expanded class/layout is applied.
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
    // create a safe id: encodeURIComponent and prefix
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
      // if quantity reached 0 and this item is selected, deselect it
      if (this.quantities[id] === 0 && this.selectedItemId === id) {
        this.selectedItemId = null;
      }
    }
  }

  buy(item: Product) {
    const id = item.id || item.name;
    const qty = this.quantities[id] || 1;
    // Add the selected quantity to cart and navigate to the compras page
    this.addToCart(item);
    // Optionally deselect after adding
    this.selectedItemId = null;
    // persist selection in sessionStorage so ProductoPage can read it even if navigation state is lost
    try {
      sessionStorage.setItem('selectedProduct', JSON.stringify({ item, qty }));
    } catch (e) {
      console.warn('Could not write selectedProduct to sessionStorage', e);
    }
    // Navigate to the producto page under /home and pass the item + qty in navigation state
    // the ProductoPage can read history.state or sessionStorage to get this data
    this.router.navigate(['/home/producto'], { state: { item, qty } });
  }

  addToCart(item: Product) {
    const id = item.id || item.name;
    const qty = this.quantities[id] || 1;
    const existing = this.cartItems.find(c => c.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.cartItems.push({ id, name: item.name, qty, price: item.price });
    }
    this.cartCount = this.cartItems.reduce((s, it) => s + (it.qty || 0), 0);
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch (e) {
      console.warn('Could not persist cart', e);
    }
  }

  goToCompras() {
    // navigate to the compras child route under home
    this.router.navigateByUrl('/home/carrito');
  }

  get filteredItems(): Product[] {
    const term = (this.searchTerm || '').toString().trim().toLowerCase();
    return this.menuItems.filter(item => {
      // Only show available products
      if (item.available === false) return false;

      // Category filter
      if (this.selectedCategory && item.category !== this.selectedCategory) return false;

      // Search term filter (name or description)
      if (!term) return true;
      const name = (item.name || '').toString().toLowerCase();
      const desc = (item.description || '').toString().toLowerCase();
      return name.includes(term) || desc.includes(term);
    });
  }

}
