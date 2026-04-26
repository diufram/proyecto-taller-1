import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Competencia,
  Estado,
  Nivel,
  Tipo,
} from '../../database/entities/competencia.entity';

type FindCompetenciasParams = {
  page: number;
  limit: number;
  busqueda?: string;
  estado?: Estado;
  nivel_dificultad?: Nivel;
  tipo?: Tipo;
};

@Injectable()
export class CompetenciasRepository {
  constructor(
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
  ) {}

  async crear(data: Partial<Competencia>): Promise<Competencia> {
    const competencia = this.competenciaRepository.create(data);
    return this.competenciaRepository.save(competencia);
  }

  async listar(
    params: FindCompetenciasParams,
  ): Promise<[Competencia[], number]> {
    const query = this.competenciaRepository
      .createQueryBuilder('competencia')
      .orderBy('competencia.createdAt', 'DESC')
      .skip((params.page - 1) * params.limit)
      .take(params.limit);

    if (params.busqueda) {
      query.andWhere(
        '(competencia.nombre ILIKE :busqueda OR competencia.descripcion ILIKE :busqueda)',
        {
          busqueda: `%${params.busqueda}%`,
        },
      );
    }

    if (params.estado) {
      query.andWhere('competencia.estado = :estado', {
        estado: params.estado,
      });
    }

    if (params.nivel_dificultad) {
      query.andWhere('competencia.nivel_dificultad = :nivel_dificultad', {
        nivel_dificultad: params.nivel_dificultad,
      });
    }

    if (params.tipo) {
      query.andWhere('competencia.tipo = :tipo', {
        tipo: params.tipo,
      });
    }

    return query.getManyAndCount();
  }

  async buscarPorId(id: number): Promise<Competencia | null> {
    return this.competenciaRepository.findOne({ where: { id } });
  }

  async actualizar(
    competencia: Competencia,
    data: Partial<Competencia>,
  ): Promise<Competencia> {
    this.competenciaRepository.merge(competencia, data);
    return this.competenciaRepository.save(competencia);
  }

  async eliminar(id: number): Promise<void> {
    await this.competenciaRepository.softDelete(id);
  }
}
