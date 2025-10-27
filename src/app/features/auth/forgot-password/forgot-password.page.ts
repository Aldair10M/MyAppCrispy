import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonImg, IonText } from '@ionic/angular/standalone';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonImg, IonText, CommonModule, FormsModule],
  animations: [
    trigger('stepAnimation', [
      state('1', style({ opacity: 1, transform: 'translateX(0)' })),
      state('2', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('1 => 2', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('250ms ease-out')
      ]),
      transition('2 => 1', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('250ms ease-out')
      ]),
    ])
  ]
})
export class ForgotPasswordPage implements OnInit {
  step: 1 | 2 = 1;
  email = '';
  codigo = '';

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {}

  private disableInteractivity() {
    const focusedElement = this.elementRef.nativeElement.querySelector(':focus');
    if (focusedElement) focusedElement.blur();

    const interactiveElements = this.elementRef.nativeElement.querySelectorAll(
      'ion-button, ion-input, button, input'
    );
    interactiveElements.forEach((el: HTMLElement) => el.setAttribute('tabindex', '-1'));
  }

  private enableInteractivity() {
    const interactiveElements = this.elementRef.nativeElement.querySelectorAll(
      'ion-button, ion-input, button, input'
    );
    interactiveElements.forEach((el: HTMLElement) => el.removeAttribute('tabindex'));
  }

  async enviarCorreo() {
    if (!this.email) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }

    this.disableInteractivity();
    alert('📩 Se ha enviado un código de verificación a tu correo.');

    // Cambio de step con retraso para animación
    this.step = 2;
    setTimeout(() => this.enableInteractivity(), 250); // Espera que la animación termine
  }

  async confirmarCodigoReset() {
    if (!this.codigo || this.codigo.length < 6) {
      alert('Por favor, ingresa el código de 6 dígitos.');
      return;
    }

    this.disableInteractivity();
    alert('✅ Código verificado. Ahora puedes restablecer tu contraseña.');
    await this.router.navigateByUrl('/auth/reset-password');
  }

  backStep() {
    this.disableInteractivity();
    this.step = 1;
    setTimeout(() => this.enableInteractivity(), 250);
  }
}
