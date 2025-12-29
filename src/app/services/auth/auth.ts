import { Injectable, signal } from '@angular/core';
import { LoginRequest } from '../../model/dto/LoginRequest';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { RegisterRequest } from '../../model/dto/RegisterRequest';
import { SimpleResponse } from '../../model/dto/SimpleResponse';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly ID_KEY = 'auth_id';
  private readonly ROLE_KEY = 'auth_role';
  private readonly FULLNAME_KEY = 'auth_fullname';

  private sessionSig = signal(this.readProfileFromStorage());

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<string> {
    return this.http
      .post(this.baseUrl + '/login', request, {
        responseType: 'text'
      })
      .pipe(tap((res) => this.saveSession(res)));
  }
  register(request: RegisterRequest): Observable<SimpleResponse> {
    return this.http.post<SimpleResponse>(this.baseUrl + '/register', request);
  }

  private saveSession(token: string): void {
    const payload = token ? this.decodeJwtPayload(token) : null;
    const id = payload?.id?.toString();
    const role = payload?.role;
    const fullName = payload?.fullName;

    localStorage.setItem(this.ID_KEY, id);
    localStorage.setItem(this.ROLE_KEY, role);
    localStorage.setItem(this.FULLNAME_KEY, fullName);

    this.sessionSig.set({
      id,
      role,
      fullName,
    });
  }

  private decodeJwtPayload(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.sessionSig()?.id;
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
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.FULLNAME_KEY);

    this.sessionSig.set({
      id: null,
      role: null,
      fullName: null,
    });
  }

  private readProfileFromStorage(): {
    id: string | null;
    role: string | null;
    fullName: string | null;
  } {
    return {
      id: localStorage.getItem(this.ID_KEY),
      role: localStorage.getItem(this.ROLE_KEY),
      fullName: localStorage.getItem(this.FULLNAME_KEY),
    };
  }
}
