import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonButton, IonItem,
  IonText, IonImg
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

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

  constructor(private router: Router, private userService: UserService) { }

  login() {
    console.log('Intento de login:', this.email);
    if (!this.email || !this.password) {
      alert('Por favor completa email y contraseña');
      return;
    }

    this.userService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        // Puedes guardar el usuario/token en localStorage si lo deseas
        try {
          if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
        } catch (e) { /* ignore storage errors */ }
        // Remove focus from any focused element before hiding this page to avoid
        // accessibility issues where a hidden ancestor still retains focus.
        try {
          const active = document.activeElement as HTMLElement | null;
          if (active && typeof active.blur === 'function') {
            active.blur();
          }
        } catch (e) {
          // ignore cross-origin or SSR issues
        }

        // Small delay to ensure blur takes effect before navigation
        setTimeout(() => this.router.navigateByUrl('/home'), 50);
      },
      error: (err) => {
        console.error('Login error', err);
        const msg = err?.error?.error || err?.error?.message || 'Error al iniciar sesión';
        alert(msg);
      }
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/auth/register');
  }

  goToRecover() {
    this.router.navigateByUrl('/auth/forgot-password');
  }
}
