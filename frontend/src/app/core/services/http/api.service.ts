import { Injectable, inject } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http'; // ✅ Agregado HttpParams
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    SuccessResponse,
    FailResponse,
    ErrorResponse,
    ValidationError,
} from '../../models/api-response.interface';

export type ApiClientError =
    | {
          kind: 'validation';
          statusCode: number;
          message: string;
          errors: ValidationError[];
      }
    | {
          kind: 'server';
          statusCode: number;
          message: string;
          code?: string;
          trace_id?: string;
      }
    | { kind: 'network'; statusCode: 0; message: string }
    | { kind: 'http'; statusCode: number; message: string };

function isFailResponse(x: any): x is FailResponse {
    return x?.status === 'fail' && Array.isArray(x?.data?.errores_validacion);
}

function isErrorResponse(x: any): x is ErrorResponse {
    return x?.status === 'error';
}

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // ✅ CORREGIDO: Ahora acepta un segundo argumento opcional 'options'
    get<T>(endpoint: string, options?: { params?: any }): Observable<T> {
        let params = new HttpParams();

        if (options?.params) {
            Object.keys(options.params).forEach((key) => {
                const value = options.params[key];
                if (value !== null && value !== undefined) {
                    params = params.set(key, value);
                }
            });
        }

        return this.http
            .get<SuccessResponse<T>>(`${this.apiUrl}/${endpoint}`, { params })
            .pipe(
                map((res) => res.data),
                catchError((err) => this.handleError(err)),
            );
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http
            .post<SuccessResponse<T>>(`${this.apiUrl}/${endpoint}`, body)
            .pipe(
                map((res) => res.data),
                catchError((err) => this.handleError(err)),
            );
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http
            .put<SuccessResponse<T>>(`${this.apiUrl}/${endpoint}`, body)
            .pipe(
                map((res) => res.data),
                catchError((err) => this.handleError(err)),
            );
    }

    patch<T>(endpoint: string, body: any): Observable<T> {
        return this.http
            .patch<SuccessResponse<T>>(`${this.apiUrl}/${endpoint}`, body)
            .pipe(
                map((res) => res.data),
                catchError((err) => this.handleError(err)),
            );
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http
            .delete<SuccessResponse<T>>(`${this.apiUrl}/${endpoint}`)
            .pipe(
                map((res) => res.data),
                catchError((err) => this.handleError(err)),
            );
    }

    // ✅ Normaliza errores según tu contrato del backend
    private handleError(error: HttpErrorResponse) {
        // Sin respuesta (CORS, offline, etc.)
        if (error.status === 0) {
            const e: ApiClientError = {
                kind: 'network',
                statusCode: 0,
                message: 'No se pudo conectar con el servidor.',
            };
            return throwError(() => e);
        }

        const body = error.error; // <- aquí viene el JSON del backend

        // fail (validación)
        if (isFailResponse(body)) {
            const e: ApiClientError = {
                kind: 'validation',
                statusCode: error.status,
                message: body.message || 'Fallo en la validación.',
                errors: body.data.errores_validacion || [],
            };
            return throwError(() => e);
        }

        // error (servidor)
        if (isErrorResponse(body)) {
            const e: ApiClientError = {
                kind: 'server',
                statusCode: error.status,
                message: body.message || 'Error interno del servidor.',
                code: body.code,
                trace_id: body.trace_id,
            };
            return throwError(() => e);
        }

        // cualquier otro http error no estándar
        const e: ApiClientError = {
            kind: 'http',
            statusCode: error.status,
            message: 'Ocurrió un error en la petición.',
        };
        return throwError(() => e);
    }

    // ✅ helper opcional: convierte lista a map por campo
    static toFieldErrors(errors: ValidationError[]): Record<string, string[]> {
        const map: Record<string, string[]> = {};
        for (const it of errors || []) {
            if (!map[it.campo]) map[it.campo] = [];
            map[it.campo].push(it.mensaje);
        }
        return map;
    }

    // ✅ Método especial para paginación que devuelve la respuesta completa (con meta)
    getWithMeta<T>(endpoint: string): Observable<T> {
        let params = new HttpParams();
        return this.http
            .get<SuccessResponse<T>>(`${this.apiUrl}/${endpoint}`, { params })
            .pipe(
                map((res) => res as any), // Devuelve toda la respuesta, no solo data
                catchError((err) => this.handleError(err)),
            );
    }
}
