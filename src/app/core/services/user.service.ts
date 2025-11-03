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

  login(email: string, password: string): Observable<any> {
    return this.api.post('users/login', { email, password });
  }

  verifyEmail(email: string, code: string): Observable<any> {
    return this.api.post('users/verify', { email, code });
  }

  resendVerificationCode(email: string): Observable<any> {
    return this.api.post('users/resend-code', { email });
  }
}
