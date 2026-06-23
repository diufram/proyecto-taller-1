import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import {
  Solucion,
  EstadoSolucion,
  Lenguaje,
} from '../../../database/entities/solucion.entity';
import { QuerySolucionesDto } from '../dto/query-soluciones.dto';

export interface ListarTodasFiltros {
  page: number;
  limit: number;
  estado?: EstadoSolucion;
  problema_id?: number;
  competencia_id?: number;
  lenguaje_programacion?: Lenguaje;
  search?: string;
}

export interface SolucionConPersona {
  solucion: Solucion;
  persona_nombre: string | null;
  persona_apellido: string | null;
}

@Injectable()
export class SolucionesRepository {
  constructor(
    @InjectRepository(Solucion)
    private readonly solucionRepository: Repository<Solucion>,
  ) {}

  async crear(data: Partial<Solucion>): Promise<Solucion> {
    const solucion = this.solucionRepository.create(data);
    return this.solucionRepository.save(solucion);
  }

  async listarTodas(
    filtros: ListarTodasFiltros,
  ): Promise<{ items: SolucionConPersona[]; total: number }> {
    const qb = this.solucionRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.problema', 'p')
      .leftJoinAndSelect('p.competencia', 'c')
      .leftJoinAndSelect('s.usuario', 'u')
      .leftJoin('personas', 'per', 'per.usuarioId = u.id')
      .addSelect('per.nombre', 'persona_nombre')
      .addSelect('per.apellido', 'persona_apellido')
      .orderBy('s.createdAt', 'DESC')
      .skip((filtros.page - 1) * filtros.limit)
      .take(filtros.limit);

    if (filtros.estado) {
      qb.andWhere('s.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.problema_id) {
      qb.andWhere('p.id = :problemaId', { problemaId: filtros.problema_id });
    }

    if (filtros.competencia_id) {
      qb.andWhere('c.id = :competenciaId', {
        competenciaId: filtros.competencia_id,
      });
    }

    if (filtros.lenguaje_programacion) {
      qb.andWhere('s.lenguaje_programacion = :lenguaje', {
        lenguaje: filtros.lenguaje_programacion,
      });
    }

    if (filtros.search && filtros.search.trim()) {
      const term = `%${filtros.search.trim()}%`;
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('u.nombre_usuario ILIKE :term', { term })
            .orWhere('p.titulo ILIKE :term', { term })
            .orWhere('per.nombre ILIKE :term', { term })
            .orWhere('per.apellido ILIKE :term', { term });
        }),
      );
    }

    const { entities, raw } = await qb.getRawAndEntities();

    const items: SolucionConPersona[] = entities.map((solucion, idx) => {
      const r = raw[idx] as {
        persona_nombre?: string | null;
        persona_apellido?: string | null;
      };
      return {
        solucion,
        persona_nombre: r?.persona_nombre ?? null,
        persona_apellido: r?.persona_apellido ?? null,
      };
    });

    const total = await qb.getCount();

    return { items, total };
  }

  async listarPorUsuario(
    usuarioId: number,
    page: number,
    limit: number,
  ): Promise<[Solucion[], number]> {
    return this.solucionRepository.findAndCount({
      where: { usuario: { id: usuarioId } },
      relations: ['problema', 'problema.competencia'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async listarPorProblema(
    problemaId: number,
    page: number,
    limit: number,
  ): Promise<[Solucion[], number]> {
    return this.solucionRepository.findAndCount({
      where: { problema: { id: problemaId } },
      relations: ['usuario'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async buscarPorId(id: number): Promise<SolucionConPersona | null> {
    const { entities, raw } = await this.solucionRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.problema', 'p')
      .leftJoinAndSelect('p.competencia', 'c')
      .leftJoinAndSelect('s.usuario', 'u')
      .leftJoin('personas', 'per', 'per.usuarioId = u.id')
      .addSelect('per.nombre', 'persona_nombre')
      .addSelect('per.apellido', 'persona_apellido')
      .where('s.id = :id', { id })
      .getRawAndEntities();

    if (!entities.length) return null;

    const r = raw[0] as {
      persona_nombre?: string | null;
      persona_apellido?: string | null;
    };

    return {
      solucion: entities[0],
      persona_nombre: r?.persona_nombre ?? null,
      persona_apellido: r?.persona_apellido ?? null,
    };
  }

  async actualizar(
    solucion: Solucion,
    data: Partial<Solucion>,
  ): Promise<Solucion> {
    this.solucionRepository.merge(solucion, data);
    return this.solucionRepository.save(solucion);
  }

  async eliminar(id: number): Promise<void> {
    await this.solucionRepository.softDelete(id);
  }

  async existeSolucionPrevia(
    usuarioId: number,
    problemaId: number,
  ): Promise<boolean> {
    const count = await this.solucionRepository.count({
      where: { usuario: { id: usuarioId }, problema: { id: problemaId } },
    });
    return count > 0;
  }
}
