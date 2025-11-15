import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-chef',
  templateUrl: './registerChef.page.html',
  styleUrls: ['./registerChef.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, CommonModule, FormsModule]
})
export class RegisterChefPage {
  chef = { name: '', email: '' };
  submit() {
    console.log('Registrar chef', this.chef);
  }
}
