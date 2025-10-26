import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonButton, IonItem,
  IonText, IonImg
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonInput, IonButton, IonItem,
    IonText, IonImg
  ]
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private router: Router) { }

  login() {
    console.log('Correo:', this.email, 'Contraseña:', this.password);
    this.router.navigateByUrl('/home');
  }

  goToRegister() {
    console.log('Ir a registro');
    this.router.navigateByUrl('/register');
  }

  goToRecover() {
    console.log('Ir a recuperación');
    this.router.navigateByUrl('/forgot-password');
  }
}
