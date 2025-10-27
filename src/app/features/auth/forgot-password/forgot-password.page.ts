import { Component, OnInit, ElementRef } from '@angular/core';
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
        style({ 
          opacity: 0, 
          transform: 'translateX(20px)',
          willChange: 'transform, opacity'
        }),
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateX(0)'
          })
        )
      ]),
      transition(':leave', [
        style({ willChange: 'transform, opacity' }),
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ 
            opacity: 0, 
            transform: 'translateX(-20px)'
          })
        )
      ])
    ])
  ]
})
export class ForgotPasswordPage implements OnInit {
  step = 1;
  email = '';
  codigo = '';

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {}

  ionViewDidLeave() {
    // Remover el foco y deshabilitar la interactividad cuando la página se oculta
    this.disableInteractivity();
  }

  ionViewWillEnter() {
    // Restaurar la interactividad cuando la página se muestra
    this.enableInteractivity();
  }

  private disableInteractivity() {
    // Remover el foco de cualquier elemento
    const focusedElement = this.elementRef.nativeElement.querySelector(':focus');
    if (focusedElement) {
      focusedElement.blur();
    }

    // Hacer que todos los elementos interactivos no sean focusables
    const interactiveElements = this.elementRef.nativeElement.querySelectorAll(
      'ion-button, ion-input, button, input'
    );
    interactiveElements.forEach((element: HTMLElement) => {
      element.setAttribute('tabindex', '-1');
    });
  }

  private enableInteractivity() {
    // Restaurar la capacidad de foco de los elementos interactivos
    const interactiveElements = this.elementRef.nativeElement.querySelectorAll(
      'ion-button, ion-input, button, input'
    );
    interactiveElements.forEach((element: HTMLElement) => {
      element.removeAttribute('tabindex');
    });
  }

  async enviarCorreo() {
    if (!this.email) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }
    this.disableInteractivity();
    alert('📩 Se ha enviado un código de verificación a tu correo.');
    this.step = 2;
    await new Promise(resolve => setTimeout(resolve, 0));
    this.enableInteractivity();
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
    setTimeout(() => this.enableInteractivity(), 0);
  }
}
