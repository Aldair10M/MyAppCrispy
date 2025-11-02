import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonAvatar
} from '@ionic/angular/standalone';
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
    IonList,
    IonAvatar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PerfilPage implements OnInit {

  form: FormGroup;
  user: User | null = null;

  constructor(private fb: FormBuilder) {
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
