import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { authenticatedGuard } from './guards/authenticated-guard';
import { roleAdminGuard } from './guards/role-admin-guard';
import { roleUserGuard } from './guards/role-user-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [authenticatedGuard]
  },

  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then((m) => m.Register),
    canActivate: [authenticatedGuard],
  },

  {
    path: 'login',
    children: [
      {
        path: 'user',
        loadComponent: () => import('./pages/auth/login-user/login-user').then((m) => m.LoginUser),
        canActivate: [authenticatedGuard],
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/auth/login-admin/login-admin').then((m) => m.LoginAdmin),
        canActivate: [authenticatedGuard],
      },
    ],
    canActivate: [authenticatedGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/course-admin/course-admin').then((m) => m.CourseAdmin),
    canActivate: [AuthGuard, roleAdminGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard, roleUserGuard],
  },

  {
    path: 'certificate/:courseId',
    loadComponent: () => import('./pages/certificate/certificate').then((m) => m.Certificate),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'home' },
];
