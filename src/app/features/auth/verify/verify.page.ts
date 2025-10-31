import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonText } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonItem, IonInput, IonButton, IonText]
})
export class VerifyPage {
  email = '';
  verificationCode = '';
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // ✅ Obtiene el email del registro si fue pasado por queryParams
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  verifyCode() {
    if (!this.email || !this.verificationCode) {
      alert('Por favor, ingresa tu correo y el código de verificación.');
      return;
    }

    this.isLoading = true;

    this.userService.verifyEmail(this.email, this.verificationCode).subscribe({
      next: () => {
        alert('✅ Tu correo ha sido verificado exitosamente. ¡Bienvenido a Mr. Crispy!');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error('Error en la verificación:', err);
        alert(`❌ ${err.error?.error || 'El código es inválido o ha expirado.'}`);
        this.isLoading = false;
      }
    });
  }

  resendCode() {
    if (!this.email) {
      alert('Ingresa tu correo para reenviar el código.');
      return;
    }

    this.isLoading = true;
    this.userService.resendVerificationCode(this.email).subscribe({
      next: () => {
        alert('📨 Se ha reenviado un nuevo código de verificación a tu correo.');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al reenviar el código:', err);
        alert(`❌ No se pudo reenviar el código. ${err.error?.error || ''}`);
        this.isLoading = false;
      }
    });
  }

  // Navegar al login desde la plantilla sin exponer el router como propiedad pública
  goToLogin() {
    this.router.navigateByUrl('/auth/login');
  }

}
