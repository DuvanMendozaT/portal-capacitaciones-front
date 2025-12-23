import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
import { inject } from '@angular/core';

export const authenticatedGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);
  
  
  if(auth.isLoggedIn()){
    return router.navigate(['/dashboard']);
  }else{
    return true;
  }
};
