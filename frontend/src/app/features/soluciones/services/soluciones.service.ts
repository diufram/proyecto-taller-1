import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import {
    AdminSolucion,
    CalificarSolucionDto,
    CreateSolucionDto,
    GetAdminSolucionesParams,
    GetMisSolucionesParams,
    Solucion,
    SolucionesResponse,
} from '../models/solucion.model';

export interface CalificarResponse {
    solucion: AdminSolucion;
    delta_puntos: number;
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class SolucionesService {
    private api = inject(ApiService);

    private endpoint = 'soluciones';

    create(
        dto: CreateSolucionDto,
    ): Observable<{ solucion: Solucion; message: string }> {
        return this.api.post<{ solucion: Solucion; message: string }>(
            this.endpoint,
            dto,
        );
    }

    misSoluciones(
        params?: GetMisSolucionesParams,
    ): Observable<SolucionesResponse> {
        return this.api.get<SolucionesResponse>(`${this.endpoint}/me`, {
            params,
        });
    }

    getById(id: number): Observable<{ solucion: AdminSolucion }> {
        return this.api.get<{ solucion: AdminSolucion }>(`${this.endpoint}/${id}`);
    }

    getAllAdmin(
        params?: GetAdminSolucionesParams,
    ): Observable<SolucionesResponse<AdminSolucion>> {
        return this.api.get<SolucionesResponse<AdminSolucion>>(this.endpoint, {
            params,
        });
    }

    calificar(id: number, dto: CalificarSolucionDto): Observable<CalificarResponse> {
        return this.api.patch<CalificarResponse>(
            `${this.endpoint}/${id}/estado`,
            dto,
        );
    }
}
