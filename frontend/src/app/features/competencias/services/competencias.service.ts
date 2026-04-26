import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import {
    Competencia,
    CompetenciasResponse,
    CreateCompetenciaDto,
    UpdateCompetenciaDto,
} from '../models/competencia.model';

@Injectable({
    providedIn: 'root',
})
export class CompetenciasService {
    private api = inject(ApiService);

    private endpoint = 'competencias';

    getAll(params?: {
        page?: number;
        limit?: number;
        busqueda?: string;
        estado?: string;
        nivel_dificultad?: string;
        tipo?: string;
    }): Observable<CompetenciasResponse> {
        return this.api.get<CompetenciasResponse>(this.endpoint, { params });
    }

    getById(id: number): Observable<{ competencia: Competencia }> {
        return this.api.get<{ competencia: Competencia }>(
            `${this.endpoint}/${id}`,
        );
    }

    create(
        dto: CreateCompetenciaDto,
    ): Observable<{ competencia: Competencia; message: string }> {
        return this.api.post(`${this.endpoint}`, dto);
    }

    update(
        id: number,
        dto: UpdateCompetenciaDto,
    ): Observable<{ competencia: Competencia; message: string }> {
        return this.api.patch(`${this.endpoint}/${id}`, dto);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }
}