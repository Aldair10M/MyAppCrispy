import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonImg, IonText } from '@ionic/angular/standalone';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonImg, IonText, CommonModule, FormsModule],
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-40px)' }))
      ])
    ])
  ]
})
export class ForgotPasswordPage implements OnInit {

  step = 1;
  email = '';
  codigo = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  enviarCorreo() {
    if (!this.email) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }
    alert('📩 Se ha enviado un código de verificación a tu correo.');
    this.step = 2;
  }

  confirmarCodigoReset() {
    if (!this.codigo || this.codigo.length < 6) {
      alert('Por favor, ingresa el código de 6 dígitos.');
      return;
    }
    alert('✅ Código verificado. Ahora puedes restablecer tu contraseña.');
    this.router.navigateByUrl('/reset-password');
  }

  backStep() {
    this.step = 1;
  }
}
