import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ApiService } from '@/core/services/http/api.service';
import { MockApiService } from '@testing/mock-api.service';
import { MockRouter } from '@testing/mock-router';
import { futureExp, pastExp, makeJwt } from '@testing/jwt.helper';

describe('AuthService', () => {
    let service: AuthService;
    let api: MockApiService;
    let router: MockRouter;

    beforeEach(() => {
        localStorage.clear();
        api = new MockApiService();
        router = new MockRouter();
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: ApiService, useValue: api },
                { provide: Router, useValue: router },
            ],
        });
        service = TestBed.inject(AuthService);
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('isTokenExpired', () => {
        it('devuelve true si no hay token', () => {
            expect(service.isTokenExpired(null)).toBe(true);
            expect(service.isTokenExpired(undefined)).toBe(true);
            expect(service.isTokenExpired('')).toBe(true);
        });

        it('devuelve true si el token está vencido', () => {
            const token = makeJwt({ exp: pastExp() });
            expect(service.isTokenExpired(token)).toBe(true);
        });

        it('devuelve false si el token aún es válido', () => {
            const token = makeJwt({ exp: futureExp() });
            expect(service.isTokenExpired(token)).toBe(false);
        });

        it('devuelve true si el token está malformado', () => {
            expect(service.isTokenExpired('not.a.real.jwt')).toBe(true);
        });
    });

    describe('clearSession', () => {
        it('limpia storage y resetea signals', () => {
            localStorage.setItem('token', 'abc');
            localStorage.setItem('refresh_token', 'xyz');
            localStorage.setItem('usuario', JSON.stringify({ id: 1 }));
            localStorage.setItem('redirect_url', '/dashboard');

            service.clearSession();

            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('refresh_token')).toBeNull();
            expect(localStorage.getItem('usuario')).toBeNull();
            expect(localStorage.getItem('redirect_url')).toBeNull();
            expect(service.isAuthenticated()).toBe(false);
            expect(service.currentUser()).toBeNull();
        });
    });

    describe('logout', () => {
        it('navega a /landing y limpia sesión si hay refresh token', async () => {
            localStorage.setItem('refresh_token', 'refresh-abc');
            api.when('POST', 'auth/logout', { message: 'ok' });

            service.logout();
            await Promise.resolve();

            expect(api.requests.find((r) => r.url === 'POST auth/logout')).toBeDefined();
            expect(localStorage.getItem('refresh_token')).toBeNull();
            expect(router.navigations[0]?.commands[0]).toBe('/landing');
        });

        it('no navega si ya está en /landing', async () => {
            router.urlValue = '/landing';
            localStorage.setItem('refresh_token', 'refresh-abc');
            api.when('POST', 'auth/logout', { message: 'ok' });

            service.logout();
            await Promise.resolve();

            expect(router.navigations.length).toBe(0);
        });

        it('limpia sesión y navega si no hay refresh token', async () => {
            localStorage.setItem('token', 'access-abc');
            service.logout();
            await Promise.resolve();

            expect(localStorage.getItem('token')).toBeNull();
            expect(router.navigations[0]?.commands[0]).toBe('/landing');
        });
    });

    describe('hasValidAccessToken', () => {
        it('devuelve false si no hay token', () => {
            expect(service.hasValidAccessToken()).toBe(false);
        });

        it('devuelve true si hay token vigente', () => {
            localStorage.setItem('token', makeJwt({ exp: futureExp() }));
            expect(service.hasValidAccessToken()).toBe(true);
        });

        it('devuelve false si el token está vencido', () => {
            localStorage.setItem('token', makeJwt({ exp: pastExp() }));
            expect(service.hasValidAccessToken()).toBe(false);
        });
    });
});
