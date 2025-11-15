import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.page.html',
  styleUrls: ['./chef.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule]
})
export class ChefPage {
  title = 'Zona Chef';
}
