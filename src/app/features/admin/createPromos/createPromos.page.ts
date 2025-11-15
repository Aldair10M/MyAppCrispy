import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
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
  promo = { title: '', description: '', discount: 0 };
  products: Product[] = [];
  selected: Record<string, boolean> = {};

  constructor(private productService: ProductService, private router: Router) {}

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
  }

  save() {
    const selectedIds = this.products.filter(p => this.selected[p.id || p.name]).map(p => p.id || p.name);
    console.log('Crear promoción', this.promo, 'products:', selectedIds);
    // TODO: call backend to create promo with products
  }

  viewProduct(p: Product) {
    try {
      this.router.navigate(['/home/producto'], { state: { item: p, qty: 1 } });
    } catch (e) {
      console.warn('Could not navigate to product', e);
    }
  }
}
