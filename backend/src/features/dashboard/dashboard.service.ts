import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Competencia,
  Estado,
} from '../../database/entities/competencia.entity';
import { Dificultad, Problema } from '../../database/entities/problema.entity';
import {
  EstadoSolucion,
  Solucion,
} from '../../database/entities/solucion.entity';
import { Rol, Usuario } from '../../database/entities/usuario.entity';
import { AdminDashboardStats } from './dashboard.types';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
    @InjectRepository(Problema)
    private readonly problemaRepository: Repository<Problema>,
    @InjectRepository(Solucion)
    private readonly solucionRepository: Repository<Solucion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async getAdminStats(): Promise<AdminDashboardStats> {
    const [
      totalCompetencias,
      competenciasActivas,
      totalProblemas,
      totalUsuarios,
      totalSoluciones,
      solucionesCorrectas,
      competenciasPorEstado,
      problemasPorDificultad,
      solucionesPorEstado,
      topUsuarios,
      problemasMasDificiles,
      problemasSinActividad,
      competenciasRecientes,
      competenciaMasActiva,
    ] = await Promise.all([
      this.competenciaRepository.count(),
      this.competenciaRepository
        .createQueryBuilder('c')
        .where('c.estado IN (:...estados)', {
          estados: [Estado.ABIERTA, Estado.EN_CURSO],
        })
        .getCount(),
      this.problemaRepository.count(),
      this.usuarioRepository.count({ where: { rol: Rol.USER } }),
      this.solucionRepository.count(),
      this.solucionRepository.count({
        where: { estado: EstadoSolucion.CORRECTO },
      }),
      this.getCompetenciasPorEstado(),
      this.getProblemasPorDificultad(),
      this.getSolucionesPorEstado(),
      this.getTopUsuarios(),
      this.getProblemasMasDificiles(),
      this.getProblemasSinActividad(),
      this.getCompetenciasRecientes(),
      this.getCompetenciaMasActiva(),
    ]);

    return {
      summary: {
        totalCompetencias,
        competenciasActivas,
        totalProblemas,
        totalUsuarios,
        totalSoluciones,
        tasaAcierto: this.percent(solucionesCorrectas, totalSoluciones),
      },
      competenciasPorEstado,
      problemasPorDificultad,
      solucionesPorEstado,
      topUsuarios,
      problemasMasDificiles,
      problemasSinActividad,
      competenciasRecientes,
      competenciaMasActiva,
    };
  }

  private async getCompetenciasPorEstado(): Promise<Record<Estado, number>> {
    const rows = await this.competenciaRepository
      .createQueryBuilder('c')
      .select('c.estado', 'estado')
      .addSelect('COUNT(*)::int', 'total')
      .groupBy('c.estado')
      .getRawMany<{ estado: Estado; total: number | string }>();

    const result = this.emptyEstadoRecord();
    for (const row of rows) {
      result[row.estado] = Number(row.total) || 0;
    }
    return result;
  }

  private async getProblemasPorDificultad(): Promise<
    Record<Dificultad, number>
  > {
    const rows = await this.problemaRepository
      .createQueryBuilder('p')
      .select('p.dificultad', 'dificultad')
      .addSelect('COUNT(*)::int', 'total')
      .groupBy('p.dificultad')
      .getRawMany<{ dificultad: Dificultad; total: number | string }>();

    const result = this.emptyDificultadRecord();
    for (const row of rows) {
      result[row.dificultad] = Number(row.total) || 0;
    }
    return result;
  }

  private async getSolucionesPorEstado(): Promise<
    Record<EstadoSolucion, number>
  > {
    const rows = await this.solucionRepository
      .createQueryBuilder('s')
      .select('s.estado', 'estado')
      .addSelect('COUNT(*)::int', 'total')
      .groupBy('s.estado')
      .getRawMany<{ estado: EstadoSolucion; total: number | string }>();

    const result = this.emptyEstadoSolucionRecord();
    for (const row of rows) {
      result[row.estado] = Number(row.total) || 0;
    }
    return result;
  }

  private async getTopUsuarios() {
    const rows = await this.usuarioRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.inscripciones', 'i')
      .leftJoin(
        'soluciones',
        's',
        's.usuarioId = u.id AND s.estado = :correcto AND s.deleted_at IS NULL',
        { correcto: EstadoSolucion.CORRECTO },
      )
      .leftJoin('personas', 'p', 'p.usuarioId = u.id')
      .where('u.rol = :rol', { rol: Rol.USER })
      .select([
        'u.id AS id',
        'u.nombre_usuario AS username',
        'u.puntos_totales AS points',
        'COUNT(DISTINCT s.id)::int AS solved_problems',
        'COUNT(DISTINCT i.id)::int AS competitions',
        'p.nombre AS nombre',
        'p.apellido AS apellido',
      ])
      .groupBy('u.id')
      .addGroupBy('p.nombre')
      .addGroupBy('p.apellido')
      .orderBy('u.puntos_totales', 'DESC')
      .addOrderBy('u.created_at', 'ASC')
      .limit(5)
      .getRawMany<{
        username: string;
        points: number | string;
        solved_problems: number | string;
        competitions: number | string;
        nombre: string | null;
        apellido: string | null;
      }>();

    return rows.map((row, index) => ({
      position: index + 1,
      username: row.username,
      name: this.displayName(row.nombre, row.apellido, row.username),
      points: Number(row.points) || 0,
      solvedProblems: Number(row.solved_problems) || 0,
      competitions: Number(row.competitions) || 0,
    }));
  }

  private async getProblemasMasDificiles() {
    const rows = await this.problemaRepository
      .createQueryBuilder('p')
      .innerJoin('p.competencia', 'c')
      .innerJoin('p.soluciones', 's')
      .select('p.id', 'id')
      .addSelect('p.titulo', 'titulo')
      .addSelect('c.nombre', 'competencia')
      .addSelect('COUNT(s.id)::int', 'total_soluciones')
      .addSelect(
        `COUNT(s.id) FILTER (WHERE s.estado = '${EstadoSolucion.CORRECTO}')::int`,
        'correctas',
      )
      .groupBy('p.id')
      .addGroupBy('c.nombre')
      .orderBy(
        `CASE WHEN COUNT(s.id) = 0 THEN 100 ELSE (COUNT(s.id) FILTER (WHERE s.estado = '${EstadoSolucion.CORRECTO}')::float / COUNT(s.id)) END`,
        'ASC',
      )
      .addOrderBy('COUNT(s.id)', 'DESC')
      .limit(5)
      .getRawMany<{
        id: number | string;
        titulo: string;
        competencia: string;
        total_soluciones: number | string;
        correctas: number | string;
      }>();

    return rows.map((row) => {
      const total = Number(row.total_soluciones) || 0;
      const correctas = Number(row.correctas) || 0;
      return {
        id: Number(row.id),
        titulo: row.titulo,
        competencia: row.competencia,
        totalSoluciones: total,
        correctas,
        tasaAcierto: this.percent(correctas, total),
      };
    });
  }

  private async getProblemasSinActividad() {
    const rows = await this.problemaRepository
      .createQueryBuilder('p')
      .innerJoin('p.competencia', 'c')
      .leftJoin('p.soluciones', 's')
      .select('p.id', 'id')
      .addSelect('p.titulo', 'titulo')
      .addSelect('p.dificultad', 'dificultad')
      .addSelect('c.nombre', 'competencia')
      .groupBy('p.id')
      .addGroupBy('c.nombre')
      .having('COUNT(s.id) = 0')
      .orderBy('p.created_at', 'DESC')
      .limit(5)
      .getRawMany<{
        id: number | string;
        titulo: string;
        competencia: string;
        dificultad: Dificultad;
      }>();

    return rows.map((row) => ({
      id: Number(row.id),
      titulo: row.titulo,
      competencia: row.competencia,
      dificultad: row.dificultad,
    }));
  }

  private async getCompetenciasRecientes() {
    const rows = await this.competenciaRepository
      .createQueryBuilder('c')
      .leftJoin('c.problemas', 'p')
      .select('c.id', 'id')
      .addSelect('c.nombre', 'nombre')
      .addSelect('c.estado', 'estado')
      .addSelect('c.nivel_dificultad', 'nivel')
      .addSelect('c.fecha_inicio', 'fecha_inicio')
      .addSelect('COUNT(p.id)::int', 'problemas')
      .groupBy('c.id')
      .orderBy('c.created_at', 'DESC')
      .limit(5)
      .getRawMany<{
        id: number | string;
        nombre: string;
        estado: Estado;
        nivel: string;
        fecha_inicio: Date;
        problemas: number | string;
      }>();

    return rows.map((row) => ({
      id: Number(row.id),
      nombre: row.nombre,
      estado: row.estado,
      nivel: row.nivel,
      fechaInicio:
        row.fecha_inicio?.toISOString?.() ?? String(row.fecha_inicio),
      problemas: Number(row.problemas) || 0,
    }));
  }

  private async getCompetenciaMasActiva() {
    const rows = await this.competenciaRepository
      .createQueryBuilder('c')
      .innerJoin('c.problemas', 'p')
      .innerJoin('p.soluciones', 's')
      .select('c.id', 'id')
      .addSelect('c.nombre', 'nombre')
      .addSelect('COUNT(s.id)::int', 'soluciones')
      .groupBy('c.id')
      .orderBy('COUNT(s.id)', 'DESC')
      .limit(1)
      .getRawMany<{
        id: number | string;
        nombre: string;
        soluciones: number | string;
      }>();

    const row = rows[0];
    if (!row) return null;
    return {
      id: Number(row.id),
      nombre: row.nombre,
      soluciones: Number(row.soluciones) || 0,
    };
  }

  private emptyEstadoRecord(): Record<Estado, number> {
    return {
      [Estado.ABIERTA]: 0,
      [Estado.EN_CURSO]: 0,
      [Estado.FINALIZADA]: 0,
      [Estado.CANCELADA]: 0,
    };
  }

  private emptyDificultadRecord(): Record<Dificultad, number> {
    return {
      [Dificultad.FACIL]: 0,
      [Dificultad.MEDIO]: 0,
      [Dificultad.DIFICIL]: 0,
    };
  }

  private emptyEstadoSolucionRecord(): Record<EstadoSolucion, number> {
    return {
      [EstadoSolucion.PENDIENTE]: 0,
      [EstadoSolucion.CORRECTO]: 0,
      [EstadoSolucion.INCORRECTO]: 0,
      [EstadoSolucion.REVISION]: 0,
    };
  }

  private percent(part: number, total: number): number {
    if (!total) return 0;
    return Math.round((part / total) * 1000) / 10;
  }

  private displayName(
    nombre: string | null,
    apellido: string | null,
    username: string,
  ): string {
    const fullName = [nombre, apellido].filter(Boolean).join(' ').trim();
    return fullName || username;
  }
}
