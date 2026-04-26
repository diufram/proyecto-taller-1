import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpErrorResponse,
    HttpClient,
    HttpBackend,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import {
    catchError,
    switchMap,
    throwError,
    BehaviorSubject,
    filter,
    take,
} from 'rxjs';
import { Router } from '@angular/router';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
>(null);

function isPublicAuthUrl(url: string) {
    return (
        url.includes('/auth/login') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/register')
    );
}

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
) => {
    const router = inject(Router);
    const httpBackend = inject(HttpBackend);
    const httpClient = new HttpClient(httpBackend);

    const token = localStorage.getItem('token');

    let authReq = req;

    if (token && !isPublicAuthUrl(req.url)) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                !isPublicAuthUrl(req.url)
            ) {
                return handle401Error(authReq, next, httpClient, router);
            }
            return throwError(() => error);
        }),
    );
};

const handle401Error = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    http: HttpClient,
    router: Router,
) => {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            isRefreshing = false;
            router.navigate(['/auth/login']);
            return throwError(() => new Error('No refresh token'));
        }

        const url = `${environment.apiUrl}/auth/refresh`;
        const body = { refresh_token: refreshToken };

        return http.post<any>(url, body).pipe(
            switchMap((response: any) => {
                isRefreshing = false;

                const newToken =
                    response.access_token || response.data?.access_token;
                const newRefreshToken =
                    response.refresh_token || response.data?.refresh_token;

                if (newToken) {
                    localStorage.setItem('token', newToken);
                    if (newRefreshToken)
                        localStorage.setItem('refresh_token', newRefreshToken);
                    refreshTokenSubject.next(newToken);

                    return next(
                        request.clone({
                            setHeaders: { Authorization: `Bearer ${newToken}` },
                        }),
                    );
                }

                router.navigate(['/auth/login']);
                return throwError(() => new Error('Token refresh failed'));
            }),
            catchError((err) => {
                isRefreshing = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('usuario');
                router.navigate(['/auth/login']);
                return throwError(() => err);
            }),
        );
    } else {
        return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
                return next(
                    request.clone({
                        setHeaders: { Authorization: `Bearer ${token as string}` },
                    }),
                );
            }),
        );
    }
};
