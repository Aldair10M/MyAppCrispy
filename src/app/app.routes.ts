// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  {
    path: 'main',
    loadComponent: () => import('./features/main/main.page').then(m => m.MainPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage)
  },

  // fallback
  { path: '**', redirectTo: 'main' }
];
