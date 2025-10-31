import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonImg, IonText } from '@ionic/angular/standalone';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

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
      transition('1 => 2', [style({ opacity: 0, transform: 'translateX(20px)' }), animate('250ms ease-out')]),
      transition('2 => 1', [style({ opacity: 0, transform: 'translateX(-20px)' }), animate('250ms ease-out')]),
      transition('2 => 3', [style({ opacity: 0, transform: 'translateX(20px)' }), animate('250ms ease-out')]),
      transition('3 => 2', [style({ opacity: 0, transform: 'translateX(-20px)' }), animate('250ms ease-out')]),
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

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private userService: UserService
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
    const requiredFields = {
      username: this.username,
      birthdate: this.birthdate,
      address: this.address,
      phone: this.phone,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      alert(`Por favor completa los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    if (this.password.trim() !== this.confirmPassword.trim()) {
      alert('Las contraseñas no coinciden. Por favor, verifica que sean exactamente iguales.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Por favor ingresa un email válido.');
      return;
    }

    const newUser: User = new User(
      this.username.trim(),
      this.birthdate,
      this.address.trim(),
      this.phone.trim(),
      this.email.trim(),
      this.password.trim(),
      this.confirmPassword.trim(),
      '',
      false,
      undefined
    );

    console.log('Enviando datos de registro:', { ...newUser, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });

    this.disableInteractivity();

    this.userService.register(newUser).subscribe({
      next: (res) => {
        console.log('Respuesta exitosa:', res);
        alert('🎉 Registro exitoso. Te hemos enviado un código de verificación a tu correo.');
        // 👉 Redirigir con el email como parámetro
        this.router.navigate(['/auth/verify'], { queryParams: { email: this.email } });
      },
      error: (err) => {
        console.error('Error en registro:', err);
        const msg = err.error?.error || err.message || 'Error al registrar usuario.';
        alert(`❌ ${msg}`);
        this.enableInteractivity();
      }
    });
  }

  login() {
    this.router.navigateByUrl('/auth/login');
  }
}
