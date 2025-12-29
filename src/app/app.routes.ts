import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { authenticatedGuard } from './guards/authenticated-guard';
import { roleAdminGuard } from './guards/role-admin-guard';
import { roleUserGuard } from './guards/role-user-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
    canActivate: [authenticatedGuard]
  },

  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then((m) => m.Register),
    canActivate: [authenticatedGuard],
  },

  {
    path: 'login',
    children: [
      {
        path: 'user',
        loadComponent: () => import('./components/auth/login-user/login-user').then((m) => m.LoginUser),
        canActivate: [authenticatedGuard],
      },
      {
        path: 'admin',
        loadComponent: () =>
          import(`./components/auth/login-admin/login-admin`).then((m) => m.LoginAdmin),
        canActivate: [authenticatedGuard],
      },
    ],
    canActivate: [authenticatedGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/user-dashboard/user-dashboard').then((m) => m.UserDashboard),
    //canActivate: [AuthGuard, roleUserGuard],
  },

  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
    //canActivate: [AuthGuard, roleAdminGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard, roleUserGuard],
  },

  {
    path: 'certificate/:courseId',
    loadComponent: () => import('./components/certificate/certificate').then((m) => m.Certificate),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'home' },
];
