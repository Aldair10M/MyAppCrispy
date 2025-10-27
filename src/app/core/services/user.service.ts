import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  register(user: User): Observable<any> {
    return this.api.post('users/register', user);
  }

  // Aquí puedes agregar login, recuperar contraseña, etc.
}
