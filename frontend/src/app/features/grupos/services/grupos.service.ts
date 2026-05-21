import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';

export interface Grupo {
    id: number;
    nombre: string;
    competidores_actuales: number;
    slots_disponibles: number;
    max_participantes: number;
}

export interface GrupoResponse {
    grupo: Grupo;
    message: string;
}

export interface GruposListResponse {
    grupos: Grupo[];
}

@Injectable({
    providedIn: 'root',
})
export class GruposService {
    private api = inject(ApiService);

    private endpoint = 'grupos';

    crearGrupo(competenciaId: number, nombre: string): Observable<GrupoResponse> {
        return this.api.post(this.endpoint, { 
            competencia_id: parseInt(competenciaId as any), 
            nombre 
        });
    }

    listarGrupos(competenciaId: number): Observable<GruposListResponse> {
        return this.api.get(`${this.endpoint}?competencia_id=${competenciaId}`);
    }

    unirseGrupo(grupoId: number): Observable<GrupoResponse> {
        return this.api.post(`${this.endpoint}/unirse`, { grupo_id: parseInt(grupoId as any) });
    }

    salirGrupo(grupoId: number): Observable<{ message: string }> {
        return this.api.delete(`${this.endpoint}/${grupoId}/salir`);
    }
}