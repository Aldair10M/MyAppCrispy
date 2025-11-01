import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonButton,
  IonChip,
  IonLabel,
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
  IonMenuButton,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonFooter,
  CommonModule,
  FormsModule
  ]
})
export class HomePage implements OnInit {

  searchTerm: string = '';
  categories: string[] = ['Burgers', 'Pizza', 'Sushi', 'Drinks', 'Desserts'];
  selectedCategory: string | null = null;

  menuItems: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
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
