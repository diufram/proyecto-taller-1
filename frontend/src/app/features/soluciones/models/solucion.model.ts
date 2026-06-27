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

export interface AdminSolucion extends Solucion {
    problema_formato_entrada?: string;
    problema_formato_salida?: string;
    problema_ejemplo_entrada?: string;
    problema_ejemplo_salida?: string;
    competencia_nombre?: string;
    usuario_id: number;
    usuario_email: string;
    usuario_nombre?: string | null;
    usuario_apellido?: string | null;
}

export interface CreateSolucionDto {
    problema_id: number;
    respuesta: string;
    lenguaje_programacion: Lenguaje;
}

export interface CalificarSolucionDto {
    estado: EstadoSolucion;
    resultado_validacion?: boolean;
}

export interface SugerenciaIA {
    estado: EstadoSolucion;
    confianza: number;
    justificacion: string;
}

export interface SugerirCalificacionRequest {
    instrucciones_extra?: string;
}

export interface GetMisSolucionesParams {
    page?: number;
    limit?: number;
}

export interface GetAdminSolucionesParams {
    page?: number;
    limit?: number;
    estado?: EstadoSolucion;
    problema_id?: number;
    competencia_id?: number;
    lenguaje_programacion?: Lenguaje;
    search?: string;
}

export interface SolucionesMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface SolucionesResponse<T = Solucion> {
    items: T[];
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

export const ESTADOS_SOLUCION: EstadoSolucion[] = [
    'Pendiente',
    'En revisión',
    'Correcto',
    'Incorrecto',
];
