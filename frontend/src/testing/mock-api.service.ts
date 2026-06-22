import { Observable, of, throwError } from 'rxjs';

export interface CapturedRequest {
    url: string;
    method: string;
    body?: unknown;
    params?: Record<string, unknown>;
}

export class MockApiService {
    public requests: CapturedRequest[] = [];
    private responses = new Map<string, Observable<unknown>>();
    private errors = new Map<string, Error>();

    when(method: string, url: string, response: unknown): this {
        const key = `${method.toUpperCase()} ${url}`;
        this.responses.set(key, of(response));
        return this;
    }

    whenError(method: string, url: string, error: Error): this {
        const key = `${method.toUpperCase()} ${url}`;
        this.errors.set(key, error);
        return this;
    }

    get<T>(endpoint: string, options?: { params?: any }): Observable<T> {
        this.requests.push({
            url: `GET ${endpoint}`,
            method: 'GET',
            params: options?.params,
        });
        return this.resolve<T>('GET', endpoint);
    }

    post<T>(endpoint: string, body?: any): Observable<T> {
        this.requests.push({ url: `POST ${endpoint}`, method: 'POST', body });
        return this.resolve<T>('POST', endpoint);
    }

    put<T>(endpoint: string, body?: any): Observable<T> {
        this.requests.push({ url: `PUT ${endpoint}`, method: 'PUT', body });
        return this.resolve<T>('PUT', endpoint);
    }

    patch<T>(endpoint: string, body?: any): Observable<T> {
        this.requests.push({ url: `PATCH ${endpoint}`, method: 'PATCH', body });
        return this.resolve<T>('PATCH', endpoint);
    }

    delete<T>(endpoint: string): Observable<T> {
        this.requests.push({
            url: `DELETE ${endpoint}`,
            method: 'DELETE',
        });
        return this.resolve<T>('DELETE', endpoint);
    }

    private resolve<T>(method: string, endpoint: string): Observable<T> {
        const key = `${method} ${endpoint}`;
        const error = this.errors.get(key);
        if (error) {
            return throwError(() => error);
        }
        const response = this.responses.get(key);
        if (!response) {
            throw new Error(`MockApiService: no mock for ${key}`);
        }
        return response as Observable<T>;
    }
}