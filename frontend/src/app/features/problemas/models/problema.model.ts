export type Dificultad = 'Facil' | 'Medio' | 'Dificil';

export interface Problema {
    id: number;
    titulo: string;
    dificultad: Dificultad;
    formato_entrada: string;
    formato_salida: string;
    ejemplo_entrada: string;
    ejemplo_salida: string;
    competencia_id: number;
    total_soluciones: number;
    soluciones_correctas: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProblemaDto {
    titulo: string;
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

export interface ProblemasStats {
    total: number;
    por_dificultad: Record<Dificultad, number>;
}

export interface ProblemasResponse {
    items: Problema[];
    meta: ProblemasMeta;
    stats: ProblemasStats;
}

export const DIFICULTADES: Dificultad[] = ['Facil', 'Medio', 'Dificil'];

export const DIFICULTAD_LABELS: Record<Dificultad, string> = {
    Facil: 'Fácil',
    Medio: 'Medio',
    Dificil: 'Difícil',
};

export const PUNTOS_POR_DIFICULTAD: Record<Dificultad, number> = {
    Facil: 10,
    Medio: 20,
    Dificil: 30,
};
