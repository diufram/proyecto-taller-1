import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solucion } from '../../../database/entities/solucion.entity';

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

  async buscarPorId(id: number): Promise<Solucion | null> {
    return this.solucionRepository.findOne({
      where: { id },
      relations: ['problema', 'problema.competencia', 'usuario'],
    });
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
