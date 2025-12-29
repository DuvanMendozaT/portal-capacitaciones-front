import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

   constructor(private router: Router, private auth:Auth) {
    this.auth.logout();
   }

  //rutas a componentes de Auth
  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToUserLogin() {
    this.router.navigate(['/login/user']);
  }

  goToAdminLogin() {
    this.router.navigate(['/login/admin']);
  }
}
