import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, Rol } from '../../database/entities/usuario.entity';
import {
  Solucion,
  EstadoSolucion,
} from '../../database/entities/solucion.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { RankingUserDto, RankingResponseDto } from './dto/ranking-user.dto';
import { MyRankingStatsDto } from './dto/my-ranking-stats.dto';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Solucion)
    private readonly solucionRepository: Repository<Solucion>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  async getGlobalRanking(limit = 20): Promise<RankingResponseDto> {
    const totalUsers = await this.usuarioRepository.count({
      where: { rol: Rol.ESTUDIANTE },
    });

    const usuarios = await this.usuarioRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.inscripciones', 'i')
      .leftJoin(
        'soluciones',
        's',
        's.usuarioId = u.id AND s.estado = :correcto AND s.deleted_at IS NULL',
        { correcto: EstadoSolucion.CORRECTO },
      )
      .leftJoin('personas', 'p', 'p.usuarioId = u.id')
      .where('u.rol = :rol', { rol: Rol.ESTUDIANTE })
      .select([
        'u.id AS id',
        'u.correo_electronico AS correo_electronico',
        'u.puntos_totales AS puntos_totales',
        'u.posicion_global AS posicion_global',
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
      .limit(limit)
      .getRawMany();

    interface RankingRow {
      id: number;
      correo_electronico: string;
      puntos_totales: number | string;
      posicion_global: number | null;
      solved_problems: number | string;
      competitions: number | string;
      nombre: string | null;
      apellido: string | null;
    }

    const ranking: RankingUserDto[] = (usuarios as unknown as RankingRow[]).map(
      (u, idx) => {
        const firstName = u.nombre;
        const lastName = u.apellido;
        const name =
          [firstName, lastName].filter(Boolean).join(' ') ||
          u.correo_electronico;
        return {
          position: idx + 1,
          name: this.capitalize(name),
          points: Number(u.puntos_totales) || 0,
          solvedProblems: Number(u.solved_problems) || 0,
          competitions: Number(u.competitions) || 0,
          trend: this.computeTrend(u.posicion_global, idx + 1),
          userId: Number(u.id),
        };
      },
    );

    return { ranking, totalUsers };
  }

  async getMyStats(usuarioId: number): Promise<MyRankingStatsDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const [solvedProblems, competitions, totalUsers] = await Promise.all([
      this.solucionRepository.count({
        where: {
          usuario: { id: usuarioId },
          estado: EstadoSolucion.CORRECTO,
        },
      }),
      this.inscripcionRepository.count({
        where: { usuario: { id: usuarioId } },
      }),
      this.usuarioRepository.count({ where: { rol: Rol.ESTUDIANTE } }),
    ]);

    let position = usuario.posicion_global ?? null;
    if (position === null) {
      position = await this.calcularPosicion(usuarioId);
    }

    return {
      position: position ?? totalUsers,
      points: usuario.puntos_totales ?? 0,
      solvedProblems,
      competitions,
      totalUsers,
    };
  }

  private async calcularPosicion(usuarioId: number): Promise<number | null> {
    const target = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });
    if (!target) return null;

    const count = await this.usuarioRepository
      .createQueryBuilder('u')
      .where('u.rol = :rol', { rol: Rol.ESTUDIANTE })
      .andWhere(
        '(u.puntos_totales > :puntos) OR (u.puntos_totales = :puntos AND u.created_at < :createdAt)',
        { puntos: target.puntos_totales, createdAt: target.createdAt },
      )
      .getCount();

    return count + 1;
  }

  private computeTrend(
    posicionAlmacenada: number | null,
    posicionActual: number,
  ): 'up' | 'down' | 'stable' {
    if (posicionAlmacenada === null || posicionAlmacenada === undefined) {
      return 'stable';
    }
    if (posicionActual < posicionAlmacenada) return 'up';
    if (posicionActual > posicionAlmacenada) return 'down';
    return 'stable';
  }

  private capitalize(value: string): string {
    if (!value) return value;
    return value
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
}
