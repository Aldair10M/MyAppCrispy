import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonImg, IonText } from '@ionic/angular/standalone';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage implements OnInit {
  step = 1;

  username = '';
  birthdate = '';
  address = '';
  phone = '';

  email = '';
  password = '';
  confirmPassword = '';
  codigo = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  nextStep() {
    if (!this.username || !this.birthdate || !this.address || !this.phone) {
      alert('Por favor, completa todos los campos antes de continuar.');
      return;
    }
    this.step = 2;
  }

  backStep() {
    this.step = 1;
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

    // Simula envío del código
    alert('🎉 Registro exitoso! Te hemos enviado un código de verificación.');
    this.step = 3;
  }
  
  login() {
    console.log('Correo:', this.email, 'Contraseña:', this.password);
    this.router.navigateByUrl('/login');
  }

  confirmarCodigo() {
    if (!this.codigo || this.codigo.length < 6) {
      alert('Por favor, ingresa el código de 6 dígitos.');
      return;
    }

    alert('✅ Verificación completada. ¡Bienvenido a Mr. Crispy!');
    this.router.navigateByUrl('/home');
  }
}
