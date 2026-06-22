import { TestBed } from '@angular/core/testing';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHandlerFn,
    HttpHeaders,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {
    provideHttpClient,
    withInterceptors,
} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '@/features/auth/services/auth.service';
import { MockRouter } from '@testing/mock-router';
import { futureExp, makeJwt } from '@testing/jwt.helper';

describe('authInterceptor', () => {
    let authService: {
        hasValidAccessToken: jest.Mock;
        forceLogout: jest.Mock;
    };
    let router: MockRouter;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let refreshSuccess: { access_token: string; refresh_token: string };

    const setup = () => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
            ],
        });
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    };

    beforeEach(() => {
        localStorage.clear();
        authService = {
            hasValidAccessToken: jest.fn(),
            forceLogout: jest.fn(),
        };
        router = new MockRouter();
        refreshSuccess = {
            access_token: 'new-token',
            refresh_token: 'new-refresh',
        };
    });

    afterEach(() => {
        httpMock?.verify();
    });

    it('adjunta Authorization si el token es válido', () => {
        const token = makeJwt({ exp: futureExp() });
        localStorage.setItem('token', token);
        authService.hasValidAccessToken.mockReturnValue(true);
        setup();

        httpClient.get('/competencias').subscribe();

        const req = httpMock.expectOne('/competencias');
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
        req.flush({});
    });

    it('no adjunta Authorization en URLs públicas (auth/login)', () => {
        authService.hasValidAccessToken.mockReturnValue(true);
        localStorage.setItem('token', 'whatever');
        setup();

        httpClient.post('/auth/login', {}).subscribe();

        const req = httpMock.expectOne('/auth/login');
        expect(req.request.headers.has('Authorization')).toBe(false);
        req.flush({});
    });

    it('en 401 sin refresh token llama a forceLogout', () => {
        authService.hasValidAccessToken.mockReturnValue(true);
        localStorage.setItem('token', 'abc');
        // no refresh_token
        setup();

        httpClient.get('/competencias').subscribe({
            error: () => {},
        });

        const req = httpMock.expectOne('/competencias');
        req.flush(
            { message: 'unauthorized' },
            { status: 401, statusText: 'Unauthorized' },
        );

        expect(authService.forceLogout).toHaveBeenCalled();
    });

    it('en 401 con refresh exitoso reintenta la request con nuevo token', () => {
        authService.hasValidAccessToken.mockReturnValue(true);
        localStorage.setItem('token', 'old-token');
        localStorage.setItem('refresh_token', 'refresh');
        setup();

        httpClient.get('/competencias').subscribe();

        const first = httpMock.expectOne('/competencias');
        first.flush(
            { message: 'unauthorized' },
            { status: 401, statusText: 'Unauthorized' },
        );

        const refresh = httpMock.expectOne(
            (r) => r.url.endsWith('/auth/refresh'),
        );
        expect(refresh.request.method).toBe('POST');
        refresh.flush(refreshSuccess);

        const retry = httpMock.expectOne('/competencias');
        expect(retry.request.headers.get('Authorization')).toBe(
            'Bearer new-token',
        );
        expect(localStorage.getItem('token')).toBe('new-token');
        expect(localStorage.getItem('refresh_token')).toBe('new-refresh');
        retry.flush({});
    });

    it('en 401 con refresh fallido llama a forceLogout', () => {
        authService.hasValidAccessToken.mockReturnValue(true);
        localStorage.setItem('token', 'old');
        localStorage.setItem('refresh_token', 'refresh');
        setup();

        httpClient.get('/competencias').subscribe({
            error: () => {},
        });

        const first = httpMock.expectOne('/competencias');
        first.flush(
            { message: 'unauthorized' },
            { status: 401, statusText: 'Unauthorized' },
        );

        const refresh = httpMock.expectOne(
            (r) => r.url.endsWith('/auth/refresh'),
        );
        refresh.flush(
            { message: 'invalid refresh' },
            { status: 401, statusText: 'Unauthorized' },
        );

        expect(authService.forceLogout).toHaveBeenCalled();
    });
});