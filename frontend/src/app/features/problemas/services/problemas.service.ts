import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import {
    Problema,
    ProblemasResponse,
    CreateProblemaDto,
    UpdateProblemaDto,
} from '../models/problema.model';

@Injectable({
    providedIn: 'root',
})
export class ProblemasService {
    private api = inject(ApiService);

    private endpoint = 'problemas';

    getByCompetencia(
        competenciaId: number,
        params?: { page?: number; limit?: number },
    ): Observable<ProblemasResponse> {
        return this.api.get<ProblemasResponse>(
            `competencias/${competenciaId}/problemas`,
            { params },
        );
    }

    getById(id: number): Observable<{ problema: Problema }> {
        return this.api.get<{ problema: Problema }>(`${this.endpoint}/${id}`);
    }

    create(
        competenciaId: number,
        dto: CreateProblemaDto,
    ): Observable<{ problema: Problema; message: string }> {
        return this.api.post(`competencias/${competenciaId}/problemas`, dto);
    }

    update(
        id: number,
        dto: UpdateProblemaDto,
    ): Observable<{ problema: Problema; message: string }> {
        return this.api.patch(`${this.endpoint}/${id}`, dto);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.api.delete(`${this.endpoint}/${id}`);
    }
}