// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  {
    path: 'main',
    loadComponent: () => import('./features/main/main.page').then(m => m.MainPage)
  },

  {
    path: 'home',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/menu/menu.page').then(m => m.MenuPage)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./features/home/pedidos/pedidos.page').then(m => m.PedidosPage)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./features/home/carrito/carrito.page').then(m => m.CarritoPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/home/perfil/perfil.page').then(m => m.PerfilPage)
      },
      {
        path: 'producto',
        loadComponent: () => import('./features/home/producto/producto.page').then(m => m.ProductoPage)
      },
      // removed duplicate/obsolete 'compras' route — use '/home/carrito' instead
    ]
  },

  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.page').then(m => m.RegisterPage)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password/reset-password.page').then(m => m.ResetPasswordPage)
      },
      {
        path: 'verify',
        loadComponent: () => import('./features/auth/verify/verify.page').then(m => m.VerifyPage)
      }
    ]
  },

  { path: '**', redirectTo: 'main' },
  
];
