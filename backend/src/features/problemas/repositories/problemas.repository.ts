import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problema } from '../../../database/entities/problema.entity';

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
    page: number,
    limit: number,
  ): Promise<[Problema[], number]> {
    return this.problemaRepository.findAndCount({
      where: { competencia: { id: competenciaId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async buscarPorId(id: number): Promise<Problema | null> {
    return this.problemaRepository.findOne({
      where: { id },
      relations: ['competencia'],
    });
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
}