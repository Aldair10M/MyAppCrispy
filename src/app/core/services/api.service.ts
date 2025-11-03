import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /*
   * Método comentado: `registerUser`
   *
   * Observación: actualmente el proyecto usa `UserService.register(...)` que a su vez
   * llama a `ApiService.post('users/register', user)`. Para evitar duplicidad y
   * confusiones dejamos este helper comentado. Si prefieres usar un helper directo
   * puedes descomentar y delegar desde `UserService.register`.
   */
  // registerUser(user: User): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/users/register`, user);
  // }

  post<T = any>(path: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body, options) as unknown as Observable<T>;
  }

  get<T = any>(path: string, options?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, options) as unknown as Observable<T>;
  }

  put<T = any>(path: string, body: any, options?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body, options) as unknown as Observable<T>;
  }

  delete<T = any>(path: string, options?: any): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`, options) as unknown as Observable<T>;
  }
}
