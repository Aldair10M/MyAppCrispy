import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonFooter
} from '@ionic/angular/standalone';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router } from '@angular/router';
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
    IonButton,
    IonFooter,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PerfilPage implements OnInit {

  form: FormGroup;
  user: User | null = null;
  // track which footer tab is active so template bindings don't error
  activeTab: 'home' | 'search' | 'orders' | 'profile' = 'profile';

  constructor(private fb: FormBuilder, private router: Router) {
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

  // Footer images (use same assets as menu)
  footerImages = {
    home: 'assets/img/inicio.png',
    search: 'assets/img/buscar.png',
    orders: 'assets/img/pedido.png',
    profile: 'assets/img/perfil.png'
  };

  navigateToTab(tab: 'home' | 'search' | 'orders' | 'profile') {
    // update UI state immediately
    this.activeTab = tab;
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
        } catch (e) {}
      }, 60);
    }
  }

  ngOnInit() {
    // Try to load the current user from localStorage (matches other pages)
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw) as User;
        this.user = u;
        // patch form values (email is readonly)
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

  saveProfile() {
    if (this.form.invalid) {
      // simple visual guard; template could show errors
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    // merge with original user object if exists
    const updated: any = Object.assign({}, this.user || {}, {
      username: values.username,
      birthdate: values.birthdate,
      address: values.address,
      phone: values.phone,
      // email is readonly but included for completeness
      email: values.email,
      updatedAt: Date.now()
    });

    // If user changed password fields and they match, update password
    if (values.password && values.password === values.confirmPassword) {
      (updated as any).password = values.password;
    }

    try {
      localStorage.setItem('user', JSON.stringify(updated));
      this.user = updated;
      // simple feedback: console and keep form patched
      console.log('Perfil guardado', updated);
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  }

}
