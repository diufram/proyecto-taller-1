import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, finalize, of, catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/http/api.service';
import {
    LoginRequest,
    LoginResponseData,
    RegisterRequest,
    Usuario,
} from '../models/auth-response.interface';

interface JwtPayload {
    sub: number;
    correo_electronico: string;
    rol: string;
    exp: number;
    iat: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private api = inject(ApiService);
    private router = inject(Router);

    private endpointLogin = 'auth/login';
    private endpointLogout = 'auth/logout';
    private endpointRegister = 'auth/register';
    private endpointRefresh = 'auth/refresh';

    isAuthenticated = signal<boolean>(false);
    currentUser = signal<Usuario | null>(null);

    login(credentials: LoginRequest): Observable<LoginResponseData> {
        return this.api
            .post<LoginResponseData>(this.endpointLogin, credentials)
            .pipe(
                tap((data) => {
                    this.guardarSesion(data);
                }),
            );
    }

    register(data: RegisterRequest): Observable<LoginResponseData> {
        return this.api
            .post<LoginResponseData>(this.endpointRegister, data)
            .pipe(
                tap((response) => {
                    this.guardarSesion(response);
                }),
            );
    }

    logout(): void {
        const finishLogout = () => {
            this.clearSession();
            if (!this.router.url.startsWith('/auth/login')) {
                this.router.navigate(['/auth/login']);
            }
        };

        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            this.api
                .post(this.endpointLogout, { refresh_token: refreshToken })
                .pipe(finalize(finishLogout))
                .subscribe({
                    error: () => {
                        // finalize ya limpia y navega
                    },
                });
        } else {
            finishLogout();
        }
    }

    loadSession(): Promise<void> {
        return new Promise((resolve) => {
            const token = this.getAccessToken();

            if (!token || this.isTokenExpired(token)) {
                this.clearSession();
                resolve();
                return;
            }

            const userJson =
                typeof localStorage !== 'undefined'
                    ? localStorage.getItem('usuario')
                    : null;

            if (
                userJson &&
                userJson !== 'null' &&
                userJson !== 'undefined'
            ) {
                try {
                    const user = JSON.parse(userJson) as Usuario;
                    this.currentUser.set(user);
                } catch {
                    this.clearSession();
                    resolve();
                    return;
                }
            }

            this.isAuthenticated.set(true);
            resolve();
        });
    }

    bootstrapSession(): Promise<boolean> {
        return new Promise((resolve) => {
            const token = this.getAccessToken();
            const refreshToken = this.getRefreshToken();

            if (!token) {
                this.clearSession();
                resolve(false);
                return;
            }

            if (!this.isTokenExpired(token)) {
                this.hydrateCurrentUser();
                this.isAuthenticated.set(true);
                resolve(true);
                return;
            }

            if (!refreshToken || this.isTokenExpired(refreshToken)) {
                this.clearSession();
                resolve(false);
                return;
            }

            this.refreshTokens(refreshToken).subscribe({
                next: () => resolve(true),
                error: () => {
                    this.clearSession();
                    resolve(false);
                },
            });
        });
    }

    refreshTokens(refreshToken: string): Observable<LoginResponseData> {
        return this.api
            .post<LoginResponseData>(this.endpointRefresh, {
                refresh_token: refreshToken,
            })
            .pipe(
                tap((data) => {
                    this.guardarSesion(data);
                }),
            );
    }

    isAdmin(): boolean {
        const user = this.currentUser();
        return user?.rol?.toLowerCase() === 'admin';
    }

    hasValidAccessToken(): boolean {
        const token = this.getAccessToken();
        return !!token && !this.isTokenExpired(token);
    }

    clearSession(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('redirect_url');
        }
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
    }

    forceLogout(redirect = true): void {
        this.clearSession();
        if (redirect) {
            this.router.navigate(['/auth/login']);
        }
    }

    isTokenExpired(token: string | null | undefined): boolean {
        if (!token) return true;
        const payload = this.decodeJwt(token);
        if (!payload || typeof payload.exp !== 'number') return true;
        return payload.exp * 1000 <= Date.now();
    }

    private getAccessToken(): string | null {
        return typeof localStorage !== 'undefined'
            ? localStorage.getItem('token')
            : null;
    }

    private getRefreshToken(): string | null {
        return typeof localStorage !== 'undefined'
            ? localStorage.getItem('refresh_token')
            : null;
    }

    private decodeJwt(token: string): JwtPayload | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const payload = parts[1];
            const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = normalized.padEnd(
                normalized.length + ((4 - (normalized.length % 4)) % 4),
                '=',
            );
            const json = atob(padded);
            return JSON.parse(json) as JwtPayload;
        } catch {
            return null;
        }
    }

    private hydrateCurrentUser(): void {
        if (typeof localStorage === 'undefined') return;
        const userJson = localStorage.getItem('usuario');
        if (!userJson || userJson === 'null' || userJson === 'undefined') {
            this.currentUser.set(null);
            return;
        }
        try {
            this.currentUser.set(JSON.parse(userJson) as Usuario);
        } catch {
            this.currentUser.set(null);
        }
    }

    private guardarSesion(data: LoginResponseData) {
        localStorage.setItem('token', data.access_token);
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        this.currentUser.set(data.usuario);
        this.isAuthenticated.set(true);
    }
}
