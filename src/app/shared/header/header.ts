import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  constructor(private router: Router, private auth: Auth) {}
  profile = computed(() => this.auth.getProfile());
  isLoggedIn = computed(() => !!this.profile().id);
  isAdmin = computed(() => this.profile().role === 'ADMIN');
  isUser = computed(() => this.profile().role === 'USER');

  goDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  goAdmin(): void {
    this.router.navigateByUrl('/admin');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/home');
  }
}
