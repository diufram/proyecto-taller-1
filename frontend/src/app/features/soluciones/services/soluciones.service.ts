import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import {
    Solucion,
    SolucionesResponse,
    CreateSolucionDto,
} from '../models/solucion.model';

export interface GetMisSolucionesParams {
    page?: number;
    limit?: number;
}

@Injectable({
    providedIn: 'root',
})
export class SolucionesService {
    private api = inject(ApiService);

    private endpoint = 'soluciones';

    create(dto: CreateSolucionDto): Observable<{ solucion: Solucion; message: string }> {
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

    getById(id: number): Observable<{ solucion: Solucion }> {
        return this.api.get<{ solucion: Solucion }>(`${this.endpoint}/${id}`);
    }
}
