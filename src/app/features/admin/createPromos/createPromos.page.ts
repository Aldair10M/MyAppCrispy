import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-promos',
  templateUrl: './createPromos.page.html',
  styleUrls: ['./createPromos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonTextarea, CommonModule, FormsModule]
})
export class CreatePromosPage {
  promo = { title: '', description: '', discount: 0 };
  save() { console.log('Crear promoción', this.promo); }
}
