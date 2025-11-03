import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PerfilPage implements OnInit {

  form: FormGroup;
  user: User | null = null;

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: [''],
      address: [''],
      phone: [''],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
    });
  }

  footerImages = {
    home: 'assets/img/inicio.png',
    search: 'assets/img/buscar.png',
    orders: 'assets/img/pedido.png',
    profile: 'assets/img/perfil.png'
  };

  navigateToTab(tab: 'home' | 'search' | 'orders' | 'profile') {
    if (tab === 'home') {
      this.router.navigateByUrl('/home');
    } else if (tab === 'profile') {
      this.router.navigateByUrl('/home/perfil');
    } else if (tab === 'orders') {
      this.router.navigateByUrl('/home/pedidos');
    } else if (tab === 'search') {
      this.router.navigateByUrl('/home');
      setTimeout(() => {
        try {
          const el = document.getElementById('search') as HTMLInputElement | null;
          if (el) el.focus();
        } catch (e) { }
      }, 60);
    }
  }

  ngOnInit() {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw) as User;
        this.user = u;
        this.form.patchValue({
          username: u.username || '',
          birthdate: u.birthdate || '',
          address: u.address || '',
          phone: u.phone || '',
          email: u.email || ''
        });
      }
    } catch (e) {
      console.warn('Could not read user from localStorage', e);
    }
  }

  goHome() {
    try {
      this.router.navigateByUrl('/home');
    } catch (e) {
      console.warn('Error navigating to /home', e);
    }
  }

  saveProfile() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const updated: any = Object.assign({}, this.user || {}, {
      username: values.username,
      birthdate: values.birthdate,
      address: values.address,
      phone: values.phone,
      email: values.email,
      updatedAt: Date.now()
    });

    if (values.password && values.password === values.confirmPassword) {
      (updated as any).password = values.password;
    }

    try {
      localStorage.setItem('user', JSON.stringify(updated));
      this.user = updated;
      console.log('Perfil guardado (local)', updated);

      this.api.put('users/update', updated).subscribe({
        next: (res: any) => {
          console.log('Perfil actualizado en servidor', res);
          if (res && res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
            this.user = res.user;
            this.form.patchValue({
              username: res.user.username || '',
              birthdate: res.user.birthdate || '',
              address: res.user.address || '',
              phone: res.user.phone || '',
              email: res.user.email || ''
            });
          }
        },
        error: (err: any) => {
          console.error('Error actualizando perfil en servidor', err);
        }
      });
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  }

}
