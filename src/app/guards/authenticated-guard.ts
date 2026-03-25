import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
import { inject } from '@angular/core';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return true;
  }

  const role = auth.getRole();

  if (role === 'ADMIN') {
    return router.createUrlTree(['/admin']);
  }

  if (role === 'USER') {
    return router.createUrlTree(['/dashboard']);
  }

  return router.createUrlTree(['/home']);
};
