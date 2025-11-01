import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonChip,
  IonLabel,
  IonFooter
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
  IonContent,
  IonHeader,
  IonToolbar,
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

  menuItems: Array<{ name: string; image: string; category?: string }> = [
    { name: 'Classic Burger', image: '/assets/img/burger.jpg', category: 'Burgers' },
    { name: 'Margherita Pizza', image: '/assets/img/pizza.jpg', category: 'Pizza' },
    { name: 'California Roll', image: '/assets/img/sushi.jpg', category: 'Sushi' },
    { name: 'Coke', image: '/assets/img/drinks.jpg', category: 'Drinks' }
  ];

  constructor() { }

  ngOnInit() {}

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
  }

}
