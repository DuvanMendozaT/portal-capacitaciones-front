import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-admin.html',
  styleUrl: './login-admin.css',
})
export class LoginAdmin {
  form!: FormGroup;
  submitted = false;
  errorMsg = signal('');

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  login() {
    this.submitted = true;

    if (this.form.valid) {
      this.auth
        .login({
          email: this.form.value.email,
          password: this.form.value.password,
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/admin']);
            this.form.reset();
          },
          error: (error) => {
            switch (error.status) {
              case 400:
                this.errorMsg.set('Solicitud inválida. Verifica los datos ingresados.');
                break;

              case 404:
                this.errorMsg.set('Usuario no encontrado.');
                break;

              default:
                this.errorMsg.set('Login fallido. Intenta nuevamente.');
                break;
            }
            console.error('Error login:', error);
          }
        });
    } else {
      console.error('error en login admin');
    }
  }
}
