import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProblemasRepository } from '../repositories/problemas.repository';
import { CreateProblemaDto } from '../dto/create-problema.dto';
import { QueryProblemasDto } from '../dto/query-problemas.dto';
import { UpdateProblemaDto } from '../dto/update-problema.dto';
import { Competencia, Estado } from '../../../database/entities/competencia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProblemasService {
  constructor(
    private readonly problemasRepository: ProblemasRepository,
    @InjectRepository(Competencia)
    private readonly competenciaRepository: Repository<Competencia>,
  ) {}

  async create(dto: CreateProblemaDto, competenciaId: number) {
    const competencia = await this.competenciaRepository.findOne({
      where: { id: competenciaId },
    });

    if (!competencia) {
      throw new NotFoundException('Competencia no encontrada.');
    }

    this.validarEstadoCompetencia(competencia, 'crear');

    const problema = await this.problemasRepository.crear({
      ...dto,
      competencia,
    });

    return {
      problema: this.serializarProblema(problema),
      message: 'Problema creado exitosamente.',
    };
  }

  async findAllPorCompetencia(competenciaId: number, query: QueryProblemasDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);

    const [problemas, total] = await this.problemasRepository.listarPorCompetencia(
      competenciaId,
      page,
      limit,
    );

    return {
      items: problemas.map((p) => this.serializarProblema(p)),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const problema = await this.problemasRepository.buscarPorId(id);
    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    return {
      problema: this.serializarProblema(problema),
    };
  }

  async update(id: number, dto: UpdateProblemaDto) {
    const problema = await this.problemasRepository.buscarPorId(id);
    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    this.validarEstadoCompetencia(problema.competencia, 'actualizar');

    const actualizada = await this.problemasRepository.actualizar(problema, dto);

    return {
      problema: this.serializarProblema(actualizada),
      message: 'Problema actualizado exitosamente.',
    };
  }

  async remove(id: number) {
    const problema = await this.problemasRepository.buscarPorId(id);
    if (!problema) {
      throw new NotFoundException('Problema no encontrado.');
    }

    this.validarEstadoCompetencia(problema.competencia, 'eliminar');

    await this.problemasRepository.eliminar(id);

    return {
      message: 'Problema eliminado exitosamente.',
    };
  }

  private validarEstadoCompetencia(
    competencia: Competencia,
    accion: 'crear' | 'actualizar' | 'eliminar',
  ): void {
    if (
      competencia.estado === Estado.FINALIZADA ||
      competencia.estado === Estado.CANCELADA
    ) {
      throw new UnprocessableEntityException(
        `No se puede ${accion} un problema porque la competencia está ${competencia.estado.toLowerCase()}.`,
      );
    }
  }

  private serializarProblema(problema: any) {
    return {
      id: problema.id,
      titulo: problema.titulo,
      descripcion: problema.descripcion,
      dificultad: problema.dificultad,
      formato_entrada: problema.formato_entrada,
      formato_salida: problema.formato_salida,
      ejemplo_entrada: problema.ejemplo_entrada,
      ejemplo_salida: problema.ejemplo_salida,
      competencia_id: problema.competencia?.id,
      created_at: problema.createdAt,
      updated_at: problema.updatedAt,
    };
  }
}