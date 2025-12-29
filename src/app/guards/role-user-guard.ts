import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

export const roleUserGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

   if(auth.getRole() =="USER"){
    return true
  }else{
    return router.navigate(['/admin']);
  }
};
