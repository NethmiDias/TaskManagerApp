import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { AuthResponse, LoginRequest, RegisterRequest } from './auth.models';

const TOKEN_KEY = 'tm_token';
const USERNAME_KEY = 'tm_username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly _username = signal<string | null>(localStorage.getItem(USERNAME_KEY));

  token(): string | null {
    return this._token();
  }

  username(): string | null {
    return this._username();
  }

  isLoggedIn(): boolean {
    return !!this._token();
  }

  async login(req: LoginRequest): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${APP_CONFIG.apiBaseUrl}/auth/login`, req)
    );
    this.persistAuth(res);
  }

  async register(req: RegisterRequest): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${APP_CONFIG.apiBaseUrl}/auth/register`, req)
    );
    this.persistAuth(res);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this._token.set(null);
    this._username.set(null);
  }

  private persistAuth(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USERNAME_KEY, res.username);
    this._token.set(res.token);
    this._username.set(res.username);
  }
}

