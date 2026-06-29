export type EstadoSolucion =
    | 'Pendiente'
    | 'En revisión'
    | 'Revisado';

export type Lenguaje =
    | 'Python'
    | 'Java'
    | 'C'
    | 'JavaScript'
    | 'Pseudocodigo'
    | 'Otro';

export type TipoCriterioEvaluacion = 'Obligatorio' | 'Objetivo';

export interface CriterioEvaluacionSolucion {
    criterio: string;
    peso: number;
    tipo: TipoCriterioEvaluacion;
    puntaje: number;
    comentario: string;
}

export const RUBRICA_SOLUCION: Array<
    Pick<CriterioEvaluacionSolucion, 'criterio' | 'peso' | 'tipo'>
> = [
    { criterio: 'Correctitud', peso: 40, tipo: 'Obligatorio' },
    { criterio: 'Tiempo', peso: 20, tipo: 'Objetivo' },
    { criterio: 'Memoria', peso: 15, tipo: 'Objetivo' },
    { criterio: 'Calidad del código', peso: 10, tipo: 'Objetivo' },
    { criterio: 'Complejidad algorítmica', peso: 5, tipo: 'Objetivo' },
    { criterio: 'Uso de estructuras de datos', peso: 5, tipo: 'Objetivo' },
    { criterio: 'Robustez', peso: 5, tipo: 'Objetivo' },
];

export interface Solucion {
    id: number;
    respuesta: string;
    lenguaje_programacion: Lenguaje;
    estado: EstadoSolucion;
    resultado_validacion: boolean;
    puntaje_total: number;
    confianza_ia?: number | null;
    justificacion_ia?: string | null;
    criterios_evaluacion?: CriterioEvaluacionSolucion[] | null;
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
    puntaje_total?: number;
    confianza_ia?: number;
    justificacion_ia?: string;
    criterios_evaluacion?: CriterioEvaluacionSolucion[];
}

export interface SugerenciaIA {
    estado: EstadoSolucion;
    confianza: number;
    puntaje_total: number;
    justificacion: string;
    criterios: CriterioEvaluacionSolucion[];
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
    'En revisión': 'En revisión',
    Revisado: 'Revisado',
};

export const ESTADO_SOLUCION_SEVERITY: Record<
    EstadoSolucion,
    'info' | 'success' | 'danger' | 'warn'
> = {
    Pendiente: 'info',
    'En revisión': 'warn',
    Revisado: 'success',
};

export const ESTADOS_SOLUCION: EstadoSolucion[] = [
    'Pendiente',
    'En revisión',
    'Revisado',
];
