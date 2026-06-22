import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '@/features/auth/services/auth.service';
import { MockRouter } from '@testing/mock-router';
import { futureExp, makeJwt } from '@testing/jwt.helper';

describe('authGuard', () => {
    let authService: {
        hasValidAccessToken: jest.Mock;
        clearSession: jest.Mock;
    };
    let router: MockRouter;

    const setup = (hasValid: boolean) => {
        authService = {
            hasValidAccessToken: jest.fn().mockReturnValue(hasValid),
            clearSession: jest.fn(),
        };
        router = new MockRouter();
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
            ],
        });
    };

    const run = (url = '/dashboard') => {
        return TestBed.runInInjectionContext(() =>
            authGuard({} as any, { url } as any),
        );
    };

    afterEach(() => {
        localStorage.clear();
    });

    it('permite el acceso si hasValidAccessToken devuelve true', () => {
        setup(true);
        expect(run()).toBe(true);
        expect(router.navigations.length).toBe(0);
    });

    it('redirige a /auth/login y guarda redirect_url si no hay token válido', () => {
        setup(false);
        const url = '/admin/competencias';
        expect(run(url)).toBe(false);
        expect(localStorage.getItem('redirect_url')).toBe(url);
        expect(router.navigations[0]?.commands[0]).toBe('/auth/login');
    });
});