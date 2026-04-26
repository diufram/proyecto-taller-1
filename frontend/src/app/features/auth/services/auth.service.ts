import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/http/api.service';
import {
    LoginRequest,
    LoginResponseData,
    RegisterRequest,
    Usuario,
} from '../models/auth-response.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private api = inject(ApiService);
    private router = inject(Router);

    private endpointLogin = 'auth/login';
    private endpointLogout = 'auth/logout';
    private endpointRegister = 'auth/register';

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

    logout() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            this.api
                .post(this.endpointLogout, { refresh_token: refreshToken })
                .pipe(finalize(() => this.limpiarSesion()))
                .subscribe();
        } else {
            this.limpiarSesion();
        }
    }

    loadSession(): Promise<void> {
        return new Promise((resolve) => {
            const token = localStorage.getItem('token');
            const userJson = localStorage.getItem('usuario');

            if (!token) {
                resolve();
                return;
            }

            this.isAuthenticated.set(true);

            if (userJson && userJson !== 'null' && userJson !== 'undefined') {
                try {
                    const user = JSON.parse(userJson) as Usuario;
                    this.currentUser.set(user);
                } catch {
                    this.limpiarSesion();
                }
            }

            resolve();
        });
    }

    isAdmin(): boolean {
        const user = this.currentUser();
        return user?.rol?.toLowerCase() === 'admin';
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

    private limpiarSesion() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('usuario');

        this.currentUser.set(null);
        this.isAuthenticated.set(false);

        this.router.navigate(['/auth/login']);
    }
}
