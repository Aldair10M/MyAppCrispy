import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-chef',
  templateUrl: './registerChef.page.html',
  styleUrls: ['./registerChef.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule, FormsModule]
})
export class RegisterChefPage {
  searchEmail: string = '';
  foundUser: any = null;
  loading = false;
  notFound = false;
  converting = false;

  constructor(private api: ApiService, private router: Router) {}

  search() {
    this.foundUser = null;
    this.notFound = false;
    if (!this.searchEmail) return;
    this.loading = true;
    this.api.get(`users/debug?email=${encodeURIComponent(this.searchEmail)}`).subscribe({
      next: (res: any) => {
        this.foundUser = res;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        if (err?.status === 404) this.notFound = true;
        else alert('Error buscando usuario');
      }
    });
  }

  convertToChef() {
    if (!this.foundUser || !this.foundUser.email) return;
    if (this.foundUser.role === 2) return;
    this.converting = true;
    this.api.put('users/update', { email: this.foundUser.email, role: 2 }).subscribe({
      next: (res: any) => {
        this.converting = false;
        this.foundUser = res.user || { ...this.foundUser, role: 2 };
        alert('Usuario convertido a Chef correctamente');
      },
      error: (err: any) => {
        this.converting = false;
        console.error('convert error', err);
        alert('Error al convertir usuario');
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/admin/panel');
  }
}
