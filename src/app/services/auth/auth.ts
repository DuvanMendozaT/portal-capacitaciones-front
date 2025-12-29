import { Injectable, signal } from '@angular/core';
import { LoginRequest } from '../../model/dto/LoginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginResponse } from '../../model/dto/LoginResponse';
import { RegisterRequest } from '../../model/dto/RegisterRequest';
import { SimpleResponse } from '../../model/dto/SimpleResponse';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl: String = 'http://localhost:8080/auth';
  //private readonly baseUrl: String = 'https://portal-capacitaciones-back.onrender.com/auth';
  
  private readonly ID_KEY = 'auth_id';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'auth_role';
  private readonly FULLNAME_KEY = 'auth_fullname';

  private sessionSig = signal(this.readProfileFromStorage());

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/login', request).pipe(
      tap((res) => this.saveSession(res))
    );
  }
  register(request: RegisterRequest): Observable<SimpleResponse> {
    return this.http
      .post<SimpleResponse>(this.baseUrl + '/register', request)
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem(this.ID_KEY, String(response.id));
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.ROLE_KEY, response.role);
    localStorage.setItem(this.FULLNAME_KEY, response.fullName);

    this.sessionSig.set({
      id:String(response.id),
      token: response.token,
      role: response.role,
      fullName: response.fullName,
    });
  }

  isLoggedIn(): boolean {
    return !!this.sessionSig()?.token;
  }

  getRole(): string | null {
    return this.sessionSig()?.role ?? null;
  }

   getId(): string | null {
    return this.sessionSig()?.id ?? null;
  }

    getFullName(): string | null {
    return this.sessionSig()?.fullName ?? null;
  }

  getProfile() {
    return this.sessionSig();
  }

  logout(): void {
    localStorage.removeItem(this.ID_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.FULLNAME_KEY);

    this.sessionSig.set({
      id:null,
      token: null,
      role: null,
      fullName: null,
    });
  }

  private readProfileFromStorage(): {
    id: string | null;
    token: string | null;
    role: string | null;
    fullName: string | null;
  } {
    return {      
      id: localStorage.getItem(this.ID_KEY),
      token: localStorage.getItem(this.TOKEN_KEY),
      role: localStorage.getItem(this.ROLE_KEY),
      fullName: localStorage.getItem(this.FULLNAME_KEY),
    };
  }
}
