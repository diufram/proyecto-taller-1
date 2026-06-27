export type Nivel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type Estado = 'Abierta' | 'En curso' | 'Finalizada' | 'Cancelada';

export interface Competencia {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    nivel_dificultad: Nivel;
    estado: Estado;
    max_participantes: number;
    created_at: string;
    updated_at: string;
}

export interface CreateCompetenciaDto {
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    nivel_dificultad: Nivel;
    estado: Estado;
    max_participantes: number;
}

export interface UpdateCompetenciaDto extends Partial<CreateCompetenciaDto> {}

export interface CompetenciasMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface CompetenciasResponse {
    items: Competencia[];
    meta: CompetenciasMeta;
}

export const NIVELES: Nivel[] = ['Principiante', 'Intermedio', 'Avanzado'];
export const ESTADOS: Estado[] = ['Abierta', 'En curso', 'Finalizada', 'Cancelada'];
