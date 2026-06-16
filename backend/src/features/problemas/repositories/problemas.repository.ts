import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Problema,
  Dificultad,
} from '../../../database/entities/problema.entity';
import { QueryProblemasDto } from '../dto/query-problemas.dto';

@Injectable()
export class ProblemasRepository {
  constructor(
    @InjectRepository(Problema)
    private readonly problemaRepository: Repository<Problema>,
  ) {}

  async crear(data: Partial<Problema>): Promise<Problema> {
    const problema = this.problemaRepository.create(data);
    return this.problemaRepository.save(problema);
  }

  async listarPorCompetencia(
    competenciaId: number,
    query: QueryProblemasDto,
  ): Promise<[Problema[], number]> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 100, 100);

    const qb = this.problemaRepository
      .createQueryBuilder('p')
      .where('p.competenciaId = :competenciaId', { competenciaId });

    if (query.search && query.search.trim().length > 0) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(p.titulo) LIKE :term OR LOWER(p.descripcion) LIKE :term)',
        { term },
      );
    }

    if (query.dificultad) {
      qb.andWhere('p.dificultad = :dificultad', {
        dificultad: query.dificultad,
      });
    }

    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return qb.getManyAndCount();
  }

  async buscarPorId(id: number): Promise<Problema | null> {
    return this.problemaRepository.findOne({
      where: { id },
      relations: ['competencia'],
    });
  }

  async buscarPorTituloEnCompetencia(
    titulo: string,
    competenciaId: number,
    excludeId?: number,
  ): Promise<Problema | null> {
    const qb = this.problemaRepository
      .createQueryBuilder('p')
      .where('LOWER(p.titulo) = LOWER(:titulo)', { titulo })
      .andWhere('p.competenciaId = :competenciaId', { competenciaId });
    if (excludeId !== undefined) {
      qb.andWhere('p.id != :excludeId', { excludeId });
    }
    return qb.getOne();
  }

  async actualizar(
    problema: Problema,
    data: Partial<Problema>,
  ): Promise<Problema> {
    this.problemaRepository.merge(problema, data);
    return this.problemaRepository.save(problema);
  }

  async eliminar(id: number): Promise<void> {
    await this.problemaRepository.softDelete(id);
  }

  async contarPorCompetencia(competenciaId: number): Promise<number> {
    return this.problemaRepository.count({
      where: { competencia: { id: competenciaId } },
    });
  }

  async contarPorDificultad(
    competenciaId: number,
  ): Promise<Record<Dificultad, number>> {
    const rows = await this.problemaRepository
      .createQueryBuilder('p')
      .select('p.dificultad', 'dificultad')
      .addSelect('COUNT(*)', 'total')
      .where('p.competenciaId = :competenciaId', { competenciaId })
      .groupBy('p.dificultad')
      .getRawMany<{ dificultad: Dificultad; total: string }>();

    const result: Record<Dificultad, number> = {
      [Dificultad.FACIL]: 0,
      [Dificultad.MEDIO]: 0,
      [Dificultad.DIFICIL]: 0,
    };
    for (const r of rows) {
      result[r.dificultad] = parseInt(r.total, 10) || 0;
    }
    return result;
  }

  async contarSolucionesPorProblema(
    problemaIds: number[],
  ): Promise<Map<number, { total: number; correctas: number }>> {
    if (problemaIds.length === 0) return new Map();
    const rows = await this.problemaRepository.manager.query<
      Array<{ problemaId: number; total: string; correctas: string }>
    >(
      `SELECT "problemaId" AS "problemaId",
              COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE estado = 'Correcto')::int AS correctas
         FROM soluciones
        WHERE "problemaId" = ANY($1)
          AND deleted_at IS NULL
        GROUP BY "problemaId"`,
      [problemaIds],
    );
    const map = new Map<number, { total: number; correctas: number }>();
    for (const r of rows) {
      map.set(Number(r.problemaId), {
        total: Number(r.total),
        correctas: Number(r.correctas),
      });
    }
    return map;
  }
}
