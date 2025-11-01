import { Component, OnInit } from '@angular/core';
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

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
export class HomePage implements OnInit {

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

  constructor(private productService: ProductService) { }

  ngOnInit() {
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
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (items) => {
        this.menuItems = items as Product[];
      },
      error: (err) => {
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
