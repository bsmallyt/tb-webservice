import { Routes } from '@angular/router';
import { canActivateAuth } from "./guards/auth-guard";

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.page').then((m) => m.HomePage),
    canActivate: [canActivateAuth],
    data: { role: 'admin' }
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
