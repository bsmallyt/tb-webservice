import { Routes } from '@angular/router';
import { canActivateAuth } from "./guards/auth-guard";

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.page.js').then((m) => m.HomePage),
  },
  {
    path: 'test',
    loadComponent: () => import('./components/test/test.component.js').then((m) => m.TestComponent),
    canActivate: [canActivateAuth],
    data: { role: 'admin' }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
