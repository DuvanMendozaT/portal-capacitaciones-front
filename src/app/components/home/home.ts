import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {}

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
