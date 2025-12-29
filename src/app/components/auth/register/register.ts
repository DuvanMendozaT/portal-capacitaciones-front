import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  submitted = false;
  form!: FormGroup;
  errorMsg = signal('')

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  passwordsMatch(): boolean {
    return this.f['password'].value === this.f['confirmPassword'].value;
  }

  register(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.auth
        .register({
          email: this.form.value.email,
          fullName: this.form.value.fullName,
          password: this.form.value.password,
          role: "USER"
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/login/user']);
            this.form.reset();
          },
          error: (error) => {
            if (error.status == '400') {
              this.errorMsg.set('Usuario ya registrado.');
            } else {
              this.errorMsg.set('Registro fallido. Intenta nuevamente.');
            }
            console.error(error);
          }
        });
    } else {
      console.error('error en register');
    }

  }

}
