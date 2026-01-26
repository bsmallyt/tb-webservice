import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
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
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
