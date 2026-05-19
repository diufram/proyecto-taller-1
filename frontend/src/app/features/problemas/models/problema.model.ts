export type Dificultad = 'Facil' | 'Medio' | 'Dificil';

export interface Problema {
    id: number;
    titulo: string;
    descripcion: string;
    dificultad: Dificultad;
    formato_entrada: string;
    formato_salida: string;
    ejemplo_entrada: string;
    ejemplo_salida: string;
    competencia_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProblemaDto {
    titulo: string;
    descripcion: string;
    dificultad: Dificultad;
    formato_entrada: string;
    formato_salida: string;
    ejemplo_entrada: string;
    ejemplo_salida: string;
}

export interface UpdateProblemaDto extends Partial<CreateProblemaDto> {}

export interface ProblemasMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ProblemasResponse {
    items: Problema[];
    meta: ProblemasMeta;
}

export const DIFICULTADES: Dificultad[] = ['Facil', 'Medio', 'Dificil'];