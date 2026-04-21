import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import {
  AdminSession,
  AdminUser,
  AuthMessageResponse,
  CreateAdminUserRequest,
} from '../models/admin-auth.model';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'elmostafa_admin_session_v2';
  private readonly authUrl = `${API_BASE_URL}/auth`;

  readonly session = signal<AdminSession | null>(this.loadSession());
  readonly isAuthenticated = computed(() => Boolean(this.session()?.accessToken));

  requestCode(email: string): Observable<AuthMessageResponse> {
    return this.http
      .post<AuthMessageResponse>(`${this.authUrl}/request-code`, { email: email.trim() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  verifyCode(email: string, code: string): Observable<AdminSession> {
    return this.http
      .post<unknown>(`${this.authUrl}/verify-code`, {
        email: email.trim(),
        code: code.trim(),
      })
      .pipe(
        map((response) => this.normalizeSessionResponse(response, email)),
        tap((session) => this.persistSession(session)),
        catchError((error) => this.handleError(error)),
      );
  }

  login(email: string, password: string): Observable<AdminSession> {
    return this.http
      .post<unknown>(`${this.authUrl}/login`, {
        email: email.trim(),
        password,
      })
      .pipe(
        map((response) => this.normalizeSessionResponse(response, email)),
        tap((session) => this.persistSession(session)),
        catchError((error) => this.handleError(error)),
      );
  }

  refresh(): Observable<AdminSession> {
    const refreshToken = this.session()?.refreshToken;

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token is available.'));
    }

    return this.http.post<unknown>(`${this.authUrl}/refresh`, { refreshToken }).pipe(
      map((response) => this.normalizeSessionResponse(response, this.session()?.user.email ?? '')),
      tap((session) => this.persistSession(session)),
      catchError((error) => this.handleError(error)),
    );
  }

  logout(): void {
    const refreshToken = this.session()?.refreshToken;
    this.clearSession();

    if (!refreshToken) {
      return;
    }

    this.http
      .post(`${this.authUrl}/logout`, { refreshToken })
      .pipe(catchError(() => []))
      .subscribe();
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http
      .get<AdminUser[]>(`${this.authUrl}/users`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  createUser(payload: CreateAdminUserRequest): Observable<AdminUser> {
    return this.http
      .post<AdminUser>(`${this.authUrl}/users`, payload)
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteUser(id: string | number): Observable<void> {
    return this.http
      .delete<void>(`${this.authUrl}/users/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private persistSession(session: AdminSession): void {
    this.session.set(session);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
  }

  private clearSession(): void {
    this.session.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private loadSession(): AdminSession | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      const session = JSON.parse(raw) as AdminSession;
      return session.accessToken ? session : null;
    } catch {
      return null;
    }
  }

  private normalizeSessionResponse(response: unknown, fallbackEmail: string): AdminSession {
    const body = response as Record<string, any>;
    const data = body['data'] ?? body;
    const userSource = data['user'] ?? data['admin'] ?? body['user'] ?? body['admin'] ?? {};
    const accessToken =
      data['accessToken'] ?? data['token'] ?? data['jwt'] ?? body['accessToken'] ?? body['token'];
    const refreshToken = data['refreshToken'] ?? body['refreshToken'];

    if (!accessToken) {
      throw new Error('Auth response did not include an access token.');
    }

    const firstName = userSource['firstName'] ?? userSource['first_name'] ?? '';
    const lastName = userSource['lastName'] ?? userSource['last_name'] ?? '';
    const fullName =
      userSource['fullName'] ??
      userSource['full_name'] ??
      `${firstName} ${lastName}`.trim() ??
      fallbackEmail;

    return {
      accessToken,
      refreshToken,
      user: {
        id: userSource['id'],
        email: userSource['email'] ?? fallbackEmail,
        firstName,
        lastName,
        fullName: fullName || fallbackEmail,
        role: userSource['role'],
      },
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      typeof error.error === 'string'
        ? error.error
        : error.error?.message ?? error.message ?? 'Authentication request failed.';

    return throwError(() => new Error(message));
  }
}

