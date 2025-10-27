import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonImg, IonText } from '@ionic/angular/standalone';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonImg, IonText, CommonModule, FormsModule],
  animations: [
    trigger('stepAnimation', [
      state('1', style({ opacity: 1, transform: 'translateX(0)' })),
      state('2', style({ opacity: 1, transform: 'translateX(0)' })),
      state('3', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('1 => 2', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('250ms ease-out')
      ]),
      transition('2 => 1', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('250ms ease-out')
      ]),
      transition('2 => 3', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('250ms ease-out')
      ]),
      transition('3 => 2', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('250ms ease-out')
      ]),
    ])
  ]
})
export class RegisterPage implements OnInit {
  step: 1 | 2 | 3 = 1;

  username = '';
  birthdate = '';
  address = '';
  phone = '';

  email = '';
  password = '';
  confirmPassword = '';
  codigo = '';

  constructor(private router: Router, private elementRef: ElementRef) { }

  ngOnInit() { }

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

  nextStep() {
    if (!this.username || !this.birthdate || !this.address || !this.phone) {
      alert('Por favor, completa todos los campos antes de continuar.');
      return;
    }

    this.disableInteractivity();
    this.step = 2;
    setTimeout(() => this.enableInteractivity(), 250);
  }

  backStep() {
    this.disableInteractivity();
    if (this.step === 2) this.step = 1;
    else if (this.step === 3) this.step = 2;
    setTimeout(() => this.enableInteractivity(), 250);
  }

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      alert('Completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.disableInteractivity();
    alert('🎉 Registro exitoso! Te hemos enviado un código de verificación.');
    this.step = 3;
    setTimeout(() => this.enableInteractivity(), 250);
  }

  login() {
    this.router.navigateByUrl('/auth/login');
  }

  confirmarCodigo() {
    alert('✅ Verificación completada. ¡Bienvenido a Mr. Crispy!');
    this.router.navigateByUrl('/home');
  }
}
