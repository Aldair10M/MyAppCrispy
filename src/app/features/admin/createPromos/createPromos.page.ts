import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../core/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-promos',
  templateUrl: './createPromos.page.html',
  styleUrls: ['./createPromos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonTextarea, CommonModule, FormsModule]
})
export class CreatePromosPage implements OnInit {
  promo: { title: string; description: string; discount: number | null } = { title: '', description: '', discount: null };
  products: Product[] = [];
  selected: Record<string, boolean> = {};

  // preview totals
  subtotal = 0;
  precioTotal: number | null = null;
  priceTotalDescuento: number | null = null;

  saving = false;

  constructor(private productService: ProductService, private router: Router, private api: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (items: Product[]) => this.products = items || [],
      error: (err: any) => console.error('Error loading products for promos', err)
    });
  }

  toggleSelect(p: Product) {
    const id = p.id || p.name;
    this.selected[id] = !this.selected[id];
    this.computeTotals();
  }

  computeTotals() {
    const selectedIds = this.products.filter(p => this.selected[p.id || p.name]).map(p => p.id || p.name);
    const selectedProducts = this.products.filter(p => selectedIds.includes(p.id || p.name));
    const subtotal = selectedProducts.reduce((s, it) => s + (it.price || 0), 0);
    this.subtotal = subtotal;
    const discount = typeof this.promo.discount === 'number' ? this.promo.discount : null;
    this.priceTotalDescuento = discount !== null ? Number((subtotal - (subtotal * discount) / 100).toFixed(2)) : null;
    this.precioTotal = this.priceTotalDescuento;
  }

  save() {
    const selectedIds = this.products.filter(p => this.selected[p.id || p.name]).map(p => p.id || p.name);
    const payload = { title: this.promo.title, description: this.promo.description, discount: this.promo.discount, products: selectedIds };
    this.saving = true;
    this.api.post('promos', payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        alert('Promoción creada correctamente');
        // Reset form
        this.promo = { title: '', description: '', discount: null };
        this.selected = {};
        this.subtotal = 0;
        this.precioTotal = null;
        this.priceTotalDescuento = null;
      },
      error: (err: any) => {
        this.saving = false;
        console.error('Error creating promo', err);
        alert('Error al crear la promoción');
      }
    });
  }

  viewProduct(p: Product) {
    try {
      this.router.navigate(['/home/producto'], { state: { item: p, qty: 1 } });
    } catch (e) {
      console.warn('Could not navigate to product', e);
    }
  }
}
