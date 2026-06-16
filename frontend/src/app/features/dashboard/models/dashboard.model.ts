export type CompetenciaEstado = 'Abierta' | 'En curso' | 'Finalizada' | 'Cancelada';
export type ProblemaDificultad = 'Facil' | 'Medio' | 'Dificil';
export type SolucionEstado = 'Pendiente' | 'Correcto' | 'Incorrecto' | 'En revisión';

export interface DashboardSummary {
    totalCompetencias: number;
    competenciasActivas: number;
    totalProblemas: number;
    totalUsuarios: number;
    totalSoluciones: number;
    tasaAcierto: number;
}

export interface DashboardTopUser {
    position: number;
    username: string;
    name: string;
    points: number;
    solvedProblems: number;
    competitions: number;
}

export interface DashboardHardProblem {
    id: number;
    titulo: string;
    competencia: string;
    totalSoluciones: number;
    correctas: number;
    tasaAcierto: number;
}

export interface DashboardInactiveProblem {
    id: number;
    titulo: string;
    competencia: string;
    dificultad: ProblemaDificultad;
}

export interface DashboardRecentCompetition {
    id: number;
    nombre: string;
    estado: CompetenciaEstado;
    nivel: string;
    fechaInicio: string;
    problemas: number;
}

export interface DashboardMostActiveCompetition {
    id: number;
    nombre: string;
    soluciones: number;
}

export interface AdminDashboardStats {
    summary: DashboardSummary;
    competenciasPorEstado: Record<CompetenciaEstado, number>;
    problemasPorDificultad: Record<ProblemaDificultad, number>;
    solucionesPorEstado: Record<SolucionEstado, number>;
    topUsuarios: DashboardTopUser[];
    problemasMasDificiles: DashboardHardProblem[];
    problemasSinActividad: DashboardInactiveProblem[];
    competenciasRecientes: DashboardRecentCompetition[];
    competenciaMasActiva: DashboardMostActiveCompetition | null;
}
