import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonImg, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonImg, IonText, CommonModule, FormsModule]
})
export class ResetPasswordPage implements OnInit {

  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  resetPassword() {
    if (!this.password || !this.confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    alert('✅ Contraseña restablecida correctamente.');
    this.router.navigateByUrl('/login');
  }
}
