import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competencia } from '../../database/entities/competencia.entity';

type FindCompetenciasParams = {
  page: number;
  limit: number;
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
    return this.competenciaRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    });
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
