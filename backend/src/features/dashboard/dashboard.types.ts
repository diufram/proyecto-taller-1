import { Dificultad } from '../../database/entities/problema.entity';
import { Estado } from '../../database/entities/competencia.entity';
import { EstadoSolucion } from '../../database/entities/solucion.entity';

export interface DashboardSummary {
  totalCompetencias: number;
  competenciasActivas: number;
  totalProblemas: number;
  totalUsuarios: number;
  totalSoluciones: number;
  tasaAcierto: number;
}

export interface DashboardDistribution {
  label: string;
  value: number;
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
  dificultad: Dificultad;
}

export interface DashboardRecentCompetition {
  id: number;
  nombre: string;
  estado: Estado;
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
  competenciasPorEstado: Record<Estado, number>;
  problemasPorDificultad: Record<Dificultad, number>;
  solucionesPorEstado: Record<EstadoSolucion, number>;
  topUsuarios: DashboardTopUser[];
  problemasMasDificiles: DashboardHardProblem[];
  problemasSinActividad: DashboardInactiveProblem[];
  competenciasRecientes: DashboardRecentCompetition[];
  competenciaMasActiva: DashboardMostActiveCompetition | null;
}
