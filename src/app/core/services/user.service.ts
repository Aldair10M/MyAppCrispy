import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) { }

  register(user: User): Observable<any> {
    return this.api.post('users/register', user);
  }

  verifyEmail(email: string, code: string): Observable<any> {
    // Ajustado para coincidir con la ruta del backend (/api/users/verify)
    return this.api.post('users/verify', { email, code });
  }

  resendVerificationCode(email: string): Observable<any> {
    // Backend no implementa aun un endpoint para reenviar; mantener ruta coherente si se añade
    return this.api.post('users/resend-code', { email });
  }
}
