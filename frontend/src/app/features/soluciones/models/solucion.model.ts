export type EstadoSolucion =
    | 'Pendiente'
    | 'Correcto'
    | 'Incorrecto'
    | 'En revisión';

export type Lenguaje =
    | 'Python'
    | 'Java'
    | 'C'
    | 'JavaScript'
    | 'Pseudocodigo'
    | 'Otro';

export interface Solucion {
    id: number;
    respuesta: string;
    lenguaje_programacion: Lenguaje;
    estado: EstadoSolucion;
    resultado_validacion: boolean;
    problema_id: number;
    problema_titulo: string;
    problema_dificultad: string;
    competencia_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateSolucionDto {
    problema_id: number;
    respuesta: string;
    lenguaje_programacion: Lenguaje;
}

export interface SolucionesMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface SolucionesResponse {
    items: Solucion[];
    meta: SolucionesMeta;
}

export const LENGUAJES: Lenguaje[] = [
    'Python',
    'Java',
    'C',
    'JavaScript',
    'Pseudocodigo',
    'Otro',
];

export const ESTADO_SOLUCION_LABELS: Record<EstadoSolucion, string> = {
    Pendiente: 'Pendiente',
    Correcto: 'Correcto',
    Incorrecto: 'Incorrecto',
    'En revisión': 'En revisión',
};

export const ESTADO_SOLUCION_SEVERITY: Record<
    EstadoSolucion,
    'info' | 'success' | 'danger' | 'warn'
> = {
    Pendiente: 'info',
    'En revisión': 'warn',
    Correcto: 'success',
    Incorrecto: 'danger',
};
